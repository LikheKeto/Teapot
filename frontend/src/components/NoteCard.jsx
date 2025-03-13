import { useState } from "react";
import { Button, Modal } from "flowbite-react";

export default function NoteCard({ note, onDelete }) {
  const [openModal, setOpenModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold">{note.title}</h3>
      <p className="text-gray-600">{note.content}</p>
      <div className="flex gap-2 mt-2">
        <Button color="indigo" size="xs">
          Edit
        </Button>
        <Button color="red" size="xs" onClick={() => setOpenModal(true)}>
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="red"
            onClick={async () => {
              await onDelete(note.id, setDeleting);
              setOpenModal(false);
            }}
            isProcessing={deleting}
          >
            Yes, Delete
          </Button>
          <Button color="green" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
