import { Github, Mail } from "lucide-react";
import Logo from "./Logo";

const linkClass =
  "inline-flex items-center gap-2 min-h-11 px-2 -mx-2 rounded-md text-sm font-medium text-fg-muted hover:text-fg transition-colors";

// Shared site footer. `width` matches the page's content column; `withLogo`
// adds the wordmark (used on the landing page).
export default function Footer({ width = "max-w-screen-2xl", withLogo = false }) {
  return (
    <footer className="border-t border-line">
      <div className={`${width} mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 text-base text-fg-muted">
          {withLogo && <Logo />}
          <span>
            Made by <span className="text-fg font-medium">Samuel Tan</span>
          </span>
        </div>

        <nav aria-label="Contact" className="flex items-center gap-6">
          <a href="https://github.com/SAMTAN444" target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Github aria-hidden="true" className="w-4 h-4" />
            GitHub
          </a>
          <a href="mailto:samueltjy13@gmail.com" className={linkClass}>
            <Mail aria-hidden="true" className="w-4 h-4" />
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
