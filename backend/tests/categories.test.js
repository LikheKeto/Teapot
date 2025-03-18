const {
  createCategoryHandler,
  editCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
} = require("../src/controllers/categoryController");

const {
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
} = require("../src/models/categoryModel");

jest.mock("../src/models/categoryModel");
jest.mock("../src/utils/logger");

describe("Category Controller Unit Tests", () => {
  let userId = 1;
  let categoryId = 101;
  let categoryData = { name: "Test Category" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case for createCategoryHandler
  test("createCategoryHandler should create a category", async () => {
    createCategory.mockResolvedValue({ id: 102, ...categoryData });

    const req = { user: { id: userId }, body: categoryData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createCategoryHandler(req, res);

    expect(createCategory).toHaveBeenCalledWith(categoryData.name, userId);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 102, ...categoryData });
  });

  test("createCategoryHandler should return 400 if validation fails", async () => {
    const invalidData = { name: "" };
    const req = { user: { id: userId }, body: invalidData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { name: expect.any(Array) },
    });
  });

  test("createCategoryHandler should return 409 if category already exists", async () => {
    const req = { user: { id: userId }, body: categoryData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    createCategory.mockRejectedValueOnce({ code: "23505" });

    await createCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: { category: "Category with this name already exists" },
    });
  });

  // Test case for getCategoriesHandler
  test("getCategoriesHandler should fetch categories", async () => {
    const mockCategories = [{ id: categoryId, name: "Category 1" }];
    getCategories.mockResolvedValue(mockCategories);

    const req = { user: { id: userId } };
    const res = {
      json: jest.fn(),
    };

    await getCategoriesHandler(req, res);

    expect(getCategories).toHaveBeenCalledWith(userId);
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });

  // Test case for editCategoryHandler
  test("editCategoryHandler should edit the category", async () => {
    const updatedData = { name: "Updated Category" };
    const updatedCategory = { id: categoryId, ...updatedData };
    editCategory.mockResolvedValue(updatedCategory);

    const req = {
      user: { id: userId },
      body: updatedData,
      params: { categoryId: categoryId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await editCategoryHandler(req, res);

    expect(editCategory).toHaveBeenCalledWith(
      categoryId,
      updatedData.name,
      userId
    );
    expect(res.json).toHaveBeenCalledWith(updatedCategory);
  });

  test("editCategoryHandler should return 404 if category not found", async () => {
    const updatedData = { name: "Updated Category" };
    editCategory.mockResolvedValue(null);

    const req = {
      user: { id: userId },
      body: updatedData,
      params: { categoryId: categoryId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await editCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Category not found" });
  });

  // Test case for deleteCategoryHandler
  test("deleteCategoryHandler should delete the category", async () => {
    deleteCategory.mockResolvedValue(true);

    const req = { user: { id: userId }, params: { categoryId: categoryId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deleteCategoryHandler(req, res);

    expect(deleteCategory).toHaveBeenCalledWith(categoryId, userId);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("deleteCategoryHandler should return 500 if deletion fails", async () => {
    deleteCategory.mockRejectedValue(new Error("Deletion failed"));

    const req = { user: { id: userId }, params: { categoryId: categoryId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deleteCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Deletion failed" });
  });
});
