const request = require("supertest");
const server = require("../src/server");
const pool = require("../src/db");
const jwt = require("jsonwebtoken");
const config = require("../src/utils/config");

describe("Note Routes", () => {
  let token;
  let userId;
  let noteId;

  beforeAll(async () => {
    await pool.query("DELETE FROM notes");
    await pool.query("DELETE FROM users");
    const userRes = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["testuser", "test@example.com", "password123"]
    );
    userId = userRes.rows[0].id;
    token = jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "24h" });
  });

  afterAll(async () => {
    await pool.query("DELETE FROM notes");
    await pool.query("DELETE FROM users");
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  });

  describe("POST /notes", () => {
    it("should create a new note", async () => {
      const res = await request(server)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test Note", content: "Test Content" });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("title", "Test Note");
      noteId = res.body.id;
    });

    it("should return 400 on validation failure", async () => {
      const res = await request(server)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "", content: "Test Content" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /notes/:id", () => {
    it("should retrieve a note", async () => {
      const res = await request(server)
        .get(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", noteId);
    });

    it("should return 404 if note not found", async () => {
      const res = await request(server)
        .get(`/api/notes/99999`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Note not found");
    });
  });

  describe("PATCH /notes/:id", () => {
    beforeEach(async () => {
      // Recreate the note before each edit test
      await pool.query(
        "INSERT INTO notes (id, title, content, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
        [noteId, "Original Title", "Original Content", userId]
      );
    });

    it("should update a note", async () => {
      const res = await request(server)
        .patch(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Note", content: "Updated Content" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("title", "Updated Note");
    });

    it("should return 404 if note not found", async () => {
      const res = await request(server)
        .patch(`/api/notes/99999`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Note", content: "Updated Content" });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Note not found");
    });

    it("should return 400 on validation failure", async () => {
      const res = await request(server)
        .patch(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "", content: "Updated Content" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /notes/:id", () => {
    it("should delete a note", async () => {
      const res = await request(server)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ success: true });
    });

    it("should return 500 if error occurs", async () => {
      await pool.query("ALTER TABLE notes DROP COLUMN user_id;");
      const res = await request(server)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(500);
      await pool.query(
        "ALTER TABLE notes ADD COLUMN user_id INTEGER REFERENCES users(id);"
      );
    });
  });

  describe("GET /notes", () => {
    it("should retrieve all notes for a user", async () => {
      await pool.query(
        "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3)",
        ["Test Note", "Test Content", userId]
      );
      const res = await request(server)
        .get("/api/notes")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.notes).toBeDefined();
    });

    it("should handle pagination", async () => {
      const res = await request(server)
        .get("/api/notes?page=1&limit=1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.notes.length).toEqual(1);
    });

    it("should handle search", async () => {
      const res = await request(server)
        .get("/api/notes?searchTerm=Test")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.notes.length).toBeGreaterThan(0);
    });
  });
});
