import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash, Pen } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Badge } from "flowbite-react";

export default function NoteCard({ note, onDelete }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-4 border shadow-md rounded-3xl bg-green-50">
      <Link to={`/notes/${note.id}`}>
        <div className="flex flex-wrap w-full gap-1">
          {note.categories.map((category) => {
            return (
              <Badge key={category.name} color="green">
                {category.name}
              </Badge>
            );
          })}
        </div>
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p
          dangerouslySetInnerHTML={{ __html: note.content }}
          className="h-24 overflow-hidden text-gray-600"
        ></p>
      </Link>

      <div className="flex items-end justify-between mt-2">
        <p className="text-sm text-slate-500">
          Created: {new Date(note.created_at).toDateString()}
          <br />
          Updated: {new Date(note.updated_at).toDateString()}
        </p>
        <div className="flex gap-2">
          <Link
            to={`/notes/${note.id}`}
            className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            <Pen className="size-5" />
          </Link>

          <button
            className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            onClick={() => setOpenModal(true)}
          >
            <Trash className="size-5" />
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        id={note.id}
        onDelete={onDelete}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
}
