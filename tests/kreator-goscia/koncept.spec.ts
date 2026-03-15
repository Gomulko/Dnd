import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/kreator-goscia/koncept");
});

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await expect(page.getByText(/TRYB GOŚCIA/i)).toBeVisible();
});

test("stepper pokazuje krok 1 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^1$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("przycisk Dalej zablokowany gdy imię puste", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("przycisk Dalej zablokowany gdy imię ma 1 znak", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("A");
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("przycisk Dalej aktywny po wpisaniu imienia", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Aragorn");
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("podgląd postaci aktualizuje inicjały na żywo", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Mira Zła");
  await expect(page.getByText("MZ")).toBeVisible();
});

test("toggle płci zmienia zaznaczenie", async ({ page }) => {
  await page.getByRole("button", { name: /kobieta/i }).click();
  await expect(page.getByRole("button", { name: /kobieta/i })).toBeVisible();
  await page.getByRole("button", { name: /mężczyzna/i }).click();
  await expect(page.getByRole("button", { name: /mężczyzna/i })).toBeVisible();
});

test("grid alignmentów pozwala wybrać jeden", async ({ page }) => {
  await page.getByRole("button", { name: /LG/i }).click();
  await expect(page.getByText("Praworządny Dobry")).toBeVisible();
  await page.getByRole("button", { name: /CE/i }).click();
  await expect(page.getByText("Chaotyczny Zły")).toBeVisible();
});

test("licznik opisu działa poprawnie", async ({ page }) => {
  const textarea = page.locator("textarea");
  await textarea.fill("Opis testowy");
  await expect(page.getByText(/12\/500/)).toBeVisible();
});

test("Dalej nawiguje do kroku Rasa", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Testowy Bohater");
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/rasa/);
});

test("dane zostają po odświeżeniu strony", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Trwały Bohater");
  await page.getByRole("button", { name: /kobieta/i }).click();
  await page.reload();
  await expect(page.locator('input[placeholder*="Aldric"]')).toHaveValue("Trwały Bohater");
});
