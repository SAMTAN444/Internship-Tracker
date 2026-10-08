import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, authErrorMessage, emailActionSettings } from "../services/firebase";
import AuthShell, { TextField, FormError, SubmitButton } from "../components/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim(), emailActionSettings());
      setSentTo(email.trim());
    } catch (err) {
      // Same message whether or not the account exists, so this page can't be
      // used to find out who has one. Only input/network problems are shown.
      if (err.code === "auth/user-not-found") setSentTo(email.trim());
      else setError(authErrorMessage(err, "Couldn't send the email. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const backToLogin = (
    <Link to="/login" className="font-semibold text-fg underline underline-offset-2 hover:text-fg-muted">
      Back to log in
    </Link>
  );

  if (sentTo) {
    return (
      <AuthShell title="Check your email" footer={backToLogin}>
        <div role="status" className="space-y-3 text-sm text-fg-muted">
          <p>
            If an account exists for <span className="font-semibold text-fg">{sentTo}</span>, we&apos;ve sent a
            link to reset the password. It expires in an hour.
          </p>
          <p>Not there? Check your spam folder, or</p>
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="min-h-11 px-5 font-semibold text-fg bg-surface border border-line-strong rounded-lg hover:bg-surface-2"
          >
            Try a different email
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a reset link."
      footer={backToLogin}
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
        <FormError>{error}</FormError>
        <SubmitButton loading={submitting} loadingLabel="Sending…">
          Send reset link
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
