import { test, expect } from "@playwright/test";
import { createUser, latestOobLink, login, uniqueName, PASSWORD } from "../support/helpers.js";

test.describe("Authentication", () => {
  test("register → dashboard shows verify banner → verifying the email removes it", async ({ page }) => {
    const username = uniqueName("reg");
    const email = `${username}@example.com`;

    await page.goto("/register");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(`Hello, ${username}`)).toBeVisible();
    await expect(page.getByText(/Verify your email/)).toBeVisible();

    // The emulator captured the verification email; follow its link, then re-check
    await expect.poll(() => latestOobLink(email, "VERIFY_EMAIL")).toBeTruthy();
    const link = await latestOobLink(email, "VERIFY_EMAIL");
    const res = await page.request.get(link);
    expect(res.ok()).toBeTruthy();

    await page.getByRole("button", { name: "I've verified" }).click();
    await expect(page.getByText(/Verify your email/)).toBeHidden();
  });

  test("weak password is rejected inline before any account is created", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Username").fill(uniqueName("weak"));
    await page.getByLabel("Email").fill(`${uniqueName("weak")}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByLabel("Confirm password", { exact: true }).fill("short");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("alert")).toContainText("At least 8 characters");
    await expect(page).toHaveURL(/\/register$/);
  });

  test("a taken username is refused", async ({ page }) => {
    const existing = await createUser();
    await page.goto("/register");
    await page.getByLabel("Username").fill(existing.username);
    await page.getByLabel("Email").fill(`${uniqueName("dupe")}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("alert")).toContainText("username is taken");
  });

  test("wrong password shows an error; correct password logs in; logout returns to login", async ({ page }) => {
    const user = await createUser();

    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill("WrongPass1!");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert")).toContainText("Email or password is incorrect");

    await login(page, user);
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signed-out visitors are sent to login from protected pages", async ({ page }) => {
    for (const path of ["/dashboard", "/settings", "/notes/000000000000000000000000"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    }
  });

  test("forgot password always shows the same confirmation", async ({ page }) => {
    const user = await createUser();
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(user.email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect.poll(() => latestOobLink(user.email, "PASSWORD_RESET")).toBeTruthy();
  });

  test("a signed-in user without a profile is sent to finish sign-up", async ({ page }) => {
    const user = await createUser({ profile: false });
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole("heading", { name: "Choose a username" })).toBeVisible();
    await page.getByLabel("Username").fill(user.username);
    await page.getByRole("button", { name: "Continue to dashboard" }).click();
    await expect(page.getByText(`Hello, ${user.username}`)).toBeVisible();
  });
});
