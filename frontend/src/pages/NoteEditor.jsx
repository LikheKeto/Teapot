import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Alert, Select, Spinner, Badge } from "flowbite-react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "../components/MenuBar";

import "../App.css";

export default function NoteEditor() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams();

  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Idle"); // "Idle" | "Saving..." | "Saved" | "Failed"

  const [categories, setCategories] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content: formData.content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/notes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch note");
        const data = await response.json();
        setFormData({ title: data.title, content: data.content });
        setAssignedCategories(data.categories || []);

        if (editor) editor.commands.setContent(data.content);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, token, editor]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchCategories();
  }, [token]);

  const saveNote = async () => {
    if (!formData.title.trim() && !formData.content.trim()) return;

    setSaveStatus("Saving...");
    const method = id ? "PUT" : "POST";
    const endpoint = id
      ? `${import.meta.env.VITE_API_ENDPOINT}/api/notes/${id}`
      : `${import.meta.env.VITE_API_ENDPOINT}/api/notes`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const newNote = await response.json();
      toast.success("Note saved successfully!");
      if (!id) navigate(`/notes/${newNote.id}`);
      setSaveStatus("Saved");
    } catch (err) {
      setSaveStatus("Failed");
      toast.error(err.message);
    }
  };

  const assignCategory = async () => {
    if (!id || !selectedCategory) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notes/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            noteId: parseInt(id),
            categoryId: parseInt(selectedCategory),
          }),
        }
      );

      if (!response.ok)
        throw new Error(
          (await response.json()).error || "Failed to assign category"
        );

      const newCategory = categories.find(
        (c) => c.id === parseInt(selectedCategory)
      );
      setAssignedCategories([...assignedCategories, newCategory]);
      toast.success("Category assigned!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deassignCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notes/deassign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ noteId: parseInt(id), categoryId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove category");

      setAssignedCategories(
        assignedCategories.filter((c) => c.id !== categoryId)
      );
      toast.success("Category removed!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-wrap items-center justify-between p-4 bg-gray-100 shadow-md">
        <Button color="gray" onClick={() => navigate("/notes")}>
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => {
              if (assignedCategories.find((c) => c.id === category.id)) {
                return;
              }
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </Select>
          <Button onClick={assignCategory} disabled={!selectedCategory}>
            Assign
          </Button>
        </div>

        <Button
          color="primary"
          onClick={saveNote}
          disabled={saveStatus === "Saving..."}
        >
          {saveStatus === "Saving..." ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="px-8 py-2 mt-6">
        <div className="flex flex-wrap gap-2">
          {assignedCategories.length > 0 ? (
            assignedCategories.map((category) => (
              <Badge key={category.id} className="py-1 pw-0" color="green">
                {category.name}{" "}
                <button
                  onClick={() => deassignCategory(category.id)}
                  className="px-1 text-red-600 rounded-md hover:bg-red-200"
                >
                  ✖
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">No categories assigned.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <input
          type="text"
          className="w-full mb-4 text-4xl font-semibold bg-transparent rounded-lg focus:ring-0 border-slate-200"
          placeholder={loading ? "Loading..." : "Enter a title..."}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="flex-grow p-4 overflow-auto bg-white border rounded-lg shadow-sm">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
