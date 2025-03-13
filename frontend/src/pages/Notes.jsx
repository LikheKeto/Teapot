import { useEffect, useState } from "react";
import { Alert, Spinner, Button } from "flowbite-react";
import Dock from "../components/Dock";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";
import { toast } from "react-toastify";

const Notes = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotes = async (token, currentPage) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notes?page=${currentPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch notes");

      const data = await response.json();
      setNotes(data.notes);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(token, currentPage);
  }, [token, currentPage]);

  const handleDelete = async (id, setDeleting = null) => {
    setDeleting && setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notes/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete note");

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      fetchNotes(token, currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting && setDeleting(false);
    }
  };

  return (
    <div className="flex">
      <Dock />
      <div className="p-4 w-full">
        <SearchBar />
        <h2 className="text-4xl font-semibold my-4">Notes</h2>

        {loading && <Spinner size="lg" className="my-4" />}
        {error && (
          <Alert color="failure" className="my-4">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id}>
                    <NoteCard onDelete={handleDelete} note={note} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  No notes available.
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-4">
              <Button
                color="gray"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-lg font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                color="gray"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
