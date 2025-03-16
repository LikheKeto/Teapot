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
  const query = `
      SELECT 
        n.id, 
        n.title, 
        n.content, 
        n.created_at, 
        n.updated_at, 
        COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
      FROM notes n
      LEFT JOIN note_categories nc ON n.id = nc.note_id
      LEFT JOIN categories c ON nc.category_id = c.id
      WHERE n.id = $1 AND n.user_id = $2
      GROUP BY n.id
    `;

  const result = await pool.query(query, [id, userId]);

  return result.rows[0];
};

const deleteNote = async (id, userId) => {
  await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  return true;
};

const assignNote = async (id, categoryId, userId) => {
  // Check if the note belongs to the user
  const noteCheck = await pool.query(
    "SELECT id FROM notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  if (noteCheck.rows.length === 0) {
    return "Note does not exist";
  }

  // Check if the category belongs to the user
  const categoryCheck = await pool.query(
    "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
    [categoryId, userId]
  );

  if (categoryCheck.rows.length === 0) {
    return "Category does not exist";
  }

  // If both checks pass, create the relationship
  await pool.query(
    "INSERT INTO note_categories (note_id, category_id) VALUES ($1, $2)",
    [id, categoryId]
  );
  return false;
};

const deassignNote = async (id, categoryId, userId) => {
  // Check if the note belongs to the user
  const noteCheck = await pool.query(
    "SELECT id FROM notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  if (noteCheck.rows.length === 0) {
    return "Note does not exist";
  }

  // Check if the category belongs to the user
  const categoryCheck = await pool.query(
    "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
    [categoryId, userId]
  );

  if (categoryCheck.rows.length === 0) {
    return "Category does not exist";
  }

  // If both checks pass, create the relationship
  await pool.query(
    "DELETE FROM note_categories WHERE note_id = $1 AND category_id = $2",
    [id, categoryId]
  );
  return false;
};

const getNotesByUserId = async (
  userId,
  offset,
  limit,
  searchTerm = "",
  sortBy = "created_at",
  sortOrder = "DESC",
  categoryId = null
) => {
  let params = [userId]; // Start with userId

  let searchQuery = "";
  if (searchTerm.trim()) {
    searchQuery = `AND (n.title ILIKE $${
      params.length + 1
    } OR n.content ILIKE $${params.length + 1})`;
    params.push(`%${searchTerm}%`);
  }

  let categoryQuery = "";
  if (categoryId) {
    categoryQuery = `AND c.id = $${params.length + 1}`;
    params.push(categoryId);
  }

  params.push(limit, offset); // Add limit and offset at the end

  const query = `
        SELECT 
          n.id, 
          n.title, 
          n.content, 
          n.created_at, 
          n.updated_at, 
          COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) 
          FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
        FROM notes n
        LEFT JOIN note_categories nc ON n.id = nc.note_id
        LEFT JOIN categories c ON nc.category_id = c.id
        WHERE n.user_id = $1 ${searchQuery} ${categoryQuery}
        GROUP BY n.id
        ORDER BY n.${sortBy} ${sortOrder}
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `;

  const result = await pool.query(query, params);

  // Construct the count query
  let countParams = [userId];
  let countQuery = `
        SELECT COUNT(DISTINCT n.id) 
        FROM notes n
        LEFT JOIN note_categories nc ON n.id = nc.note_id
        LEFT JOIN categories c ON nc.category_id = c.id
        WHERE n.user_id = $1
      `;

  if (searchTerm.trim()) {
    countQuery += ` AND (n.title ILIKE $${
      countParams.length + 1
    } OR n.content ILIKE $${countParams.length + 1})`;
    countParams.push(`%${searchTerm}%`);
  }

  if (categoryId) {
    countQuery += ` AND c.id = $${countParams.length + 1}`;
    countParams.push(categoryId);
  }

  const countResult = await pool.query(countQuery, countParams);
  const totalNotes = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalNotes / limit);
  const currentPage = Math.ceil((offset + limit) / limit);

  return {
    notes: result.rows,
    pagination: {
      currentPage,
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
  assignNote,
  deassignNote,
};
