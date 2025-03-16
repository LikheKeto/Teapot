import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (token !== undefined) {
      setAuthChecked(true);
    }
  }, [token]);

  if (!authChecked) {
    return null; // Wait until authentication is determined
  }

  return token ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
