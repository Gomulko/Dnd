import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { loginAs } from "../helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/kreator/klasa");
});

function classBtn(page: Page, name: string) {
  return page.locator("button").filter({ hasText: name }).first();
}

test("stepper pokazuje krok 3 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^3$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("grid pokazuje wszystkie 12 klas", async ({ page }) => {
  const buttons = page.locator("button").filter({
    hasText: /Barbarzyńca|Bard|Kleryk|Druid|Wojownik|Mnich|Paladyn|Łowca|Łotrzyk|Czarownik|Warlock|Czarodziej/,
  });
  await expect(buttons).toHaveCount(12);
});

test("filtr Support zostawia tylko klasy wsparcia", async ({ page }) => {
  await page.getByRole("button", { name: "Support", exact: true }).click();
  await expect(classBtn(page, "Kleryk")).toBeVisible();
  await expect(classBtn(page, "Barbarzyńca")).not.toBeVisible();
});

test("filtr Wszystkie przywraca 12 klas", async ({ page }) => {
  await page.getByRole("button", { name: "Support", exact: true }).click();
  await page.getByRole("button", { name: "Wszystkie", exact: true }).click();
  const buttons = page.locator("button").filter({
    hasText: /Barbarzyńca|Bard|Kleryk|Druid|Wojownik|Mnich|Paladyn|Łowca|Łotrzyk|Czarownik|Warlock|Czarodziej/,
  });
  await expect(buttons).toHaveCount(12);
});

test("przycisk Dalej zablokowany gdy brak wybranej klasy", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("kliknięcie klasy pokazuje panel szczegółów", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await expect(page.getByText("Boskie Naczynie")).toBeVisible();
  await expect(page.getByText("k8 HD")).toBeVisible();
});

test("panel Kleryk pokazuje subklasy domen", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await expect(page.getByRole("button", { name: /Domena Życia/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Domena Światła/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Domena Wojny/ })).toBeVisible();
});

test("wybór subklasy zaznacza ją", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await page.getByRole("button", { name: /Domena Wiedzy/ }).click();
  await expect(page.getByText("Dostęp do tajemnej wiedzy i umysłów innych")).toBeVisible();
});

test("wybór umiejętności do limitu — Kleryk ma 2", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  await page.getByRole("button", { name: /Historia/ }).click();
  await expect(page.getByText("UMIEJĘTNOŚCI (2/2)")).toBeVisible();
});

test("trzecia umiejętność jest zablokowana po wypełnieniu limitu", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  await page.getByRole("button", { name: /Historia/ }).click();
  const medycynaBtn = page.getByRole("button", { name: /Medycyna/ });
  await expect(medycynaBtn).toBeDisabled();
});

test("odznaczenie umiejętności zwalnia slot", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  await page.getByRole("button", { name: /Historia/ }).click();
  // Odznacz pierwszą
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  // Teraz Medycyna powinna być dostępna
  const medycynaBtn = page.getByRole("button", { name: /Medycyna/ });
  await expect(medycynaBtn).toBeEnabled();
});

test("Dalej aktywny po wyborze klasy + subklasy + umiejętności", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  // Subklasa wybrana automatycznie (pierwsza), wybieramy 2 umiejętności
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  await page.getByRole("button", { name: /Historia/ }).click();
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("Dalej nawiguje do kroku Cechy", async ({ page }) => {
  await classBtn(page, "Kleryk").click();
  await page.getByRole("button", { name: /Wnikliwość/ }).click();
  await page.getByRole("button", { name: /Historia/ }).click();
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator\/cechy/);
});

test("Wróć nawiguje do kroku Rasa", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/rasa/);
});
