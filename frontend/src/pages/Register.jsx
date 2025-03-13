import { useState } from "react";
import { TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
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
      navigate("/login");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-green-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        {serverError && (
          <Alert color="failure" className="my-3">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <TextInput
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
            <TextInput
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
            <TextInput
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

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
