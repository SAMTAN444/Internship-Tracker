---
name: Trackly
description: A calm, sage-accented tracker for internship applications, in light and dark.
colors:
  # Light theme (OKLCH). Dark values live in client/src/index.css under .dark
  canvas: "oklch(0.985 0.003 155)"
  surface: "oklch(1 0 0)"
  surface-2: "oklch(0.97 0.004 155)"
  surface-3: "oklch(0.94 0.005 155)"
  line: "oklch(0.91 0.006 155)"
  line-strong: "oklch(0.84 0.008 155)"
  fg: "oklch(0.22 0.012 155)"
  fg-muted: "oklch(0.45 0.012 155)"
  brand: "oklch(0.44 0.07 155)"
  brand-soft: "oklch(0.94 0.021 155)"
  mark: "oklch(0.86 0.042 155)"
  danger: "oklch(0.47 0.16 25)"
typography:
  family: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
  scale: { xs: "12px", sm: "14px", base: "16px", xl: "20px", 2xl: "24px" }
  weights: [400, 500, 600]
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
---

# Design System: Trackly

## 1. Overview

**North star: "The Quiet Desk."** Trackly is a work tool students open between classes to check where things stand. It should feel like a well-made notebook: neutral surfaces, one calm accent, and colour reserved for the application pipeline.

It supports **light and dark** themes. The user picks System, Light or Dark in Settings (System follows the device). The choice is stored in `localStorage` (`trackly-theme`) and applied as a `.dark` class on `<html>` before first paint (inline script in `client/index.html`).

The system rejects three things (see PRODUCT.md anti-references): AI-startup gloss (neon accents, glow, gradient text), gamification, and spreadsheet sprawl.

## 2. Where the tokens live

All colours are CSS variables in `client/src/index.css`: `:root` holds light values, `.dark` holds dark ones, and `@theme inline` exposes them as Tailwind utilities. **Components never use raw palette classes** (`gray-*`, `white`, hex). Use:

| Utility | Use |
|---|---|
| `bg-canvas` | Page background |
| `bg-surface` | Cards, header, inputs, menus |
| `bg-surface-2` / `bg-surface-3` | Hover, subtle panels, pressed |
| `border-line` / `border-line-strong` | Card edges / input edges |
| `text-fg` / `text-fg-muted` | Primary / secondary text |
| `bg-brand text-on-brand`, `hover:bg-brand-hover` | Primary action |
| `bg-brand-soft` | Selected tab or segment |
| `text-danger`, `bg-danger`, `bg-danger-soft` | Errors and destructive actions |

Shared button and card class strings live in `client/src/components/ui.js` (`btnPrimary`, `btnSecondary`, `btnGhost`, `btnDanger`, `btnIcon`, `card`, `cardTitle`). Reuse them instead of writing new button styles.

## 3. Colour

- **Restrained.** Tinted neutrals (a trace of hue 155) plus one accent, sage.
- **Sage accent** appears only on: primary buttons, the selected tab or segment, focus rings, and the logo's marker bar. Never on outlines, borders or decoration.
- **Neutrals** never go below `fg-muted` for text. Both themes keep body text at 7:1 or better.
- **Dark theme** is a blue-green near-black (`oklch(0.17 …)`), never pure black. Elevation comes from slightly lighter surfaces, not shadows.

### Status chips

Defined once as `.chip` + `.chip-{status}` in `index.css`, mapped in `components/statusStyles.js`.

- A **soft tinted fill** per stage: Applied/Archived neutral, OA violet (295), Interview amber (80), Offer green (150), Rejected red (25).
- **No border, ever.** **One text colour** (`fg`) for every stage.
- The label is always written out, so colour is never the only signal.
- Cycle tags (Summer, Fall…) use `.chip-cycle`: neutral, slightly squarer, muted text.
- Pipeline bar segments use `.bar-{status}`: the same hues, one step stronger.

## 4. Typography

- **System UI font** only (SF Pro on Apple, Segoe on Windows).
- **Fixed scale:** 12 (`text-xs`), 14 (`text-sm`, the workhorse), 16 (`text-base`), 20 (`text-xl`, card titles), 24 (`text-2xl`, page titles). The landing hero is the only exception (36/48).
- **Weights:** 400, 500 (labels, buttons, table emphasis), 600 (titles). No bold or extrabold.
- **Inputs** use 16px text so iOS Safari doesn't zoom.
- **No all-caps** headings or table headers.

## 5. Shape and elevation

- **Radii:** 6px (chips' square variant, segments), 8px (buttons, inputs, menus), 12px (cards, modals), full (status chips).
- **Cards:** `bg-surface` + 1px `border-line` and no shadow. **Never nest a card inside a card;** lists inside cards are divided rows.
- **Shadows** only on things that float: menus and popovers (`shadow-lg`), modals (`shadow-2xl`).

## 6. Components

- **Buttons:** 40px minimum height (icon buttons 44px), `text-sm font-medium`. Primary is sage; secondary is surface + strong border; ghost is text only; danger is red.
- **Segmented controls** (Active/Archived, Edit/Preview, Appearance): a 1px-bordered track, with the selected item on `bg-brand-soft`.
- **Inputs:** `.field` class. Surface background, strong border, sage focus ring.
- **Tables:** sentence-case 12px muted headers, 14px rows separated by `border-line`, and hover `bg-surface-2`.
- **Logo:** lowercase "trackly" wordmark with a `--mark` bar under "track" (`components/Logo.jsx`). The favicon is a "t" tile (`client/public/favicon.svg`).

- **Landing hero:** a static miniature of the dashboard (`components/LandingPreview.jsx`) built from the real chip/bar classes, not an illustration.
- **Display font:** landing-page headings only use `font-display` (Bricolage Grotesque). Everything in the app stays on the system font.

## 7. Motion

150–250ms colour transitions on hover/state. The landing page's entrance is movement-only (`fadeUp` translates, never hides content). Everything respects `prefers-reduced-motion`.

## 8. Do / Don't

**Do:**
- Use the token utilities and `ui.js` classes.
- Write status labels out.
- Check new colours in both themes.

**Don't:**
- Use raw `gray-*`, `white`, hex or `dark:` overrides in components.
- Put coloured borders on chips.
- Use the accent for decoration.
- Nest cards.
- Use type sizes outside the scale.
- Use glow, gradient text or glassmorphism.
