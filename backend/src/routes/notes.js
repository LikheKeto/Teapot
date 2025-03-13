const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  createNoteHandler,
  getNotesHandler,
  getNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
  assignToCategoryHandler,
  deassignCategoryHandler,
} = require("../controllers/noteController");

const router = express.Router();

router.post("/", authMiddleware, createNoteHandler);
router.get("/", authMiddleware, getNotesHandler);
router.get("/:noteId", authMiddleware, getNoteHandler);
router.put("/:noteId", authMiddleware, editNoteHandler);
router.delete("/:noteId", authMiddleware, deleteNoteHandler);
router.post("/assign", authMiddleware, assignToCategoryHandler);
router.post("/deassign", authMiddleware, deassignCategoryHandler);

module.exports = router;
