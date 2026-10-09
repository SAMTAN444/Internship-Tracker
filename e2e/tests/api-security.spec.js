// API-level checks: no browser, just requests. These cover the security
// rules that the UI can't easily exercise.
import { test, expect } from "@playwright/test";
import { api, createUser, seedInternships } from "../support/helpers.js";

test.describe("API security", () => {
  test("requests without a valid token are rejected", async () => {
    expect((await api(null, "GET", "/api/internships")).body.code).toBe("TOKEN_MISSING");
    const bad = await api("not-a-real-token", "GET", "/api/internships");
    expect(bad.status).toBe(401);
    expect(bad.body.code).toBe("TOKEN_INVALID");
  });

  test("users cannot read, edit or delete each other's applications", async () => {
    const alice = await createUser();
    const bob = await createUser();
    const [mine] = await seedInternships(alice, [{ company: "AliceCo" }]);

    expect((await api(bob.token, "GET", `/api/internships/${mine._id}`)).status).toBe(404);
    expect((await api(bob.token, "PUT", `/api/internships/${mine._id}`, { company: "Hacked" })).status).toBe(404);
    expect((await api(bob.token, "DELETE", `/api/internships/${mine._id}`)).status).toBe(404);

    const bobsList = await api(bob.token, "GET", "/api/internships");
    expect(bobsList.body.total).toBe(0);
  });

  test("clients cannot reassign ownership (mass assignment)", async () => {
    const alice = await createUser();
    const bob = await createUser();
    const bobsId = (await api(bob.token, "GET", "/api/auth/me")).body._id;

    const [created] = await seedInternships(alice, [{ company: "Mine", user: bobsId }]);
    expect(created.user).not.toBe(bobsId);

    const updated = await api(alice.token, "PUT", `/api/internships/${created._id}`, { user: bobsId });
    expect(updated.body.user).not.toBe(bobsId);
  });

  test("search input is treated as text, and field / limit are constrained", async () => {
    const user = await createUser();
    await seedInternships(user, [{ company: "Acme" }]);

    const t0 = Date.now();
    const evil = await api(user.token, "GET", `/api/internships?q=${encodeURIComponent("(a+)+$")}`);
    expect(evil.status).toBe(200);
    expect(Date.now() - t0).toBeLessThan(2000);

    const bracket = await api(user.token, "GET", `/api/internships?q=${encodeURIComponent("[")}`);
    expect(bracket.status).toBe(200);

    const capped = await api(user.token, "GET", "/api/internships?limit=10000&page=-3");
    expect(capped.body.limit).toBe(50);
    expect(capped.body.page).toBe(1);
  });

  test("malformed ids and invalid statuses return clean JSON errors", async () => {
    const user = await createUser();
    const notFound = await api(user.token, "GET", "/api/internships/notanid");
    expect(notFound.status).toBe(404);
    expect(notFound.body).toHaveProperty("message");

    const [item] = await seedInternships(user, [{ company: "X" }]);
    const badStatus = await api(user.token, "PUT", "/api/internships/bulk-status", { ids: [item._id], status: "Bogus" });
    expect(badStatus.status).toBe(400);
  });

  test("reminders only for OA/Interview and only in the future", async () => {
    const user = await createUser();
    const [oa] = await seedInternships(user, [{ company: "OACo", status: "OA" }]);
    const future = new Date(Date.now() + 86_400_000).toISOString();
    const past = new Date(Date.now() - 86_400_000).toISOString();

    expect((await api(user.token, "PUT", `/api/internships/${oa._id}/reminder`, { type: "OA", remindAt: past })).status).toBe(400);
    expect((await api(user.token, "PUT", `/api/internships/${oa._id}/reminder`, { type: "OA", remindAt: future })).status).toBe(200);
    expect((await api(user.token, "GET", "/api/internships/reminders/upcoming")).body).toHaveLength(1);

    // Moving out of OA/Interview clears the reminder
    const moved = await api(user.token, "PUT", `/api/internships/${oa._id}`, { status: "Offer" });
    expect(moved.body.reminder ?? null).toBeNull();
  });
});
