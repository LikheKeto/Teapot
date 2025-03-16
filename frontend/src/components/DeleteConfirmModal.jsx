import { useState } from "react";
import { Button, Modal } from "flowbite-react";

export default function DeleteConfirmModal({
  id,
  onDelete,
  openModal,
  setOpenModal,
  entity = "note",
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Confirm Deletion</Modal.Header>
      <Modal.Body>
        <p className="text-gray-600">
          Are you sure you want to delete this {entity}? This action cannot be
          undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="red"
          onClick={async () => {
            await onDelete(id, setDeleting);
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
  );
}
