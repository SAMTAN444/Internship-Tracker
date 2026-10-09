import { defineConfig, devices } from "@playwright/test";

// Ports chosen so they never collide with your normal dev servers
// (API 5005, client 5174, local Docker Mongo 27018).
export const PORTS = { mongo: 27099, auth: 9099, api: 5099, web: 5185 };
export const PROJECT_ID = "demo-trackly"; // "demo-" projects need no Firebase login

export default defineConfig({
  testDir: "./tests",
  // Tests create their own users, but the app shares one backend; keep runs predictable
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: `http://localhost:${PORTS.web}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Everything the app needs, started fresh for each run and stopped afterwards.
  // Order matters: database and auth first, then the API, then the client.
  webServer: [
    {
      command: "node support/mongo-server.mjs",
      port: PORTS.mongo,
      timeout: 120_000, // first run downloads a mongod binary
      reuseExistingServer: false,
    },
    {
      command: `npx firebase emulators:start --only auth --project ${PROJECT_ID}`,
      url: `http://127.0.0.1:${PORTS.auth}`,
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: "node server.js",
      cwd: "../server",
      url: `http://127.0.0.1:${PORTS.api}`,
      reuseExistingServer: false,
      env: {
        PORT: String(PORTS.api),
        MONGO_URI: `mongodb://127.0.0.1:${PORTS.mongo}/trackly_e2e`,
        FIREBASE_AUTH_EMULATOR_HOST: `127.0.0.1:${PORTS.auth}`,
        FIREBASE_PROJECT_ID: PROJECT_ID,
      },
    },
    {
      command: `npx vite --port ${PORTS.web} --strictPort`,
      cwd: "../client",
      url: `http://localhost:${PORTS.web}`,
      reuseExistingServer: false,
      // Shell env beats client/.env.local, so the real Firebase keys are never used here
      env: {
        VITE_API_URL: `http://127.0.0.1:${PORTS.api}`,
        VITE_FIREBASE_API_KEY: "demo-key",
        VITE_FIREBASE_AUTH_DOMAIN: `${PROJECT_ID}.firebaseapp.com`,
        VITE_FIREBASE_PROJECT_ID: PROJECT_ID,
        VITE_FIREBASE_APP_ID: "demo-app",
        VITE_FIREBASE_AUTH_EMULATOR_HOST: `127.0.0.1:${PORTS.auth}`,
      },
    },
  ],
});
