const { createNote, getNotesByUserId } = require("../models/noteModel");

const createNoteHandler = async (req, res) => {
  const { title, content } = req.body;

  const noteInput = { title, content };
  const validationFailed = validate(noteInput, noteConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;

  try {
    const result = await createNote(title, content, userId);
    res.status(201).json(result.rows[0]);
    logger.info(`User with ID: '${userId}' created a new note`);
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(err.message);
  }
};

const getNotesHandler = async (req, res) => {
  const userId = req.user.id;
  let { page = 1, limit = 10, searchTerm = "" } = req.body;

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  try {
    const notes = await getNotesByUserId(userId);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(err.message);
  }
};

module.exports = {
  createNoteHandler,
  getNotesHandler,
};
