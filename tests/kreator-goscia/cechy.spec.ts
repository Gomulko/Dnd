import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/kreator-goscia/cechy");
});

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await expect(page.getByText(/TRYB GOŚCIA/i)).toBeVisible();
});

test("stepper pokazuje krok 4 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^4$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("domyślna zakładka to Standardowy Zestaw", async ({ page }) => {
  await expect(page.getByText("Przypisz każdą z wartości")).toBeVisible();
});

// ── Standard Array ────────────────────────────────────────────────────────────

test("[standard] 6 selectów dla 6 cech", async ({ page }) => {
  await expect(page.locator("select")).toHaveCount(6);
});

test("[standard] Dalej zablokowany gdy nie wszystkie przypisane", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("[standard] przypisanie wszystkich 6 wartości odblokowuje Dalej", async ({ page }) => {
  const selects = page.locator("select");
  const values = ["15", "14", "13", "12", "10", "8"];
  for (let i = 0; i < 6; i++) {
    await selects.nth(i).selectOption(values[i]);
  }
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("[standard] ta sama wartość jest zablokowana w innych selectach", async ({ page }) => {
  await page.locator("select").first().selectOption("15");
  const option15 = page.locator("select").nth(1).locator("option[value='15']");
  await expect(option15).toBeDisabled();
});

// ── Point Buy ─────────────────────────────────────────────────────────────────

test("[pointbuy] przełączenie na zakładkę Point Buy", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  await expect(page.getByText("27 punktów").first()).toBeVisible();
});

test("[pointbuy] startowy budżet wynosi 27", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  await expect(page.getByText("27 pkt")).toBeVisible();
});

test("[pointbuy] przycisk + zwiększa wartość i odlicza punkty", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  await page.getByRole("button", { name: /Zwiększ Siłę/ }).click();
  await expect(page.getByText("26 pkt")).toBeVisible();
});

test("[pointbuy] przycisk − zmniejsza wartość i zwraca punkty", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  await page.getByRole("button", { name: /Zwiększ Siłę/ }).click();
  await page.getByRole("button", { name: /Zmniejsz Siłę/ }).click();
  await expect(page.getByText("27 pkt")).toBeVisible();
});

test("[pointbuy] nie można zejść poniżej 8", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  await expect(page.getByRole("button", { name: /Zmniejsz Siłę/ })).toBeDisabled();
});

test("[pointbuy] nie można przekroczyć 15", async ({ page }) => {
  await page.getByRole("button", { name: /Zakup Punktów/ }).click();
  for (let i = 0; i < 7; i++) {
    await page.getByRole("button", { name: /Zwiększ Siłę/ }).click();
  }
  await expect(page.getByRole("button", { name: /Zwiększ Siłę/ })).toBeDisabled();
});

// ── Roll ──────────────────────────────────────────────────────────────────────

test("[roll] przełączenie na zakładkę Rzut Kośćmi", async ({ page }) => {
  await page.getByRole("button", { name: /Rzut Kośćmi/ }).click();
  await expect(page.getByRole("button", { name: /Rzuć wszystkie/ })).toBeVisible();
});

test("[roll] Rzuć wszystkie generuje wartości i odblokowuje Dalej", async ({ page }) => {
  await page.getByRole("button", { name: /Rzut Kośćmi/ }).click();
  await page.getByRole("button", { name: /Rzuć wszystkie/ }).click();
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("[roll] pojedynczy rzut dla konkretnej cechy", async ({ page }) => {
  await page.getByRole("button", { name: /Rzut Kośćmi/ }).click();
  await page.getByRole("button", { name: /Rzuć Siłę/ }).click();
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

// ── Panel podsumowania ────────────────────────────────────────────────────────

test("panel podsumowania pokazuje Max HP i Klasę Pancerza", async ({ page }) => {
  await expect(page.getByText("Max HP (poz. 1)").first()).toBeVisible();
  await expect(page.getByText("Klasa Pancerza").first()).toBeVisible();
  await expect(page.getByText("Inicjatywa").first()).toBeVisible();
});

// ── Nawigacja ─────────────────────────────────────────────────────────────────

test("Dalej nawiguje do kroku Tło", async ({ page }) => {
  const selects = page.locator("select");
  const values = ["15", "14", "13", "12", "10", "8"];
  for (let i = 0; i < 6; i++) {
    await selects.nth(i).selectOption(values[i]);
  }
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/tlo/);
});

test("Wróć nawiguje do kroku Klasa", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/klasa/);
});
