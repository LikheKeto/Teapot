const pool = require("../db");

const createNote = async (title, content, userId) => {
  const result = await pool.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, userId]
  );
  return result.rows[0];
};

const getNotesByUserId = async (userId, offset, limit, searchTerm) => {
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

  return {
    notes: result.rows,
    pagination: {
      currentPage: page,
      totalPages,
      totalNotes,
    },
  };
};

module.exports = {
  createNote,
  getNotesByUserId,
};
