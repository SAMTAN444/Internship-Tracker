import { test, expect } from "@playwright/test";
import { createUser, login, seedInternships } from "../support/helpers.js";

// 14 applications = two pages at 10 per page
const fourteen = Array.from({ length: 14 }, (_, i) => ({ company: `Co${String(i).padStart(2, "0")}` }));

test.describe("Dashboard", () => {
  test("pagination, debounced search and reset", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, fourteen);
    await login(page, user);

    await expect(page.getByText("Page 1 of 2")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(10);

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByText("Page 2 of 2")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(4);

    await page.getByLabel("Search applications").fill("Co03");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(page.getByRole("row", { name: /Co03/ })).toBeVisible();

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.locator("tbody tr")).toHaveCount(10);
  });

  test("sorting a column updates aria-sort", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, [{ company: "A", cycle: "Fall" }, { company: "B", cycle: "Spring" }]);
    await login(page, user);

    const cycleHeader = page.getByRole("columnheader", { name: /Cycle/ });
    await cycleHeader.getByRole("button").click();
    await expect(cycleHeader).toHaveAttribute("aria-sort", "ascending");
    // Pipeline order, not alphabetical: Spring comes before Fall
    await expect(page.locator("tbody tr").first()).toContainText("Spring");
    await cycleHeader.getByRole("button").click();
    await expect(cycleHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("add an application through the form", async ({ page }) => {
    const user = await createUser();
    await login(page, user);
    await expect(page.getByText("No applications yet")).toBeVisible();

    await page.getByRole("button", { name: "Add application", exact: true }).click();
    const form = page.locator("#add-application-form");
    await expect(page.getByLabel("Company Name")).toBeFocused();

    await page.getByLabel("Company Name").fill("Stripe");
    await page.getByLabel("Position").fill("Backend Engineer Intern");
    await page.getByLabel("Time Period").click();
    await form.getByRole("button", { name: /Summer/ }).click();
    await page.getByLabel("Date Applied").click();
    await form.locator(".rdp-day_button", { hasText: /^15$/ }).click();
    await form.getByRole("button", { name: "Add application", exact: true }).click();

    await expect(page.getByText("Internship added")).toBeVisible();
    await expect(form).toBeHidden();
    await expect(page.getByRole("row", { name: /Stripe/ })).toBeVisible();
    await expect(page.getByText("0 of 1 heard back")).toBeVisible();
  });

  test("edit and delete through the row menu", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, [{ company: "Zeta" }]);
    await login(page, user);

    await page.getByRole("button", { name: "More actions for Zeta" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    const dialog = page.getByRole("dialog", { name: "Edit application" });
    await dialog.getByLabel("Company Name").fill("Zeta Labs");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("row", { name: /Zeta Labs/ })).toBeVisible();

    await page.getByRole("button", { name: "More actions for Zeta Labs" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByText("No applications yet")).toBeVisible();
  });

  test("row menu stays on screen for the last row", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, fourteen.slice(0, 3));
    await page.setViewportSize({ width: 1280, height: 700 });
    await login(page, user);

    const lastRow = page.locator("tbody tr").last();
    await lastRow.scrollIntoViewIfNeeded();
    await lastRow.getByRole("button", { name: /More actions/ }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeInViewport({ ratio: 1 });
  });

  test("bulk archive moves items to the Archived tab, and unarchive brings them back", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, [{ company: "Keep" }, { company: "Old1" }, { company: "Old2" }]);
    await login(page, user);

    await page.getByRole("checkbox", { name: "Select Old1 application" }).check();
    await page.getByRole("checkbox", { name: "Select Old2 application" }).check();
    await expect(page.getByText("2 selected")).toBeVisible();

    await page.getByRole("button", { name: /^Status to apply/ }).click();
    await page.getByRole("option", { name: "Archive" }).click();
    await page.getByRole("button", { name: "Update status" }).click();

    await expect(page.getByRole("button", { name: "Archived", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("tbody tr")).toHaveCount(2);
    await expect(page.getByText("0 selected")).toBeVisible();
    // Pipeline counts active applications only
    await expect(page.getByText("0 of 1 heard back")).toBeVisible();

    await page.getByRole("checkbox", { name: "Select all applications" }).check();
    await page.getByRole("button", { name: "Update status" }).click();
    await expect(page.getByRole("button", { name: "Active", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("tbody tr")).toHaveCount(3);
  });

  test("pipeline card counts each stage", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, [
      { company: "A", status: "Applied" },
      { company: "B", status: "OA" },
      { company: "C", status: "Interview" },
      { company: "D", status: "Offer" },
      { company: "E", status: "Archived" },
    ]);
    await login(page, user);

    const pipeline = page.getByRole("region", { name: "Pipeline" });
    await expect(pipeline).toContainText("3 of 4 heard back (75%)");
    await expect(pipeline).toContainText("1 offer");
  });

  test("mobile layout shows cards without sideways scrolling", async ({ page }) => {
    const user = await createUser();
    await seedInternships(user, fourteen.slice(0, 5));
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, user);

    await expect(page.getByRole("checkbox", { name: /^Select Co0\d application$/ })).toHaveCount(5);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  });
});
