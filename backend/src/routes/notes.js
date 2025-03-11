const express = require("express");
const authMiddleware = require("../middlewares/auth");
const pool = require("../db");
const logger = require("../utils/logger");
const { noteConstraints } = require("../utils/constraints");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  const noteInput = { title, content };
  const validationFailed = validate(noteInput, noteConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );
    res.status(201).json(result.rows[0]);
    logger.info(`User with ID: '${userId}' created a new note`);
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(err.message);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  let { page = 1, limit = 10, searchTerm = "" } = req.body;

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  try {
    const searchQuery = searchTerm
      ? "AND (title ILIKE $3 OR content ILIKE $3)"
      : "";

    const query = `
      SELECT * FROM notes
      WHERE user_id = $1 ${searchQuery}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $4
    `;

    const params = searchTerm
      ? [userId, limit, `%${searchTerm}%`, offset]
      : [userId, limit, offset];

    const result = await pool.query(query, params);

    const countQuery = `
    SELECT COUNT(*) FROM notes
    WHERE user_id = $1 ${searchQuery}
  `;
    const countResult = await pool.query(
      countQuery,
      searchTerm ? [userId, `%${searchTerm}%`] : [userId]
    );

    const totalNotes = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalNotes / limit);

    res.json({
      notes: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotes,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(err.message);
  }
});
