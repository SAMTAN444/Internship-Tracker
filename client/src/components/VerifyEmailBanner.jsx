import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { HiOutlineMail } from "react-icons/hi";
import { auth, authErrorMessage, emailActionSettings } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const buttonClass =
  "min-h-10 px-4 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-60 disabled:cursor-wait";

// Nudge (not a blocker) until the user clicks the link in their verification email.
export default function VerifyEmailBanner() {
  const { user, emailVerified, reloadUser } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | checking
  const [message, setMessage] = useState("");

  // People verify in another tab, so re-check whenever they come back to this one.
  useEffect(() => {
    if (emailVerified) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") reloadUser().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [emailVerified, reloadUser]);

  if (!user || emailVerified) return null;

  const resend = async () => {
    setStatus("sending");
    setMessage("");
    try {
      await sendEmailVerification(auth.currentUser, emailActionSettings());
      setStatus("sent");
      setMessage("Sent. Check your inbox and spam folder.");
    } catch (err) {
      setStatus("idle");
      setMessage(authErrorMessage(err, "Couldn't send the email. Please try again."));
    }
  };

  const check = async () => {
    setStatus("checking");
    setMessage("");
    try {
      const verified = await reloadUser();
      if (!verified) setMessage("Not verified yet. Open the link in the email first.");
    } catch (err) {
      setMessage(authErrorMessage(err));
    } finally {
      setStatus((s) => (s === "checking" ? "idle" : s));
    }
  };

  return (
    <div role="region" aria-label="Email verification" className="border-b border-gray-200 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex items-start gap-3 flex-1 text-sm text-gray-900">
          <HiOutlineMail aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Verify your email: we sent a link to <span className="font-semibold break-all">{user.email}</span>.
            {message && (
              <span role="status" className="block mt-1 text-gray-700">
                {message}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pl-8 md:pl-0">
          <button type="button" onClick={resend} disabled={status === "sending"} className={buttonClass}>
            {status === "sending" ? "Sending…" : "Resend email"}
          </button>
          <button type="button" onClick={check} disabled={status === "checking"} className={buttonClass}>
            {status === "checking" ? "Checking…" : "I've verified"}
          </button>
        </div>
      </div>
    </div>
  );
}
