// The Trackly wordmark: lowercase "trackly" with a lime marker bar under
// "track", in the theme's --mark colour.
const SIZES = {
  sm: "text-xl",
  md: "text-xl",
  lg: "text-2xl",
};

export default function Logo({ size = "md", className = "" }) {
  return (
    <span className={`inline-block font-semibold tracking-tight leading-none text-fg ${SIZES[size]} ${className}`}>
      <span className="bg-[linear-gradient(transparent_55%,var(--mark)_55%,var(--mark)_95%,transparent_95%)]">track</span>ly
    </span>
  );
}
