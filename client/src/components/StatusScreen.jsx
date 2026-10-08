import Logo from "./Logo";

// Full-page placeholder for boot/loading and "can't reach the server" states.
export function LoadingScreen({ label = "Loading…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center bg-surface"
    >
      <div className="w-10 h-10 border-4 border-line-strong border-t-fg rounded-full animate-spin" />
      <p className="mt-4 text-sm text-fg-muted">{label}</p>
    </div>
  );
}

export function ErrorScreen({ message, onRetry, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 text-center">
      <Logo size="lg" className="mb-6" />
      <p role="alert" className="max-w-sm text-sm text-fg-muted">
        {message}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onRetry}
          className="min-h-11 px-5 py-2 text-sm font-semibold text-on-brand bg-brand rounded-lg hover:bg-brand-hover"
        >
          Try again
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="min-h-11 px-5 py-2 text-sm font-semibold text-fg bg-surface border border-line-strong rounded-lg hover:bg-surface-2"
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
