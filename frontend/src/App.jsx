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
        </Routes>
      </div>
    </>
  );
}

export default App;
