const pool = require("../db");

const createCategory = async (name, userId) => {
  const result = await pool.query(
    "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *",
    [name, userId]
  );
  return result.rows[0];
};

const editCategory = async (id, name, userId) => {
  const result = await pool.query(
    "UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [name, id, userId]
  );
  return result.rows[0];
};

const deleteCategory = async (id, userId) => {
  await pool.query("DELETE FROM categories WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  return true;
};

const getCategories = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM categories WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

module.exports = {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
};
