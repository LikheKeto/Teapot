const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  createCategoryHandler,
  getCategoriesHandler,
  editCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", authMiddleware, createCategoryHandler);
router.get("/", authMiddleware, getCategoriesHandler);
// router.get("/:noteId", authMiddleware, getNoteHandler);
router.put("/:categoryId", authMiddleware, editCategoryHandler);
router.delete("/:categoryId", authMiddleware, deleteCategoryHandler);

module.exports = router;
