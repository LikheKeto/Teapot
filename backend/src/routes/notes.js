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

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API for managing notes
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     description: Creates a note for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Note
 *               content:
 *                 type: string
 *                 example: This is the content of my note.
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createNoteHandler);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     description: Fetches all notes for the authenticated user with pagination and optional search.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: searchTerm
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [created_at, updated_at, title]
 *           default: created_at
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: A list of notes
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getNotesHandler);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a single note
 *     description: Fetches a specific note belonging to the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note details
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.get("/:noteId", authMiddleware, getNoteHandler);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Edit a note
 *     description: Updates the content of a note belonging to the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Note Title
 *               content:
 *                 type: string
 *                 example: Updated content of the note.
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.put("/:noteId", authMiddleware, editNoteHandler);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note belonging to the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:noteId", authMiddleware, deleteNoteHandler);

/**
 * @swagger
 * /api/notes/assign:
 *   post:
 *     summary: Assign a note to a category
 *     description: Links a note to a category for organization.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noteId
 *               - categoryId
 *             properties:
 *               noteId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Note assigned to category successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post("/assign", authMiddleware, assignToCategoryHandler);

/**
 * @swagger
 * /api/notes/deassign:
 *   post:
 *     summary: Remove a note from a category
 *     description: Unlinks a note from a category.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noteId
 *               - categoryId
 *             properties:
 *               noteId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Note removed from category successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post("/deassign", authMiddleware, deassignCategoryHandler);

module.exports = router;
