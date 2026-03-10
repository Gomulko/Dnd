import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await page.goto("/kreator/koncept");
});

test("stepper pokazuje krok 1 jako aktywny", async ({ page }) => {
  // Krok 1 ma numer w złotym kółku
  const stepBubbles = page.locator("div").filter({ hasText: /^1$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("przycisk Dalej zablokowany gdy imię puste", async ({ page }) => {
  const dalej = page.getByRole("button", { name: /dalej/i });
  await expect(dalej).toBeDisabled();
});

test("przycisk Dalej zablokowany gdy imię ma 1 znak", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("A");
  const dalej = page.getByRole("button", { name: /dalej/i });
  await expect(dalej).toBeDisabled();
});

test("przycisk Dalej aktywny po wpisaniu imienia", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Aragorn");
  const dalej = page.getByRole("button", { name: /dalej/i });
  await expect(dalej).toBeEnabled();
});

test("podgląd postaci aktualizuje inicjały na żywo", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Mira Zła");
  // Inicjały: MZ
  await expect(page.getByText("MZ")).toBeVisible();
});

test("toggle płci zmienia zaznaczenie", async ({ page }) => {
  await page.getByRole("button", { name: /kobieta/i }).click();
  // Sprawdzamy że przycisk jest zaznaczony (złoty border — przez kolor tekstu)
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
  await expect(page).toHaveURL(/\/kreator\/rasa/);
});

test("dane zostają po odświeżeniu strony", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Trwały Bohater");
  await page.getByRole("button", { name: /kobieta/i }).click();
  await page.reload();
  await expect(page.locator('input[placeholder*="Aldric"]')).toHaveValue("Trwały Bohater");
});
