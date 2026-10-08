import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, authErrorMessage } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import AuthShell, { TextField, PasswordField, FormError, SubmitButton } from "../components/AuthShell";

export default function Login() {
  const { user, profileStatus, profileError, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // On success AuthContext loads the profile and PublicRoute redirects.
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(authErrorMessage(err, "Login failed. Please try again."));
      setSubmitting(false);
    }
  };

  // Signed in, but the API couldn't load the profile (e.g. Render waking up).
  const serverDown = user && profileStatus === "error";
  const busy = submitting && !serverDown && !error;

  return (
    <AuthShell
      title="Log in"
      subtitle="Pick up where you left off."
      footer={
        <>
          New to Trackly?{" "}
          <Link to="/register" className="font-semibold text-fg underline underline-offset-2 hover:text-fg-muted">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <PasswordField
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-fg underline underline-offset-2 hover:text-fg-muted"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <FormError>{error}</FormError>

        {serverDown && (
          <div role="alert" className="space-y-3 p-3 text-sm text-fg bg-surface-2 border border-line rounded-lg">
            <p>{profileError}</p>
            <button
              type="button"
              onClick={refreshProfile}
              className="min-h-10 px-4 text-sm font-semibold text-fg bg-surface border border-line-strong rounded-lg hover:bg-surface-2"
            >
              Try again
            </button>
          </div>
        )}

        <SubmitButton loading={busy} loadingLabel="Logging in…">
          Log in
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
