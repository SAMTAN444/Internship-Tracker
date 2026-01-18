import { useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, FileText, Archive } from "lucide-react";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Trackly Logo" className="w-10 h-10 opacity-90" />
            <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Trackly
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-8">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="text-yellow-300 font-medium">Trusted by 800+ users</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              STAY
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ORGANISED
            </span>
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-0.5 w-20 bg-linear-to-r from-transparent to-purple-500"></div>
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              &
            </div>
            <div className="h-0.5 w-20 bg-linear-to-l from-transparent to-purple-500"></div>
          </div>

          {/* Secondary Heading */}
          <div className="inline-block px-8 py-6 bg-linear-to-r from-green-400/20 to-teal-400/20 border border-green-400/30 rounded-2xl mb-8 backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-gray-300">SECURE</span>
              <br />
              <span className="text-green-400">INTERNSHIPS</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Stop juggling spreadsheets. One place to track every application from{" "}
            <span className="px-3 py-1 bg-gray-700/50 rounded-md text-gray-300 font-medium">
              applied
            </span>{" "}
            to{" "}
            <span className="px-3 py-1 bg-blue-700/30 rounded-md text-blue-300 font-medium">
              accepted
            </span>
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/register")}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40 flex items-center gap-3 mx-auto"
          >
            Get Started
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 px-6 bg-linear-to-b from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How to use <span className="text-blue-400">Trackly</span>?
            </h2>
            <p className="text-gray-400 text-lg">
              Get started in minutes with our simple workflow
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-500 via-blue-500 to-green-500"></div>

            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <TimelineStep
                number={1}
                icon={<CheckCircle className="w-6 h-6" />}
                title="Add your internship application"
                description="Fill up a quick & simple card about the internship you are applying for and submit it."
                color="purple"
                align="right"
              />

              {/* Step 2 */}
              <TimelineStep
                number={2}
                icon={<Calendar className="w-6 h-6" />}
                title="Update Status"
                description="Update the status of your application as you progress through the application process."
                color="blue"
                align="left"
              />

              {/* Step 3 */}
              <TimelineStep
                number={3}
                icon={<FileText className="w-6 h-6" />}
                title="Add Notes"
                description="Document your journey with rich markdown notes. Track interview feedback, key learnings, and important details for each application."
                color="yellow"
                align="right"
              />

              {/* Step 4 */}
              <TimelineStep
                number={4}
                icon={<Archive className="w-6 h-6" />}
                title="Archive"
                description="At the end of application season, select all applications to archive to prepare for next season."
                color="green"
                align="left"
              />
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-full">
              <span className="text-gray-400">💻 Best experienced on</span>
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-md text-blue-300 font-medium">
                Desktop
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>
            Made by <span className="text-gray-200 font-medium">Samuel Tan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function TimelineStep({ number, icon, title, description, color, align }) {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600 shadow-purple-500/50",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/50",
    yellow: "from-yellow-500 to-yellow-600 shadow-yellow-500/50",
    green: "from-green-500 to-green-600 shadow-green-500/50",
  };

  const iconColors = {
    purple: "text-purple-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  return (
    <div className={`relative flex items-center ${align === "left" ? "md:flex-row-reverse" : ""}`}>
      {/* Number Badge */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-16 h-16 rounded-full bg-linear-to-br ${colorClasses[color]} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
        >
          {number}
        </div>
      </div>

      {/* Content Card */}
      <div
        className={`ml-24 md:ml-0 md:w-5/12 ${
          align === "left" ? "md:mr-auto md:pr-16" : "md:ml-auto md:pl-16"
        }`}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:scale-105 hover:shadow-xl">
          <div className={`flex items-center gap-3 mb-3 ${iconColors[color]}`}>
            {icon}
            <h3 className="text-xl font-bold text-gray-100">{title}</h3>
          </div>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}