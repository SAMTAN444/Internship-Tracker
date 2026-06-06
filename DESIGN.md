---
name: Trackly
description: A bright, white, black-and-green dashboard for tracking internship applications end-to-end.
colors:
  surface-white: "#FFFFFF"
  surface-subtle: "#F9FAFB"
  surface-muted: "#F3F4F6"
  ink: "#111827"
  brand-green: "#CBFF9E"
  brand-green-edge: "#16A34A"
  text-secondary: "#374151"
  text-muted: "#4B5563"
  border-subtle: "#E5E7EB"
  border-input: "#D1D5DB"
  focus-ring: "#111827"
  status-applied: "#F3F4F6"
  status-oa: "#EDE9FE"
  status-interview: "#FEF3C7"
  status-offer: "#CBFF9E"
  status-rejected: "#FEE2E2"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "#1F2937"
    textColor: "{colors.surface-white}"
  button-accent:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 20px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  status-chip:
    backgroundColor: "{colors.status-applied}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: Trackly

## 1. Overview

**Creative North Star: "The Daylight Desk"**

Trackly is a bright, calm workspace for tracking internship applications — a clean white surface where the work is the only thing with color. The palette is drawn straight from the brand illustration: **black** line-art, a single **lime green** (`#CBFF9E`), and **white**. Black does the heavy lifting (text, primary buttons), white is the room everything sits in, and the lime green appears rarely and deliberately as a fill — a selected tab, the "Offer" win-state, the add-application tile. Nothing glows, nothing is dark, nothing competes for attention with the data.

Density is handled by composure, not compression. Cards are white with a hairline border and a soft shadow, separated by generous padding rather than heavy chrome. Type is Space Grotesk throughout, leaning on weight (bold near-black headings) rather than a second family. The feeling is friendly and confident — closer to a well-made study tool than an enterprise console.

This system explicitly rejects three things. It is **not trendy AI-startup slop**: no purple-gradient heroes, no glow-on-everything, no emoji-laden copy. It is **not over-gamified**: no badges, no confetti, no streaks — progress is shown soberly. And it is **not spreadsheet/enterprise sprawl**: no gridline density, no joyless flat hierarchy. Bright and clean beats both spectacle and clutter.

**Key Characteristics:**
- Light-first: a white (`#FFFFFF`) page with white cards separated by hairline borders and soft shadow.
- Black is the workhorse: near-black ink (`#111827`) for text and primary buttons.
- One accent: lime green (`#CBFF9E`) as a rare fill, always with black text on it.
- Status-first: the application pipeline is the spine of every screen.
- A single geometric sans (Space Grotesk) does all the work, hierarchy via weight.

## 2. Colors

A black-on-white foundation with a single lime-green accent and a fixed status vocabulary rendered as dark text on light tints.

### Primary
- **Ink** (`#111827`, near-black): Primary text and **primary buttons** (solid black fill, white label). The dominant "color" of the UI. Hover lifts to `#1F2937`.

### Accent
- **Brand Green** (`#CBFF9E`, lime): The single accent, used **only as a fill** with black text on top — the add-application `+` tile, the active/selected tab, the "Offer" status chip, selected toggles. Black on this green measures 18.3:1; the green itself measures 1.15:1 as text on white, which is exactly why it is **never** used for text, icons, or thin borders.
- **Green Edge** (`#16A34A`, green-600): A darker green reserved for the rare case a green *border* is needed against white (e.g. the Offer chip outline), where the light brand green would be invisible.

### Neutral
- **Surface White** (`#FFFFFF`): The page base and card background.
- **Surface Subtle** (`#F9FAFB`, gray-50): Secondary panels — the table header strip, dropdown menus.
- **Surface Muted** (`#F3F4F6`, gray-100): Secondary buttons and hover states.
- **Text Secondary** (`#374151`, gray-700, 10:1 on white): Sub-labels and secondary content.
- **Text Muted** (`#4B5563`, gray-600, 7.55:1 on white): Metadata, placeholders, helper text. This is the **lightest a text color may go** — nothing below gray-600 is allowed for text.
- **Border Subtle** (`#E5E7EB`, gray-200): Card and divider borders.
- **Border Input** (`#D1D5DB`, gray-300): Form field borders.

### Status Palette (dark text on light tint)
- **Applied** — gray-100 fill (`#F3F4F6`) + gray-800 text.
- **OA** — purple-100 fill (`#EDE9FE`) + purple-900 text.
- **Interview** — amber-100 fill (`#FEF3C7`) + amber-900 text.
- **Offer** — brand green fill (`#CBFF9E`) + black text (the win-state carries the brand accent).
- **Rejected** — red-100 fill (`#FEE2E2`) + red-900 text.
- **Archived** — gray-100 fill + gray-700 text + border.

### Named Rules
**The Green-Is-A-Fill Rule.** Lime green appears only as a background fill with black text on top. It is never text, never an icon, never a 1px border on white. If you can read green *as* a color (a label, a stroke, an icon), it's wrong.

**The Black-Does-The-Work Rule.** Primary buttons and primary text are near-black. Green is reserved for ≤2-3 accent moments per screen (selection, the win-state). Its rarity is the point.

**The AAA Text Floor.** No text color lighter than gray-600 (`#4B5563`, 7.55:1) on white. Muted gray-on-gray is forbidden.

## 3. Typography

