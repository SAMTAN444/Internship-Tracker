import { Link } from "react-router-dom";
import { CheckCircle, Calendar, FileText, Archive, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import LandingPreview from "../components/LandingPreview";
import { btnGhost, btnPrimary, btnSecondary, card } from "../components/ui";

const STEPS = [
  {
    icon: CheckCircle,
    title: "Add an application",
    description: "Company, role, cycle and the date you applied. Takes about ten seconds.",
  },
  {
    icon: Calendar,
    title: "Move it along",
    description: "Update the status as you hear back: OA, interview, offer or rejection.",
  },
  {
    icon: FileText,
    title: "Keep notes",
    description: "Write interview questions, contacts and prep notes in Markdown, per application.",
  },
  {
    icon: Archive,
    title: "Archive the season",
    description: "When recruiting wraps up, archive everything in one go and start fresh.",
  },
];

const WIDTH = "max-w-6xl";

export default function LandingPage() {
  return (
    // Fills exactly one screen on laptops: the hero absorbs any spare height, so
    // "How it works" always sits directly above the footer.
    <div className="min-h-svh bg-canvas text-fg flex flex-col">
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur border-b border-line">
        <div className={`${WIDTH} mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3`}>
          <Logo />
          <nav className="flex items-center gap-1 md:gap-2">
            <Link to="/login" className={btnGhost}>
              Log in
            </Link>
            <Link to="/register" className={btnPrimary}>
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero: copy on the left, the real dashboard (in miniature) on the right */}
        <section className="flex-1 flex items-center">
          <div className={`w-full ${WIDTH} mx-auto px-4 md:px-6 py-8 short:py-5 grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}>
            <div>
              <h1 className="font-display text-4xl md:text-[3.25rem] short:md:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.05] text-balance animate-fade-up">
                Every internship application, in one calm place.
              </h1>
              <p className="mt-5 short:mt-3 max-w-lg text-base md:text-lg short:md:text-base text-fg-muted leading-relaxed text-pretty animate-fade-up-delay-1">
                Trackly replaces the spreadsheet: see where every application stands, what&apos;s coming up next, and
                what you wrote after each interview.
              </p>
              <div className="mt-7 short:mt-5 flex flex-wrap items-center gap-3 animate-fade-up-delay-2">
                <Link to="/register" className={`${btnPrimary} min-h-11 px-5`}>
                  Start tracking
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>
                <Link to="/login" className={`${btnSecondary} min-h-11 px-5`}>
                  I already have an account
                </Link>
              </div>
            </div>

            <LandingPreview className="w-full max-w-xl justify-self-center lg:justify-self-end lg:rotate-[1.5deg] animate-fade-up-delay-1" />
          </div>
        </section>

        {/* How it works: one bordered box on the page background */}
        <section aria-labelledby="how-heading" className={`w-full ${WIDTH} mx-auto px-4 md:px-6 pb-8 short:pb-5`}>
          <div className={`${card} p-6 md:p-8 short:md:p-6`}>
            <h2 id="how-heading" className="font-display text-2xl font-bold tracking-[-0.01em]">
              How it works
            </h2>
            <ol className="mt-6 short:mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <li key={step.title}>
                    <div className="flex items-center gap-2 text-sm text-fg-muted">
                      <span className="tabular-nums">{idx + 1}</span>
                      <Icon aria-hidden="true" className="w-4 h-4" />
                    </div>
                    <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted leading-relaxed">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>

      <Footer width={WIDTH} withLogo />
    </div>
  );
}
