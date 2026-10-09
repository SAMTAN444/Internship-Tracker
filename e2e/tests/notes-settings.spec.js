import { test, expect } from "@playwright/test";
import { createUser, login, seedInternships } from "../support/helpers.js";

test.describe("Notes", () => {
  test("write Markdown, save with the keyboard, and preview it", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, [{ company: "Stripe" }]);
    await login(page, user);

    await page.getByRole("button", { name: "Open notes for Stripe" }).click();
    const notes = page.getByLabel("Notes for Stripe", { exact: true });
    await expect(notes).toBeVisible();

    await notes.fill("# Round 1\n\n**Bold** and a list:\n\n- one\n- two");
    await expect(page.getByText("Unsaved changes")).toBeVisible();
    // Press the shortcut the Save button advertises (Ctrl+S or Cmd+S depends on the platform the page detects)
    const shortcut = await page.getByRole("button", { name: /^Save/ }).getAttribute("aria-keyshortcuts");
    await page.keyboard.press(shortcut.replace("+S", "+s"));
    await expect(page.getByText("All changes saved")).toBeVisible();

    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.locator(".prose h1")).toHaveText("Round 1");
    await expect(page.locator(".prose li")).toHaveCount(2);

    // Saved on the server, not just in the page
    await page.reload();
    await expect(page.getByLabel("Notes for Stripe", { exact: true })).toHaveValue(/# Round 1/);
  });

  test("an unknown application shows an inline error", async ({ page }) => {
    const user = await createUser();
    await login(page, user);
    await page.goto("/notes/000000000000000000000000");
    await expect(page.getByRole("alert")).toContainText("Couldn't load these notes");
  });
});

test.describe("Settings", () => {
  test("appearance switch applies dark mode and remembers it", async ({ page }) => {
    const user = await createUser();
    await login(page, user);

    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");

    await page.getByRole("radio", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("shows the account and verification status", async ({ page }) => {
    const user = await createUser({ verified: false });
    await login(page, user);
    await page.getByRole("link", { name: "Settings" }).click();

    await expect(page.getByText(user.email)).toBeVisible();
    await expect(page.getByText("Not verified")).toBeVisible();
    await page.getByRole("button", { name: "Email me a password change link" }).click();
    await expect(page.getByText(/expires in an hour/)).toBeVisible();
  });
});

test.describe("Landing page", () => {
  test("fits one laptop screen and links to sign-up", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Every internship application");

    const { height, page: pageHeight } = await page.evaluate(() => ({
      height: window.innerHeight,
      page: document.documentElement.scrollHeight,
    }));
    expect(pageHeight).toBeLessThanOrEqual(height);

    await page.getByRole("link", { name: /Start tracking/ }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("no sideways scrolling on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  });
});
