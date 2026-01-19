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
import logo from "../assets/logo.png";

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
    <div className="min-h-screen text-gray-100 bg-[#070B14]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#070B14]/75 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Trackly Logo"
              className="w-10 h-10 opacity-90"
            />
            <span className="text-xl md:text-2xl font-semibold tracking-tight">
              Trackly
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition shadow-lg shadow-teal-600/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO (full screen) */}
      <section className="relative min-h-screen px-6 pt-24 md:pt-28 pb-24 sm:pb-28 flex items-center">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-100 animate-fade-up">
            <span className="text-gray-100">STAY</span>
            <br />
            <span className="text-teal-500">ORGANISED</span>
          </h1>

          {/* Minimal divider */}
          <div className="mt-6 flex items-center justify-center gap-4 animate-fade-up-delay-1">
            <div className="h-px w-20 bg-white/30" />
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/25 shadow-lg shadow-black/30 flex items-center justify-center">
              <span className="text-sm font-bold text-white">&</span>
            </div>
            <div className="h-px w-20 bg-white/30" />
          </div>

          {/* Secondary Heading Card */}
          <div className="mt-8 inline-block rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-10 py-7 shadow-xl shadow-black/20 animate-fade-up-delay-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-gray-200">SECURE</span>
              <br />
              <span className="inline-flex items-center justify-center gap-3 text-teal-400">
                <Lock className="w-7 h-7 md:w-9 md:h-9 text-teal-400" />
                INTERNSHIPS
              </span>
            </h2>

            {/* tiny accent line for warmth (no gradients) */}
            <div className="mt-4 mx-auto h-0.5 w-16 rounded-full bg-white" />
          </div>

          {/* Subtitle (MATCH your InternTable statusStyles) */}
          <p className="mt-10 text-base md:text-lg text-gray-400 max-w-5xl mx-auto leading-relaxed animate-fade-up-delay-2">
            Stop juggling spreadsheets. One place to track every application
            from{" "}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-600 text-white font-medium">
              Applied
            </span>{" "}
            to{" "}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white font-medium">
              Offer
            </span>
          </p>

          <div className="mt-10 flex justify-center animate-fade-up-delay-3">
            <button
              onClick={() => navigate("/register")}
              className="
                    group inline-flex items-center gap-3
                    px-7 py-3.5 rounded-xl font-semibold
                    bg-teal-600 hover:bg-teal-500
                    text-white
                    shadow-lg shadow-black/30
                    ring-1 ring-teal-400/25 hover:ring-teal-300/35
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
                text-gray-300/80 hover:text-gray-100
                transition
                animate-fade-up-delay-3
                hidden sm:flex
                max-[420px]:hidden
            "
          aria-label="Scroll to How it works"
        >
          <span className="text-sm tracking-wide">Scroll</span>
          <ChevronDown className="w-6 h-6 text-teal-300 animate-float-down" />
        </button>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howItWorksRef} className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              How to use{" "}
              <span className="text-teal-500 font-extrabold">Trackly</span>
            </h2>
            <p className="mt-3 text-gray-400 text-lg">
              Get started in minutes with a simple workflow.
            </p>
          </div>

          <Timeline steps={steps} />
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-300">
            <span>Best experienced on</span>
            <span className="px-3 py-1 rounded-md border border-white/10 bg-white/5 text-gray-200 font-medium">
              Desktop
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>
            Made by{" "}
            <span className="text-gray-200 font-medium">Samuel Tan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function Timeline({ steps }) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden md:block">
        <HorizontalStepper steps={steps} />
      </div>

      {/* Mobile: vertical timeline (compact, no overflow) */}
      <div className="md:hidden">
        <VerticalTimeline steps={steps} />
      </div>
    </div>
  );
}

