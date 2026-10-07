import logo from "../assets/logo.svg";

// Full-page placeholder for boot/loading and "can't reach the server" states.
export function LoadingScreen({ label = "Loading…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-600">{label}</p>
    </div>
  );
}

export function ErrorScreen({ message, onRetry, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <img src={logo} alt="" className="h-10 w-auto mb-6" />
      <p role="alert" className="max-w-sm text-sm text-gray-700">
        {message}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onRetry}
          className="min-h-11 px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          Try again
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="min-h-11 px-5 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
