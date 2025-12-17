import { Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        {/* Left */}
        <span className="text-xl">
          Made by <span className="text-gray-200 font-medium">Samuel Tan</span>
        </span>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* GitHub */}
          <a
            href="https://github.com/SAMTAN444"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xl hover:text-gray-200 transition group"
          >
            <Github className="w-5 h-5 transition-transform duration-500 group-hover:rotate-360" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Email */}
          <a
            href="mailto:samueltjy13@gmail.com"
            className="flex items-center gap-2 text-xl hover:text-gray-200 transition"
          >
            <Mail className="w-5 h-5" />
            <span className="hidden sm:inline">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