const stepTheme = {
  1: {
    accent: "text-teal-300",
    chipBg: "bg-teal-600/12",
    chipBorder: "border-teal-400/25",
    nodeBg: "bg-teal-500/12",
    nodeBorder: "border-teal-400/30",
  },
  2: {
    accent: "text-purple-300",
    chipBg: "bg-purple-600/12",
    chipBorder: "border-purple-400/25",
    nodeBg: "bg-purple-500/12",
    nodeBorder: "border-purple-400/30",
  },
  3: {
    accent: "text-amber-300",
    chipBg: "bg-amber-500/12",
    chipBorder: "border-amber-400/25",
    nodeBg: "bg-amber-400/10",
    nodeBorder: "border-amber-400/25",
  },
  4: {
    accent: "text-emerald-300",
    chipBg: "bg-emerald-600/12",
    chipBorder: "border-emerald-400/25",
    nodeBg: "bg-emerald-500/10",
    nodeBorder: "border-emerald-400/25",
  },
};

function HorizontalStepper({ steps }) {
  return (
    <div className="relative mx-auto max-w-6xl">
      {/* track line (neutral, not teal-only) */}
      <div className="absolute left-0 right-0 top-8.5 h-0.5 bg-white/10" />

      <div className="grid grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, idx) => (
          <HorizontalStepCard key={step.number} step={step} index={idx} />
        ))}
      </div>
    </div>
  );
}

function HorizontalStepCard({ step, index }) {
  const Icon = step.icon;

  return (
    <div className="relative">
      {/* Step node */}
      <div className="flex flex-col items-center">
        <div
          className="
            relative z-10
            h-16 w-16 rounded-full
            bg-[#0B1224] border border-white/10
            shadow-xl shadow-black/35
            flex items-center justify-center
          "
        >
          <div
            className="
              h-12 w-12 rounded-full
              bg-teal-600/15 border border-teal-400/30
              flex items-center justify-center
            "
          >
            <span className="text-base font-extrabold text-teal-200">
              {step.number}
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className="
            mt-6 w-full
            rounded-2xl border border-white/10
            bg-white/5 backdrop-blur-md
            p-6
            shadow-xl shadow-black/25
            hover:bg-white/7 transition
            animate-fade-up
          "
          style={{ animationDelay: `${index * 110}ms` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="
                h-11 w-11 rounded-xl
                bg-teal-600/10 border border-teal-400/20
                flex items-center justify-center
              "
            >
              <Icon className="w-5 h-5 text-teal-300" />
            </span>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-100 leading-snug">
                {step.title}
              </h3>
              <p className="mt-0.5 text-xs text-teal-200/80 tracking-wide">
                Step {step.number}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MOBILE: VERTICAL TIMELINE
   ========================= */
function VerticalTimeline({ steps }) {
  return (
    <div className="relative">
      {/* Line */}
      <div className="absolute left-6 top-2 bottom-2 w-px bg-white/10" />
      <div className="absolute left-6 top-2 bottom-2 w-px bg-teal-500/25" />

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <VerticalTimelineItem key={step.number} step={step} index={idx} />
        ))}
      </div>
    </div>
  );
}

function VerticalTimelineItem({ step, index }) {
  const Icon = step.icon;

  return (
    <div className="relative pl-16">
      {/* Node */}
      <div className="absolute left-6 top-2 -translate-x-1/2 z-10">
        <div
          className="
            h-12 w-12 rounded-full
            bg-[#0B1224] border border-white/10
            shadow-lg shadow-black/35
            flex items-center justify-center
          "
        >
          <div className="h-9 w-9 rounded-full bg-teal-600/15 border border-teal-400/30 flex items-center justify-center">
            <span className="text-sm font-extrabold text-teal-200">
              {step.number}
            </span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="
          rounded-2xl border border-white/10
          bg-white/5 backdrop-blur-md
          p-6
          shadow-xl shadow-black/20
          animate-fade-up
        "
        style={{ animationDelay: `${index * 90}ms` }}
      >
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-teal-600/10 border border-teal-400/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-teal-300" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-100">
              {step.title}
            </h3>
            <p className="mt-0.5 text-xs text-teal-200/80 tracking-wide">
              Step {step.number}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}
