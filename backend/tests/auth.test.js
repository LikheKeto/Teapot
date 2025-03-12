const request = require("supertest");
const server = require("../src/server");
const pool = require("../src/db");

describe("Auth Routes", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM users");
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  });

  it("should register a new user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should login with valid credentials", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
