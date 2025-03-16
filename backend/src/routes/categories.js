const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  createCategoryHandler,
  getCategoriesHandler,
  editCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/categoryController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Creates a category for the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       409:
 *         description: Category with this name already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createCategoryHandler);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Fetches all categories belonging to the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getCategoriesHandler);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Edit a category
 *     description: Updates the name of a category belonging to the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: categoryId
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.put("/:categoryId", authMiddleware, editCategoryHandler);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category belonging to the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:categoryId", authMiddleware, deleteCategoryHandler);

module.exports = router;
