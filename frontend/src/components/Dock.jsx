import { useAuth } from "../context/AuthContext";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function Dock() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between items-center min-h-screen border-r-2 py-4 w-24">
      <div className="flex flex-col items-center gap-2">
        <img className="w-16" src="/logo.png" alt="logo" />
        <hr className="w-full" />
        <svg
          className="cursor-pointer"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              className="fill-green-500 hover:fill-green-600"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
              fill="#1C274C"
            ></path>
          </g>
        </svg>
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
