import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

async function goToAldricSheet(page: Page) {
  await loginAs(page);
  await page.goto("/dashboard");
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Aldric Swietlisty" });
  await card.getByRole("link", { name: /Otwórz kartę/ }).click();
  await page.waitForURL(/\/karta\//);
}

test("przycisk 'Eksportuj PDF' jest widoczny na karcie postaci", async ({ page }) => {
  await goToAldricSheet(page);
  await expect(page.getByTestId("export-pdf-btn")).toBeVisible();
  await expect(page.getByTestId("export-pdf-btn")).toHaveText(/eksportuj pdf/i);
});

test("API /export-pdf/[id] zwraca 401 bez sesji", async ({ request }) => {
  const res = await request.get("/api/export-pdf/fake-id");
  expect(res.status()).toBe(401);
});

test("API /export-pdf/[id] zwraca 404 dla nieistniejącej postaci", async ({ page, request }) => {
  await loginAs(page);
  // Pobierz ciasteczka sesji z przeglądarki i przekaż do request context
  const cookies = await page.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await request.get("/api/export-pdf/nie-istnieje-taki-id", {
    headers: { Cookie: cookieHeader },
  });
  expect(res.status()).toBe(404);
});

test("API /export-pdf/[id] zwraca PDF dla istniejącej postaci", async ({ page, request }) => {
  await loginAs(page);
  // Pobierz ID postaci z URL karty
  await page.goto("/dashboard");
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Aldric Swietlisty" });
  await card.getByRole("link", { name: /Otwórz kartę/ }).click();
  await page.waitForURL(/\/karta\//);
  const characterId = page.url().split("/karta/")[1];

  const cookies = await page.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const res = await request.get(`/api/export-pdf/${characterId}`, {
    headers: { Cookie: cookieHeader },
  });

  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
  expect(res.headers()["content-disposition"]).toContain(".pdf");

  const body = await res.body();
  // PDF zaczyna się od "%PDF"
  expect(body.slice(0, 4).toString()).toBe("%PDF");
});

test("kliknięcie 'Eksportuj PDF' inicjuje pobieranie pliku", async ({ page }) => {
  await goToAldricSheet(page);

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByTestId("export-pdf-btn").click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
});
