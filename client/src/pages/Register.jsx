import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import API from "../services/api";
import { auth, authErrorMessage, emailActionSettings } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import AuthShell, { TextField, PasswordField, FormError, SubmitButton } from "../components/AuthShell";

// Mirrors the server's rule in authController.js
const USERNAME_RULE = /^[A-Za-z0-9_.-]{3,30}$/;
// Mirrors the Firebase password policy set in the console
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const USERNAME_HINT = "3–30 characters: letters, numbers, dots, dashes or underscores. Shown on your dashboard.";
const PASSWORD_HINT = "At least 8 characters with upper and lower case letters, a number and a symbol.";

export default function Register() {
  const { user, profileStatus, refreshProfile, signOut } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // True from creating the Firebase account until the profile exists. During
  // that gap the user briefly has no profile, which mustn't switch the form.
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Signed in but no profile yet: an earlier sign-up was interrupted after the
  // Firebase account was created. Only the username is left to pick.
  const finishingSignup = user && profileStatus === "missing" && !creatingAccount;

  const createProfile = async (name) => {
    await API.post("/api/auth/profile", { username: name });
    // Loads the profile; RegisterRoute then redirects to the dashboard.
    await refreshProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = username.trim();
    if (!USERNAME_RULE.test(name)) return setError(USERNAME_HINT);

    setSubmitting(true);

    if (finishingSignup) {
      try {
        await createProfile(name);
      } catch (err) {
        setError(authErrorMessage(err, "Couldn't save your username. Please try again."));
        setSubmitting(false);
      }
      return;
    }

    if (!PASSWORD_RULE.test(password)) {
      setSubmitting(false);
      return setError(PASSWORD_HINT);
    }
    if (password !== confirmPassword) {
      setSubmitting(false);
      return setError("Passwords don't match.");
    }

    try {
      // Check first so a taken name doesn't leave a half-created account
      const { data } = await API.get("/api/auth/username-available", { params: { username: name } });
      if (!data.available) {
        setSubmitting(false);
        return setError("That username is taken. Try another.");
      }

      setCreatingAccount(true);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Not fatal: the dashboard banner can resend it.
      sendEmailVerification(newUser, emailActionSettings()).catch(() => {});

      try {
        await createProfile(name);
      } catch (err) {
        // Someone took the name in the last few seconds. Roll back the Firebase
        // account so the email can be used again.
        if (err.response?.data?.code === "USERNAME_TAKEN") {
          await newUser.delete().catch(() => {});
          setError("That username was just taken. Try another.");
          setSubmitting(false);
          setCreatingAccount(false);
          return;
        }
        throw err;
      }
    } catch (err) {
      setError(authErrorMessage(err, "Registration failed. Please try again."));
      setSubmitting(false);
      setCreatingAccount(false);
    }
  };

  if (finishingSignup) {
    return (
      <AuthShell
        title="Choose a username"
        subtitle={`Your account for ${user.email} is ready. Pick a username to finish setting it up.`}
        footer={
          <button
            type="button"
            onClick={signOut}
            className="font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-700"
          >
            Use a different account
          </button>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Username"
            hint={USERNAME_HINT}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FormError>{error}</FormError>
          <SubmitButton loading={submitting} loadingLabel="Saving…">
            Continue to dashboard
          </SubmitButton>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track every application in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Username"
          hint={USERNAME_HINT}
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Email"
          hint="We'll send a link to verify it."
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordField
          hint={PASSWORD_HINT}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <FormError>{error}</FormError>

        <SubmitButton loading={submitting} loadingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
