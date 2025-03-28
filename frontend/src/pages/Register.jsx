import { useState } from "react";
import { TextInput, Button, Alert, Spinner, Label } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = "Name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await fetch(
        import.meta.env.VITE_API_ENDPOINT + "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (typeof data.error === "object") {
        setErrors(data.error);
        return;
      }

      if (!response.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registration successful");
      navigate("/verification");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow p-2 m-1 bg-green-400 rounded-lg md:m-8">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-green-50">
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        {serverError && (
          <Alert color="failure" className="my-3">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              color={errors.username ? "failure" : "gray"}
              helperText={
                errors.username && (
                  <span className="text-red-500">{errors.username}</span>
                )
              }
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              color={errors.email ? "failure" : "gray"}
              helperText={
                errors.email && (
                  <span className="text-red-500">{errors.email}</span>
                )
              }
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              color={errors.password ? "failure" : "gray"}
              helperText={
                errors.password && (
                  <span className="text-red-500">{errors.password}</span>
                )
              }
            />
          </div>

          <Button type="submit" color="primary" className="w-full">
            {loading ? <Spinner size="sm" className="mr-2" /> : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
