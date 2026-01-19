import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import NotesPage from "./pages/NotesPage";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Keep App in sync when token changes (logout/login)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));

    // Same-tab changes (we'll call syncToken manually from logout/login too)
    // Cross-tab changes
    window.addEventListener("storage", syncToken);

    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login onAuth={() => setToken(localStorage.getItem("token"))} />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" replace /> : <Register onAuth={() => setToken(localStorage.getItem("token"))} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={() => setToken(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="dark" />
    </BrowserRouter>
  );
}

export default App;
