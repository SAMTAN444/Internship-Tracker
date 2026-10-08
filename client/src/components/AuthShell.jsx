import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import Logo from "./Logo";

// Shared frame for login, register and password reset.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="px-4 py-4 md:px-6">
        <Link to="/" aria-label="Trackly home" className="inline-flex min-h-11 items-center">
          <Logo size="sm" />
        </Link>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 pb-16 pt-6 sm:pt-0">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-fg text-balance">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8 text-sm text-fg-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

// 16px text so iOS doesn't zoom into the field
const inputClass = "field";

export function TextField({ label, hint, id, ...props }) {
  const fallbackId = useId();
  const inputId = id || fallbackId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div>
      <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-fg">
        {label}
      </label>
      <input id={inputId} aria-describedby={hintId} className={inputClass} {...props} />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ label = "Password", hint, id, ...props }) {
  const fallbackId = useId();
  const inputId = id || fallbackId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-describedby={hintId}
          className={`${inputClass} pr-16`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-controls={inputId}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-1 top-1/2 -translate-y-1/2 min-h-10 px-3 text-sm font-medium text-fg-muted rounded-md hover:text-fg hover:bg-surface-2"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start gap-2 p-3 text-sm text-danger bg-danger-soft border border-danger-line rounded-lg">
      <HiExclamationCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ loading, loadingLabel, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="w-full min-h-11 px-4 text-sm font-medium text-on-brand bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2"
    >
      {loading && (
        <span aria-hidden="true" className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
      )}
      {loading ? loadingLabel : children}
    </button>
  );
}
