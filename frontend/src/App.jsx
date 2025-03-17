import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import NoteEditor from "./pages/NoteEditor";
import CategoriesPage from "./pages/Categories";
import Verification from "./pages/Verification";

function App() {
  const { token } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {!token && <NavigationBar />}
      <div className="flex flex-col flex-grow">
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
            path="/verification"
            element={token ? <Navigate to="/notes" /> : <Verification />}
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
