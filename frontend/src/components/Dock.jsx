import { useAuth } from "../context/AuthContext";
import { Button, Tooltip } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CirclePlus, Library, LibraryBig, Notebook } from "lucide-react";

export default function Dock() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-between w-24 min-h-screen py-4 border-r-2 bg-green-50">
      <div className="flex flex-col items-center gap-2">
        <img className="w-16" src="/logo.png" alt="logo" />
        <p className="text-lg font-bold text-green-500">Teapot</p>
        <hr className="w-full" />
        <Link
          className="flex items-center justify-center w-full h-16 text-green-100 bg-green-400 rounded-full shadow-md hover:bg-green-500"
          to={"/notes/new"}
        >
          <Tooltip content="New Note" placement="right">
            <CirclePlus className="transition-all size-12 hover:size-16" />
          </Tooltip>
        </Link>
        <Link
          className="flex items-center justify-center w-full h-16 text-green-100 bg-green-400 rounded-full shadow-md hover:bg-green-500"
          to={"/notes"}
        >
          <Tooltip content="View Notes" placement="right">
            <Notebook className="transition-all size-10 hover:size-12" />
          </Tooltip>
        </Link>
        <Link
          className="flex items-center justify-center w-full h-16 text-green-100 bg-green-400 rounded-full shadow-md hover:bg-green-500"
          to={"/categories"}
        >
          <Tooltip content="View Categories" placement="right">
            <LibraryBig className="transition-all size-10 hover:size-12" />
          </Tooltip>
        </Link>
      </div>
      <Button
        color="red"
        size="xs"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
