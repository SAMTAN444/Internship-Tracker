# Product

## Register

product

## Users

Students and early-career candidates — primarily CS/tech undergraduates — running an active internship search. Their context is high-volume and high-stakes: dozens of applications across different companies and recruiting cycles, each at a different stage, with deadlines and follow-ups easy to lose. They arrive at Trackly to *do work*, not to browse: log a new application, advance a status, jot notes after an interview, or clear out last season's entries. They're often time-pressed and stressed, frequently checking on mobile between classes or commutes.

The job to be done: **be the single source of truth for my internship search** — replace the scattered spreadsheets, email threads, and reminders with one trustworthy dashboard that shows, at a glance, where every application stands and what needs attention next.

## Product Purpose

Trackly tracks internship applications end-to-end through an explicit status pipeline (`Applied → OA → Interview → Offer → Rejected → Archived`). It supports per-application markdown notes for capturing details, a reminder system to prevent missed deadlines and follow-ups, batch status updates and end-of-season archiving, and filtering/pagination for handling many entries. Data is strictly scoped per authenticated user.

Success looks like a candidate trusting Trackly enough to *stop* keeping a backup spreadsheet — opening it daily, confident nothing is slipping through, and reaching the end of a recruiting season organized rather than overwhelmed.

## Brand Personality

Calm, reliable, professional, understated. Three words: **trustworthy, clear, composed.**

The voice is clear and supportive — direct without being loud, encouraging without cheerleading. Trackly should feel like a quiet, dependable tool that reduces the anxiety of recruiting season, not one that adds noise to it. Copy is plain and human; it states what's happening and what to do next. The emotional goal is **relief and control**: the user should feel organized and in command of their search.

(Note: the David Goggins image on the dashboard is a personal easter egg, not a brand signal — the product voice is not "gritty/motivational.")

## Anti-references

- **Trendy AI-startup slop** — no generic purple gradients, glow-on-everything, emoji-laden copy, or over-animated marketing clichés. Restraint over spectacle.
- **Over-gamified** — no childish badges, confetti showers, cartoon mascots, or Duolingo-style streak pressure. Progress is shown soberly, not celebrated theatrically.
- **Spreadsheet / enterprise sprawl** — no cluttered gray Excel/Jira/legacy-CRM feel: dense gridlines, flat hierarchy, joyless density. Trackly handles many rows but stays legible and calm.

## Design Principles

1. **Calm under volume** — the interface stays composed even with dozens of applications. Clear hierarchy and generous breathing room beat raw density; the user should never feel the clutter they came here to escape.
2. **The pipeline is the product** — status is the spine of every screen. Make where-things-stand and what-needs-attention instantly legible; design serves the task of moving applications forward.
3. **Reduce anxiety, don't add to it** — every interaction should lower the user's stress. No surprise destructive actions, no nagging, no noise. Confidence comes from predictability.
4. **Trust through consistency** — same button, same status colors, same form vocabulary on every screen. Familiarity is a feature; this is a tool that should disappear into the task.
5. **Mobile is a first-class context** — users check between classes. Touch targets, legibility, and core flows must hold up on a phone, not just degrade gracefully.

## Accessibility & Inclusion

Target **WCAG AAA / strict.** Concretely: AAA contrast ratios (7:1 for normal text, 4.5:1 for large) — demanding given the dark theme, so text and accent colors must be verified, not assumed. Full keyboard navigability with visible focus states on every interactive element. Comprehensive screen-reader support (semantic markup, labeled controls, status announcements). Honor `prefers-reduced-motion` for the fade/float animations. Ensure status is never communicated by color alone (the Applied/OA/Interview/Offer/Rejected/Archived states need text or iconography alongside color) to support color-blind users.
