import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const Landing = () => {
  return (
    <div className="flex items-center justify-between gap-16 lg:gap-0 lg:flex-row flex-col-reverse p-4 md:p-8">
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
      <img className="w-full md:w-9/12 lg:w-1/2" src="/demo.png" alt="demo" />
    </div>
  );
};

export default Landing;
