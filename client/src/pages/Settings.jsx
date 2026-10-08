import { useState } from "react";
import { Link } from "react-router-dom";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { HiArrowLeft, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { auth, authErrorMessage, emailActionSettings } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { useTheme } from "../context/ThemeContext";
import { btnSecondary, card } from "../components/ui";

const secondaryButton = btnSecondary;

const THEME_OPTIONS = [
  ["system", "System"],
  ["light", "Light"],
  ["dark", "Dark"],
];

// Sends an email via Firebase and reports the outcome inline next to the button.
function useEmailAction(send) {
  const [state, setState] = useState({ status: "idle", message: "" });

  const run = async () => {
    setState({ status: "sending", message: "" });
    try {
      await send();
      setState({ status: "sent", message: "" });
    } catch (err) {
      setState({ status: "error", message: authErrorMessage(err, "Couldn't send the email. Please try again.") });
    }
  };

  return [state, run];
}

function ActionResult({ state, sentText }) {
  if (state.status === "sent") {
    return (
      <p role="status" className="mt-3 flex items-start gap-2 text-sm text-fg">
        <HiCheckCircle aria-hidden="true" className="w-5 h-5 shrink-0 text-fg" />
        {sentText}
      </p>
    );
  }
  if (state.status === "error") {
    return (
      <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-danger">
        <HiExclamationCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
        {state.message}
      </p>
    );
  }
  return null;
}

export default function Settings() {
  const { user, profile, emailVerified, reloadUser, signOut } = useAuth();
  const [checking, setChecking] = useState(false);

  const [verifyState, sendVerification] = useEmailAction(() =>
    sendEmailVerification(auth.currentUser, emailActionSettings())
  );
  const [passwordState, sendPasswordLink] = useEmailAction(() =>
    sendPasswordResetEmail(auth, user.email, emailActionSettings())
  );

  const { preference, setPreference } = useTheme();

  const checkVerified = async () => {
    setChecking(true);
    try {
      await reloadUser();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <header className="border-b border-line bg-surface">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-fg hover:text-fg-muted"
          >
            <HiArrowLeft aria-hidden="true" className="w-5 h-5" />
            Back to dashboard
          </Link>
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

        <section aria-labelledby="account-heading" className={`mt-8 p-5 md:p-6 ${card}`}>
          <h2 id="account-heading" className="text-base font-semibold">
            Account
          </h2>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-fg-muted">Username</dt>
            <dd className="font-medium break-all">{profile?.username}</dd>
            <dt className="text-fg-muted">Email</dt>
            <dd className="font-medium break-all">
              {user?.email}
              <span className={`ml-2 ${emailVerified ? "chip chip-offer" : "chip chip-interview"}`}>
                {emailVerified ? "Verified" : "Not verified"}
              </span>
            </dd>
          </dl>

          {!emailVerified && (
            <div className="mt-5 pt-5 border-t border-line">
              <p className="text-sm text-fg-muted">
                Verify your email so you can always get back into your account.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={sendVerification}
                  disabled={verifyState.status === "sending"}
                  className={secondaryButton}
                >
                  {verifyState.status === "sending" ? "Sending…" : "Resend verification email"}
                </button>
                <button type="button" onClick={checkVerified} disabled={checking} className={secondaryButton}>
                  {checking ? "Checking…" : "I've verified"}
                </button>
              </div>
              <ActionResult state={verifyState} sentText={`Sent to ${user?.email}. Check your spam folder if it's not there.`} />
            </div>
          )}
        </section>

        <section aria-labelledby="appearance-heading" className={`mt-6 p-5 md:p-6 ${card}`}>
          <h2 id="appearance-heading" className="text-base font-semibold">
            Appearance
          </h2>
          <p className="mt-1 text-sm text-fg-muted">System follows your device&apos;s light or dark setting.</p>
          <div role="radiogroup" aria-labelledby="appearance-heading" className="mt-4 inline-flex gap-0.5 p-0.5 border border-line rounded-lg">
            {THEME_OPTIONS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={preference === value}
                onClick={() => setPreference(value)}
                className={`min-h-9 px-4 rounded-md text-sm font-medium transition-colors ${
                  preference === value ? "bg-brand-soft text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="password-heading" className={`mt-6 p-5 md:p-6 ${card}`}>
          <h2 id="password-heading" className="text-base font-semibold">
            Password
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            We&apos;ll email you a link to set a new password. The change only happens from that link, so nobody
            with access to this device alone can change it.
          </p>
          <button
            type="button"
            onClick={sendPasswordLink}
            disabled={passwordState.status === "sending"}
            className={`mt-4 ${secondaryButton}`}
          >
            {passwordState.status === "sending" ? "Sending…" : "Email me a password change link"}
          </button>
          <ActionResult
            state={passwordState}
            sentText={`Sent to ${user?.email}. The link expires in an hour.`}
          />
        </section>

        <section className={`mt-6 p-5 md:p-6 flex items-center justify-between gap-4 ${card}`}>
          <div>
            <h2 className="text-base font-semibold">Log out</h2>
            <p className="mt-1 text-sm text-fg-muted">End your session on this device.</p>
          </div>
          <button type="button" onClick={signOut} className={secondaryButton}>
            Log out
          </button>
        </section>
      </main>
    </div>
  );
}
