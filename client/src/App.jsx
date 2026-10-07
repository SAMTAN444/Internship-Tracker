import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import NotesPage from "./pages/NotesPage";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreen";

// Signed in with a Trackly profile. Anything less is sent where it can be fixed.
function ProtectedRoute({ children }) {
  const { initializing, user, profileStatus, profileError, refreshProfile, signOut } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (profileStatus === "missing") return <Navigate to="/register" replace />;
  if (profileStatus === "error") {
    return <ErrorScreen message={profileError} onRetry={refreshProfile} onLogout={signOut} />;
  }
  if (profileStatus !== "ready") return <LoadingScreen label="Loading your account…" />;
  return children;
}

// Login, landing and password reset: bounce signed-in users to where they belong.
// While a fresh sign-in is still loading its profile, keep showing the page.
function PublicRoute({ children }) {
  const { initializing, user, profileStatus } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (user && profileStatus === "ready") return <Navigate to="/dashboard" replace />;
  if (user && profileStatus === "missing") return <Navigate to="/register" replace />;
  return children;
}

// Register also serves signed-in users who still need to pick a username.
function RegisterRoute() {
  const { initializing, user, profileStatus } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (user && profileStatus === "ready") return <Navigate to="/dashboard" replace />;
  return <Register />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<RegisterRoute />} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
