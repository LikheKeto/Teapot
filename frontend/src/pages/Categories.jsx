import { useEffect, useState } from "react";
import { Button, Table, TextInput, Modal, Spinner } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Dock from "../components/Dock";
import { PlusCircle } from "lucide-react";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentCategory.name.trim()) return;
    const method = currentCategory.id ? "PUT" : "POST";
    const endpoint = currentCategory.id
      ? `${import.meta.env.VITE_API_ENDPOINT}/api/categories/${
          currentCategory.id
        }`
      : `${import.meta.env.VITE_API_ENDPOINT}/api/categories`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: currentCategory.name }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error.name || "Failed to save category"
        );
      toast.success("Category saved!");
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, setDeleting) => {
    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex">
      <Dock />
      <div className="w-full p-4">
        <div className="flex items-center gap-2">
          <h2 className="my-4 text-4xl font-semibold">Categories</h2>
          <Button
            color="primary"
            onClick={() => {
              setCurrentCategory({ id: null, name: "" });
              setModalOpen(true);
            }}
          >
            <PlusCircle />
          </Button>
        </div>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Category Name</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {categories.map((category) => (
                <Table.Row key={category.id}>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell className="flex">
                    <Button
                      size="xs"
                      color="primary"
                      onClick={() => {
                        setCurrentCategory(category);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="failure"
                      size="xs"
                      className="ml-2"
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setCurrentCategory(category);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <DeleteConfirmModal
          onDelete={handleDelete}
          openModal={deleteModalOpen}
          setOpenModal={setDeleteModalOpen}
          id={currentCategory.id}
          entity="category"
        />

        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>
            {currentCategory.id ? "Edit Category" : "Add Category"}
          </Modal.Header>
          <Modal.Body>
            <TextInput
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, name: e.target.value })
              }
              placeholder="Enter category name"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSave}>Save</Button>
            <Button color="gray" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
