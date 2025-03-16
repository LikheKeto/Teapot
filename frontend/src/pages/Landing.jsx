import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const Landing = () => {
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-16 p-4 lg:gap-0 lg:flex-row md:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-extrabold">
          Write notes with <span className="text-green-500">Teapot</span>,
          <br /> forever <span className="text-green-500">sip</span> on them.
        </h1>
        <div className="flex gap-4">
          <Link to={"/register"}>
            <Button size="lg" color="primary">
              Get Started
            </Button>
          </Link>
          <Link to={"/login"}>
            <Button size="lg" color="light">
              Login
            </Button>
          </Link>
        </div>
      </div>
      <img
        className="w-full max-w-7xl md:w-9/12 lg:w-3/5"
        src="/demo.png"
        alt="demo"
      />
    </div>
  );
};

export default Landing;