**Display / Body / Label Font:** Space Grotesk (with `ui-sans-serif, system-ui` fallback), Google Fonts, weights 400–800.

**Character:** One geometric sans carries everything. Headings go heavy (700–800, near-black) for a confident, friendly tone; body and data sit at a calm 400/600. Hierarchy comes from weight and size, never from a second family.

### Hierarchy
- **Display** (800, `clamp(3rem, 7vw, 4.5rem)`, line-height 1.05): Marketing hero only; not used in-app.
- **Headline** (700, 1.5rem / `text-2xl`): Page and section titles, modal headers.
- **Title** (600, 1.125rem / `text-lg`): Card titles, company/role names.
- **Body** (400, 0.875rem / `text-sm`): The workhorse — table cells, form values, most app text.
- **Label** (600, 0.75rem / `text-xs`): Metadata, status chips, helper text, timestamps.

### Named Rules
**The 16px Input Rule.** Form inputs/selects use 16px text on mobile to prevent iOS auto-zoom, with a 44px minimum touch height.

**The One Family Rule.** Space Grotesk only. Hierarchy from weight and size, not mixed typefaces.

## 4. Elevation

Trackly is near-flat on a white page. Depth comes from a hairline border (`#E5E7EB`) plus a soft shadow on cards, not from tonal layering (there is little to layer on white). Shadows are light and diffuse — enough to lift a card off the page, never heavy. Modals and dropdowns float higher with a stronger shadow over a dimmed backdrop.

### Shadow Vocabulary
- **Card rest** (`shadow-lg` / `shadow-2xl`, soft): Lifts white cards off the white page; paired with a `border-subtle` hairline.
- **Floating** (`shadow-xl`): Dropdown menus and modals above the page.

### Named Rules
**The Border-And-Lift Rule.** On white, a surface is defined by its hairline border first and a soft shadow second — never by a darker fill. If a card needs a gray background to be visible, the border/shadow is too weak.

## 5. Components

### Buttons
- **Shape:** Gently rounded (`rounded-lg`, 10px), generous touch padding (`px-5 py-2`, ≥44px tall).
- **Primary:** Solid **black** (`ink #111827`) fill, white label, `font-semibold`. Hover lifts to `#1F2937`. (Add application, Update status, primary confirms.)
- **Accent:** Brand-green (`#CBFF9E`) fill with **black** label/icon — used sparingly for the add tile and selected states.
- **Secondary / Reset:** White or `surface-muted` fill, ink text, `border-input` outline.
- **Disabled:** `opacity-40`. **Destructive:** red-700 fill, white text (logout, delete confirm).

### Status Chips
- **Style:** Rounded pills (`rounded-full`), compact, `text-xs font-semibold`, **dark text on a light tint** with a matching border.
- **State:** 1:1 to pipeline status (see Colors). Offer uses the brand green with black text.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px); `rounded-xl` for nested panels.
- **Background:** White. Subtle panels (table header, dropdowns) use `surface-subtle`.
- **Border:** `border-subtle` (`#E5E7EB`) hairline defines the edge.
- **Shadow:** Soft lift (see Elevation). **Internal padding:** `p-6`–`p-8`.

### Inputs / Fields
- **Style:** White fill, `border-input` (`#D1D5DB`), `rounded-lg`, ink text, gray-600 placeholder (AAA).
- **Focus:** Near-black ring — `box-shadow: 0 0 0 2px rgba(17,24,39,0.45)`.
- **Selects (`.time-select`):** 44px tall, white, gray-300 border, 16px text.

### Navigation
- **Style:** White top bar with a `border-subtle` bottom hairline. Black wordmark, black/secondary nav text, black primary CTA.
- **States:** Links `text-secondary` → `hover:ink`. Mobile collapses structurally.

### Animation
Quiet, opt-in motion only (`fadeUp` entrance, in-app state transitions at 150–250ms). Honors `prefers-reduced-motion`. No orchestrated page-load sequences in-app.

## 6. Do's and Don'ts

### Do:
- **Do** keep page and card surfaces white (`#FFFFFF`), separated by a `border-subtle` hairline and a soft shadow — not by a gray fill.
- **Do** make primary buttons and primary text near-black (`#111827`); reserve lime green for ≤2-3 accent fills per screen.
- **Do** put **black text on every green fill** (18:1) — the add tile, active tab, Offer chip, selected toggles.
- **Do** render status chips as dark text on a light tint (Applied gray / OA purple / Interview amber / Offer green / Rejected red), always pairing color with the label.
- **Do** keep all text at gray-600 (`#4B5563`) or darker on white; verify ≥7:1.
- **Do** show a visible focus ring (near-black) and keep 44px touch targets with 16px input text on mobile.

### Don't:
- **Don't** use the lime green for text, small icons, status labels, or thin borders on white — it measures 1.15:1 and fails. Green is a fill only.
- **Don't** reintroduce dark surfaces (`bg-gray-800/900`, navy `#070B14`) or the old teal/emerald accent anywhere in the app.
- **Don't** ship trendy AI-startup slop: no gradients, no glow, no emoji-laden copy.
- **Don't** over-gamify: no badges, confetti, streaks, or mascots. Status changes are sober.
- **Don't** drift into spreadsheet/enterprise sprawl: no dense gridlines, no joyless flat hierarchy.
- **Don't** use gray-on-gray muted text or any text color lighter than gray-600 on white.
