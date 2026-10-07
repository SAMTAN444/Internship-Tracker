import { useState } from "react";
import { Link } from "react-router-dom";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { HiArrowLeft, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { auth, authErrorMessage, emailActionSettings } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const secondaryButton =
  "min-h-11 px-5 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-60 disabled:cursor-wait";

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
      <p role="status" className="mt-3 flex items-start gap-2 text-sm text-gray-900">
        <HiCheckCircle aria-hidden="true" className="w-5 h-5 shrink-0 text-gray-900" />
        {sentText}
      </p>
    );
  }
  if (state.status === "error") {
    return (
      <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-900">
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

  const checkVerified = async () => {
    setChecking(true);
    try {
      await reloadUser();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-gray-900 hover:text-gray-700"
          >
            <HiArrowLeft aria-hidden="true" className="w-5 h-5" />
            Back to dashboard
          </Link>
          <img src={logo} alt="Trackly" className="h-8 w-auto" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <section aria-labelledby="account-heading" className="mt-8 border border-gray-200 rounded-2xl p-6">
          <h2 id="account-heading" className="text-lg font-semibold">
            Account
          </h2>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-gray-600">Username</dt>
            <dd className="font-medium break-all">{profile?.username}</dd>
            <dt className="text-gray-600">Email</dt>
            <dd className="font-medium break-all">
              {user?.email}
              <span
                className={`ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  emailVerified
                    ? "bg-[#CBFF9E] border-green-600 text-gray-900"
                    : "bg-amber-100 border-amber-300 text-amber-900"
                }`}
              >
                {emailVerified ? "Verified" : "Not verified"}
              </span>
            </dd>
          </dl>

          {!emailVerified && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <p className="text-sm text-gray-700">
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

        <section aria-labelledby="password-heading" className="mt-6 border border-gray-200 rounded-2xl p-6">
          <h2 id="password-heading" className="text-lg font-semibold">
            Password
          </h2>
          <p className="mt-2 text-sm text-gray-700">
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

        <section className="mt-6 flex items-center justify-between border border-gray-200 rounded-2xl p-6">
          <div>
            <h2 className="text-lg font-semibold">Log out</h2>
            <p className="mt-1 text-sm text-gray-700">End your session on this device.</p>
          </div>
          <button type="button" onClick={signOut} className={secondaryButton}>
            Log out
          </button>
        </section>
      </main>
    </div>
  );
}
