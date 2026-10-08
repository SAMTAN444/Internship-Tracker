import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "./pages/LandingPage";

// Everything past the landing page is split into its own chunk, so first-time
// visitors don't download the dashboard, Markdown renderer or date picker.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const Settings = lazy(() => import("./pages/Settings"));
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
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

// Toasts follow the active theme
function Toasts() {
  const { theme } = useTheme();
  return <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme={theme} />;
}

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>

        <Toasts />
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
