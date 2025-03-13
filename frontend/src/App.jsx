import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import FooterBar from "./components/FooterBar";

function App() {
  const { token } = useAuth();

  return (
    <>
      {!token && <NavigationBar />}
      <div>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/notes" /> : <Landing />}
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/notes" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/notes" /> : <Register />}
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {/* {!token && <FooterBar />} */}
    </>
  );
}

export default App;
