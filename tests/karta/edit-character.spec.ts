import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

async function goToAldricSheet(page: Page) {
  await loginAs(page);
  await page.goto("/dashboard");
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Aldric Swietlisty" });
  await card.getByRole("link", { name: /Graj/ }).click();
  await page.waitForURL(/\/karta\//);
}

test("karta postaci pokazuje przyciski topbaru", async ({ page }) => {
  await goToAldricSheet(page);
  await expect(page.getByTestId("back-to-dashboard")).toBeVisible();
  await expect(page.getByTestId("edit-character-btn")).toBeVisible();
});

test("przycisk '← Moje Postacie' wraca na dashboard", async ({ page }) => {
  await goToAldricSheet(page);
  await page.getByTestId("back-to-dashboard").click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test("kliknięcie 'Edytuj Postać' otwiera kreator krok 1 z danymi postaci", async ({ page }) => {
  await goToAldricSheet(page);
  await page.getByTestId("edit-character-btn").click();
  await expect(page).toHaveURL(/\/kreator\/koncept/);
  // Imię postaci wczytane ze store
  await expect(page.locator('input[placeholder*="Aldric"]')).toHaveValue("Aldric Swietlisty");
});

test("w trybie edycji przycisk zapisu mówi 'Zapisz Zmiany'", async ({ page }) => {
  await goToAldricSheet(page);
  await page.getByTestId("edit-character-btn").click();
  await expect(page).toHaveURL(/\/kreator\/koncept/);
  await page.goto("/kreator/gotowe");
  await expect(page.getByRole("button", { name: /Zapisz Zmiany/ })).toBeVisible();
});

test("edycja imienia postaci i zapis wraca na kartę postaci", async ({ page }) => {
  await goToAldricSheet(page);
  const kartaUrl = page.url();
  await page.getByTestId("edit-character-btn").click();
  await expect(page).toHaveURL(/\/kreator\/koncept/);

  const nameInput = page.locator('input[placeholder*="Aldric"]');
  await nameInput.clear();
  await nameInput.fill("Aldric Edytowany");

  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Zmiany/ }).click();

  // Powinno wrócić na tę samą kartę postaci
  await page.waitForURL(kartaUrl, { timeout: 10000 });
  await expect(page.getByText("Aldric Edytowany").first()).toBeVisible();
});

test("zmiana jest trwała — imię zaktualizowane w bazie", async ({ page }) => {
  await loginAs(page);
  await page.goto("/dashboard");
  await expect(page.getByText("Aldric Edytowany").first()).toBeVisible();
});

test("przywrócenie oryginalnego imienia postaci", async ({ page }) => {
  await loginAs(page);
  await page.goto("/dashboard");
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Aldric Edytowany" });
  await card.getByRole("link", { name: /Graj/ }).click();
  await page.waitForURL(/\/karta\//);
  const kartaUrl = page.url();

  await page.getByTestId("edit-character-btn").click();
  const nameInput = page.locator('input[placeholder*="Aldric"]');
  await nameInput.clear();
  await nameInput.fill("Aldric Swietlisty");
  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Zmiany/ }).click();

  await page.waitForURL(kartaUrl, { timeout: 10000 });
  await expect(page.getByText("Aldric Swietlisty").first()).toBeVisible();
});
