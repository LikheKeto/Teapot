const {
  createNoteHandler,
  getNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
  getNotesHandler,
  assignToCategoryHandler,
  deassignCategoryHandler,
} = require("../src/controllers/noteController");
const {
  createNote,
  getNote,
  editNote,
  deleteNote,
  getNotesByUserId,
  assignNote,
  deassignNote,
} = require("../src/models/noteModel");

jest.mock("../src/models/noteModel");
jest.mock("../src/utils/logger");

describe("Notes Controller Unit Tests", () => {
  let userId = 1;
  let noteId = 101;
  let noteData = { title: "Test Title", content: "Test Content" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case for createNoteHandler
  test("createNoteHandler should create a note", async () => {
    createNote.mockResolvedValue({ id: 102, ...noteData });

    const req = { user: { id: userId }, body: noteData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createNoteHandler(req, res);

    expect(createNote).toHaveBeenCalledWith(
      noteData.title,
      noteData.content,
      userId
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 102, ...noteData });
  });

  test("createNoteHandler should return 400 if validation fails", async () => {
    const invalidData = { title: "", content: "" };
    const req = { user: { id: userId }, body: invalidData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createNoteHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        title: expect.any(Array),
        content: expect.any(Array),
      },
    });
  });

  // Test case for getNoteHandler
  test("getNoteHandler should fetch a note", async () => {
    const mockNote = {
      id: noteId,
      title: "Note Title",
      content: "Note Content",
    };
    getNote.mockResolvedValue(mockNote);

    const req = { user: { id: userId }, params: { noteId: noteId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getNoteHandler(req, res);

    expect(getNote).toHaveBeenCalledWith(noteId, userId);
    expect(res.json).toHaveBeenCalledWith(mockNote);
  });

  test("getNoteHandler should return 404 if note not found", async () => {
    getNote.mockResolvedValue(null);

    const req = { user: { id: userId }, params: { noteId: noteId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getNoteHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Note not found" });
  });

  // Test case for editNoteHandler
  test("editNoteHandler should update the note", async () => {
    const updatedData = { title: "Updated Title", content: "Updated Content" };
    const updatedNote = { id: noteId, ...updatedData };
    editNote.mockResolvedValue(updatedNote);

    const req = {
      user: { id: userId },
      body: updatedData,
      params: { noteId: noteId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await editNoteHandler(req, res);

    expect(editNote).toHaveBeenCalledWith(
      noteId,
      updatedData.title,
      updatedData.content,
      userId
    );
    expect(res.json).toHaveBeenCalledWith(updatedNote);
  });

  test("editNoteHandler should return 404 if note not found during edit", async () => {
    const updatedData = { title: "Updated Title", content: "Updated Content" };
    editNote.mockResolvedValue(null);

    const req = {
      user: { id: userId },
      body: updatedData,
      params: { noteId: noteId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await editNoteHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Note not found" });
  });

  // Test case for deleteNoteHandler
  test("deleteNoteHandler should delete the note", async () => {
    deleteNote.mockResolvedValue(true);

    const req = { user: { id: userId }, params: { noteId: noteId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deleteNoteHandler(req, res);

    expect(deleteNote).toHaveBeenCalledWith(noteId, userId);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  // Test case for getNotesHandler
  test("getNotesHandler should fetch notes with pagination", async () => {
    const mockNotes = [{ id: noteId, title: "Note 1", content: "Content 1" }];
    getNotesByUserId.mockResolvedValue(mockNotes);

    const req = { user: { id: userId }, query: { page: 1, limit: 10 } };
    const res = {
      json: jest.fn(),
    };

    await getNotesHandler(req, res);

    expect(getNotesByUserId).toHaveBeenCalledWith(
      userId,
      0,
      10,
      "",
      "created_at",
      "DESC",
      NaN
    );
    expect(res.json).toHaveBeenCalledWith(mockNotes);
  });

  // Test case for assignToCategoryHandler
  test("assignToCategoryHandler should assign a note to a category", async () => {
    const assignData = { noteId, categoryId: 1 };
    assignNote.mockResolvedValue(false);

    const req = { user: { id: userId }, body: assignData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await assignToCategoryHandler(req, res);

    expect(assignNote).toHaveBeenCalledWith(
      noteId,
      assignData.categoryId,
      userId
    );
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("assignToCategoryHandler should return 400 if assignment fails", async () => {
    const assignData = { noteId, categoryId: 1 };
    assignNote.mockResolvedValue("Unauthorized");

    const req = { user: { id: userId }, body: assignData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await assignToCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  // Test case for deassignCategoryHandler
  test("deassignCategoryHandler should deassign a note from a category", async () => {
    const deassignData = { noteId, categoryId: 1 };
    deassignNote.mockResolvedValue(true);

    const req = { user: { id: userId }, body: deassignData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deassignCategoryHandler(req, res);

    expect(deassignNote).toHaveBeenCalledWith(
      noteId,
      deassignData.categoryId,
      userId
    );
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("deassignCategoryHandler should return 400 if deassigning fails", async () => {
    const deassignData = { noteId, categoryId: 1 };
    deassignNote.mockResolvedValue("Unauthorized");

    const req = { user: { id: userId }, body: deassignData };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deassignCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});
