const pool = require("../db");

const createNote = async (title, content, userId) => {
  const result = await pool.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, userId]
  );
  return result.rows[0];
};

const editNote = async (id, title, content, userId) => {
  const result = await pool.query(
    "UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, content, id, userId]
  );
  return result.rows[0];
};

const getNote = async (id, userId) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  return result.rows[0];
};

const deleteNote = async (id, userId) => {
  await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  return true;
};

const getNotesByUserId = async (userId, offset, limit, searchTerm) => {
  let searchQuery = "";
  let params;

  if (searchTerm) {
    searchQuery = "AND (title ILIKE $3 OR content ILIKE $3)";
    params = [userId, limit, `%${searchTerm}%`, offset];
  } else {
    params = [userId, limit, offset];
  }

  const query = `
      SELECT * FROM notes
      WHERE user_id = $1 ${searchQuery}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $${searchTerm ? 4 : 3}
    `;

  const result = await pool.query(query, params);

  let countParams;
  if (searchTerm) {
    countParams = [userId, `%${searchTerm}%`];
    searchQuery = "AND (title ILIKE $2 OR content ILIKE $2)"; //adjust search query for count query
  } else {
    countParams = [userId];
    searchQuery = ""; // no search query for count query
  }

  const countQuery = `
      SELECT COUNT(*) FROM notes
      WHERE user_id = $1 ${searchQuery}
    `;
  const countResult = await pool.query(countQuery, countParams);

  const totalNotes = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalNotes / limit);
  const currentPage = Math.ceil((offset + limit) / limit); // calculate current page

  return {
    notes: result.rows,
    pagination: {
      currentPage: currentPage,
      totalPages,
      totalNotes,
    },
  };
};

module.exports = {
  getNote,
  createNote,
  editNote,
  deleteNote,
  getNotesByUserId,
};
