import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import NotesPage from "./pages/NotesPage";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AUTH_CHANGED, getAccessToken } from "./services/api";

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [token, setToken] = useState(getAccessToken);

  // Keep App in sync when the token changes (login, logout, refresh, or the
  // interceptor clearing a dead session).
  useEffect(() => {
    const syncToken = () => setToken(getAccessToken());

    // AUTH_CHANGED covers this tab; `storage` covers the others.
    window.addEventListener(AUTH_CHANGED, syncToken);
    window.addEventListener("storage", syncToken);

    // Re-check on mount in case the session changed before the listener attached.
    syncToken();

    return () => {
      window.removeEventListener(AUTH_CHANGED, syncToken);
      window.removeEventListener("storage", syncToken);
    };
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
          element={token ? <Navigate to="/dashboard" replace /> : <Login onAuth={() => setToken(getAccessToken())} />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" replace /> : <Register onAuth={() => setToken(getAccessToken())} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard onLogout={() => setToken(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute token={token}>
              <NotesPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />
    </BrowserRouter>
  );
}

export default App;
