const {
  createNote,
  getNote,
  editNote,
  deleteNote,
  getNotesByUserId,
  assignNote,
  deassignNote,
} = require("../models/noteModel");
const validate = require("validate.js");
const { noteConstraints, assignConstraints } = require("../utils/constraints");
const logger = require("../utils/logger");

const getNoteHandler = async (req, res) => {
  // Controller for fetching a single note belonging to a user
  const userId = req.user.id;
  const noteId = req.params.noteId;

  try {
    const note = await getNote(noteId, userId);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (err) {
    logger.error(`Error fetching note: ${noteId} for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const editNoteHandler = async (req, res) => {
  // Controller for editing contents of a note
  const { title, content } = req.body;

  const noteInput = { title, content };
  const validationFailed = validate(noteInput, noteConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;
  const noteId = req.params.noteId;

  try {
    const note = await editNote(noteId, title, content, userId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    logger.info(`Note edited successfully: ${noteId} for user: ${userId}`);
    return res.json(note);
  } catch (err) {
    logger.error(`Error editing note: ${noteId} for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const deleteNoteHandler = async (req, res) => {
  // Controller for deleting note
  const userId = req.user.id;
  const noteId = req.params.noteId;

  try {
    const deleted = await deleteNote(noteId, userId);
    logger.info(`Note deleted successfully: ${noteId} for user: ${userId}`);
    return res.json({ success: deleted });
  } catch (err) {
    logger.error(`Error deleting note: ${noteId} for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const createNoteHandler = async (req, res) => {
  // Controller for creating a note
  const { title, content } = req.body;

  const noteInput = { title, content };
  const validationFailed = validate(noteInput, noteConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;

  try {
    const note = await createNote(title, content, userId);
    res.status(201).json(note);
    logger.info(`Note created successfully: ${note.id} by user: ${userId}`);
  } catch (err) {
    logger.error(`Error creating note for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const getNotesHandler = async (req, res) => {
  // Controller for fetching all notes of user; with pagination and search
  const userId = req.user.id;
  let {
    page = 1,
    limit = 10,
    searchTerm = "",
    sortBy = "created_at",
    sortOrder = "DESC",
    categoryId = null,
  } = req.query;

  // Validate sortBy and sortOrder
  const validSortColumns = ["created_at", "updated_at", "title"];
  const validSortOrders = ["ASC", "DESC"];

  if (!validSortColumns.includes(sortBy)) {
    return res.status(400).json({
      error: "Invalid sort column. Use 'created_at', 'updated_at', or 'title'",
    });
  }

  if (!validSortOrders.includes(sortOrder)) {
    return res
      .status(400)
      .json({ error: "Invalid sort order. Use 'ASC' or 'DESC'" });
  }

  page = parseInt(page);
  limit = parseInt(limit);
  categoryId = parseInt(categoryId);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  try {
    const notes = await getNotesByUserId(
      userId,
      offset,
      limit,
      searchTerm,
      sortBy,
      sortOrder,
      categoryId
    );
    res.json(notes);
  } catch (err) {
    logger.error(`Error fetching notes for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const assignToCategoryHandler = async (req, res) => {
  // Controller for assigning a note to a category
  const { noteId, categoryId } = req.body;

  const assignInput = { noteId, categoryId };
  const validationFailed = validate(assignInput, assignConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;
  try {
    const unauthorized = await assignNote(noteId, categoryId, userId);
    if (unauthorized) {
      return res.status(400).json({ error: unauthorized });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error(
      `Error assigning note: ${noteId} to category: ${categoryId} by user: ${userId}`,
      {
        error: err.message,
        stack: err.stack,
      }
    );
    res.status(500).json({ error: err.message });
  }
};

const deassignCategoryHandler = async (req, res) => {
  // Controller for deassigning a note from category
  const { noteId, categoryId } = req.body;

  const assignInput = { noteId, categoryId };
  const validationFailed = validate(assignInput, assignConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;

  try {
    const unauthorized = await deassignNote(noteId, categoryId, userId);
    if (unauthorized) {
      return res.status(400).json({ error: unauthorized });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error(
      `Error deassigning note: ${noteId} from category: ${categoryId} by user: ${userId}`,
      {
        error: err.message,
        stack: err.stack,
      }
    );
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNoteHandler,
  getNotesHandler,
  getNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
  assignToCategoryHandler,
  deassignCategoryHandler,
};
