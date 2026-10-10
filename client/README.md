# Trackly client

React 19 + Vite single-page app, styled with Tailwind CSS v4 and deployed on Vercel. See the [root README](../README.md) for the full project overview.

## Run locally

```bash
cp .env.example .env.local   # then fill in the Firebase web config
npm install
npm run dev                  # http://localhost:5174
```

The API must be running too (`cd ../server && npm run dev`, on port 5005).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (also runs in CI) |

## Where things live

- `src/pages/`: one component per screen
- `src/components/`: reusable UI; `ui.js` holds shared button and card styles
- `src/hooks/useInternships.js`: dashboard data and actions
- `src/services/`: Firebase setup, the API client (`api.js`) and one function per endpoint
- `src/context/`: auth session and theme
- `src/index.css`: design tokens for light and dark mode (see `../DESIGN.md`)
