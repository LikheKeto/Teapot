import { Button, MegaMenu, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <MegaMenu>
      <div className="mx-auto flex w-full flex-wrap items-center justify-between md:space-x-8">
        <Navbar.Brand href="/">
          <img alt="" src="/logo.png" className="h-6 sm:h-9" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Teapot
          </span>
        </Navbar.Brand>
        <div className="order-2 hidden items-center md:flex">
          <Link
            to={"/login"}
            className="mr-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:mr-2 md:px-5 md:py-2.5"
          >
            Login
          </Link>
          <Link to={"/register"}>
            <Button color="primary">Sign up</Button>
          </Link>
        </div>
        <Navbar.Toggle />
        <Navbar.Collapse className="md:hidden">
          <Navbar.Link href="/login">Login</Navbar.Link>
          <Navbar.Link href="/register">Register</Navbar.Link>
        </Navbar.Collapse>
      </div>
    </MegaMenu>
  );
};

export default NavigationBar;
