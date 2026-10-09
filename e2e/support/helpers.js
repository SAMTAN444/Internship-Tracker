// Shared test helpers. Users and data are created straight through the Auth
// Emulator and the API, so each test starts from a known state without
// clicking through sign-up every time.
import { expect } from "@playwright/test";
import { PORTS, PROJECT_ID } from "../playwright.config.js";

export const API = `http://127.0.0.1:${PORTS.api}`;
const EMULATOR = `http://127.0.0.1:${PORTS.auth}`;
const IDENTITY = `${EMULATOR}/identitytoolkit.googleapis.com/v1`;
// The emulator accepts this as an admin credential for its management endpoints
const ADMIN = { Authorization: "Bearer owner", "Content-Type": "application/json" };

export const PASSWORD = "Password1!";

let counter = 0;
// Unique per test run so tests never trip over each other's users
export const uniqueName = (prefix = "user") => `${prefix}_${Date.now().toString(36)}${counter++}`;

const json = async (res) => {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(body)}`);
  return body;
};

/** Signs in with the emulator and returns a fresh ID token. */
export async function idTokenFor(email, password = PASSWORD) {
  const res = await fetch(`${IDENTITY}/accounts:signInWithPassword?key=demo-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  return (await json(res)).idToken;
}

/**
 * Creates a Firebase account and its Trackly profile.
 * Returns { username, email, password, token }.
 */
export async function createUser({ verified = true, profile = true } = {}) {
  const username = uniqueName();
  const email = `${username}@example.com`;

  const signUp = await json(
    await fetch(`${IDENTITY}/accounts:signUp?key=demo-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
    })
  );

  if (verified) {
    await json(
      await fetch(`${IDENTITY}/projects/${PROJECT_ID}/accounts:update`, {
        method: "POST",
        headers: ADMIN,
        body: JSON.stringify({ localId: signUp.localId, emailVerified: true }),
      })
    );
  }

  const token = await idTokenFor(email);
  if (profile) {
    await json(
      await fetch(`${API}/api/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username }),
      })
    );
  }
  return { username, email, password: PASSWORD, token, uid: signUp.localId };
}

/** Calls the API as a user. Returns { status, body }. */
export async function api(token, method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

/** Adds internships for a user. Accepts partial objects; fills the required fields. */
export async function seedInternships(user, items) {
  const created = [];
  for (const item of items) {
    const { body } = await api(user.token, "POST", "/api/internships", {
      role: "Software Engineer Intern",
      cycle: "Summer",
      appliedAt: new Date().toISOString(),
      ...item,
    });
    created.push(body);
  }
  return created;
}

/** The emulator keeps every email action link instead of sending mail. */
export async function latestOobLink(email, requestType) {
  const { oobCodes } = await json(await fetch(`${EMULATOR}/emulator/v1/projects/${PROJECT_ID}/oobCodes`));
  const match = oobCodes.filter((c) => c.email === email && c.requestType === requestType).pop();
  return match?.oobLink;
}

/** Logs in through the real UI and waits for the dashboard. */
export async function login(page, user) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Pipeline" })).toBeVisible();
}
