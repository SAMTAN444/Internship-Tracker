import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  FileText,
  Archive,
  ChevronDown,
  Lock,
} from "lucide-react";
import logo from "../assets/logo.svg";

export default function LandingPage() {
  const navigate = useNavigate();
  const howItWorksRef = useRef(null);

  const steps = useMemo(
    () => [
      {
        number: 1,
        icon: CheckCircle,
        title: "Add application",
        description:
          "Fill up a quick & simple card about the internship you are applying for including date, role, company, and cycle.",
      },
      {
        number: 2,
        icon: Calendar,
        title: "Update Status",
        description:
          "Update the status of your application as you progress through the application process.",
      },
      {
        number: 3,
        icon: FileText,
        title: "Add Notes",
        description:
          "Document your journey with rich markdown notes. Track  important details for each application.",
      },
      {
        number: 4,
        icon: Archive,
        title: "Archive",
        description:
          "At the end of application season, select all applications to archive to prepare for next season.",
      },
    ],
    [],
  );

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-9 md:h-10 w-auto" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Trackly
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 transition shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO (full screen) */}
      <section className="relative min-h-screen px-6 pt-24 md:pt-28 pb-24 sm:pb-28 flex items-center">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.2] animate-fade-up">
            <span className="text-gray-900">STAY</span>
            <br />
            <span className="bg-[#CBFF9E] text-gray-900 px-5 rounded-lg box-decoration-clone">ORGANISED</span>
          </h1>

          {/* Minimal divider */}
          <div className="mt-6 flex items-center justify-center gap-4 animate-fade-up-delay-1">
            <div className="h-px w-20 bg-gray-300" />
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 shadow-lg flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">&</span>
            </div>
            <div className="h-px w-20 bg-gray-300" />
          </div>

          {/* Secondary Heading Card */}
          <div className="mt-8 inline-block rounded-2xl border border-gray-200 bg-white px-10 py-7 shadow-xl animate-fade-up-delay-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-gray-900">SECURE</span>
              <br />
              <span className="inline-flex items-center justify-center gap-3 text-gray-900">
                <Lock className="w-7 h-7 md:w-9 md:h-9 text-gray-900" />
                INTERNSHIPS
              </span>
            </h2>

            {/* tiny accent line for warmth (no gradients) */}
            <div className="mt-4 mx-auto h-0.5 w-16 rounded-full bg-[#CBFF9E]" />
          </div>

          {/* Subtitle (MATCH your InternTable statusStyles) */}
          <p className="mt-10 text-base md:text-lg text-gray-600 max-w-5xl mx-auto leading-relaxed animate-fade-up-delay-2">
            Stop juggling spreadsheets. One place to track every application
            from{" "}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300 font-medium">
              Applied
            </span>{" "}
            to{" "}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#CBFF9E] text-gray-900 border border-green-600 font-medium">
              Offer
            </span>
          </p>

          <div className="mt-10 flex justify-center animate-fade-up-delay-3">
            <button
              onClick={() => navigate("/register")}
              className="
                    group inline-flex items-center gap-3
                    px-7 py-3.5 rounded-xl font-semibold
                    bg-gray-900 hover:bg-gray-800
                    text-white
                    shadow-lg
                    ring-1 ring-gray-300
                    transition
                "
            >
              Get Started
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Scroll prompt */}
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="
                absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2
                text-gray-600 hover:text-gray-900
                transition
                animate-fade-up-delay-3
                hidden sm:flex
                max-[420px]:hidden
            "
          aria-label="Scroll to How it works"
        >
          <span className="text-sm tracking-wide">Scroll</span>
          <ChevronDown className="w-6 h-6 text-gray-700 animate-float-down" />
        </button>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={howItWorksRef} className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              How to use{" "}
              <span className="bg-[#CBFF9E] text-gray-900 font-extrabold px-2 rounded">Trackly</span>
            </h2>
            <p className="mt-3 text-gray-600 text-lg">
              Get started in minutes with a simple workflow.
            </p>
          </div>

          <ol className="grid gap-12 md:gap-10 md:grid-cols-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  <span className="inline-block bg-[#CBFF9E] text-gray-900 text-2xl font-extrabold leading-none px-3 py-2 rounded-lg">
                    0{step.number}
                  </span>

                  <div className="mt-5 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-900" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  </div>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
            <span>Best experienced on</span>
            <span className="px-3 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-900 font-medium">
              Desktop
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>
            Made by{" "}
            <span className="text-gray-900 font-medium">Samuel Tan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
