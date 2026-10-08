// Shared class strings so every button and card looks the same on every
// screen. Colours come from the theme tokens in index.css.

const base =
  "inline-flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimary = `${base} bg-brand text-on-brand hover:bg-brand-hover`;
export const btnSecondary = `${base} bg-surface text-fg border border-line-strong hover:bg-surface-2`;
export const btnGhost = `${base} text-fg hover:bg-surface-2`;
export const btnDanger = `${base} bg-danger text-on-brand hover:bg-danger-hover dark:text-canvas`;

// Square icon-only button (44px touch target)
export const btnIcon =
  "inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg transition-colors";

export const card = "bg-surface border border-line rounded-xl";
export const cardTitle = "text-xl font-semibold text-fg";
