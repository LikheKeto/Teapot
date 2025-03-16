const {
  getCategories,
  editCategory,
  createCategory,
  deleteCategory,
} = require("../models/categoryModel");
const validate = require("validate.js");
const { categoryConstraints } = require("../utils/constraints");
const logger = require("../utils/logger");

const getCategoriesHandler = async (req, res) => {
  // Controller for fetching all categories belonging to a user
  const userId = req.user.id;

  try {
    const categories = await getCategories(userId);
    res.json(categories);
  } catch (err) {
    logger.error(`Error fetching categories for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const editCategoryHandler = async (req, res) => {
  // Controller for editing contents of a category
  const { name } = req.body;

  const validationFailed = validate({ name }, categoryConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;
  const categoryId = req.params.categoryId;

  try {
    const category = await editCategory(categoryId, name, userId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    logger.error(`Error editing category: ${categoryId} for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const deleteCategoryHandler = async (req, res) => {
  // Controller for deleting category
  const userId = req.user.id;
  const categoryId = req.params.categoryId;

  try {
    await deleteCategory(categoryId, userId);
    res.json({ success: true });
  } catch (err) {
    logger.error(`Error deleting category: ${categoryId} for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const createCategoryHandler = async (req, res) => {
  // Controller for creating a category
  const { name } = req.body;

  const validationFailed = validate({ name }, categoryConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const userId = req.user.id;

  try {
    const category = await createCategory(name, userId);
    res.status(201).json(category);
    logger.info(`Category created by user: '${userId}'`);
  } catch (err) {
    logger.error(`Error creating category for user: ${userId}`, {
      error: err.message,
      stack: err.stack,
    });
    if (err.code === "23505") {
      return res.status(409).json({
        error: { category: "Category with this name already exists" },
      });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCategoryHandler,
  editCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
};
