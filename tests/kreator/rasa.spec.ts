import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { loginAs } from "../helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  // Czyści wizard store między testami
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/kreator/rasa");
});

// Pomocnik: kliknij rasę po nazwie (button zawiera emoji + nazwę + hint)
function raceBtn(page: Page, name: string) {
  return page.locator("button").filter({ hasText: name }).first();
}

test("stepper pokazuje krok 2 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^2$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("grid pokazuje wszystkie 11 ras", async ({ page }) => {
  // Liczymy przyciski tylko w lewej kolumnie (grid ras, nie panel szczegółów)
  const grid = page.locator("div").filter({ has: page.locator("button").filter({ hasText: "Człowiek" }) }).first();
  const raceButtons = grid.locator("button").filter({
    hasText: /Człowiek|Krasnolud|Elf|Niziołek|Gnom|Dragonborn|Tiefling|Goliath|Ork|Półelf|Półork/,
  });
  await expect(raceButtons).toHaveCount(11);
});

test("przycisk Dalej zablokowany gdy brak wybranej rasy", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("kliknięcie rasy zaznacza ją i pokazuje panel szczegółów", async ({ page }) => {
  await raceBtn(page, "Elf").click();
  await expect(page.getByText("Gracka i wiekuista rasa lasów i magii")).toBeVisible();
  await expect(page.locator("span").filter({ hasText: "+2 ZRR" }).first()).toBeVisible();
});

test("wybór Elfa pokazuje podrasy", async ({ page }) => {
  await raceBtn(page, "Elf").click();
  await expect(page.getByRole("button", { name: "Wysoki Elf" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Leśny Elf" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Drow" })).toBeVisible();
});

test("wybór podrasy aktualizuje panel cech", async ({ page }) => {
  await raceBtn(page, "Elf").click();
  await page.getByRole("button", { name: "Wysoki Elf" }).click();
  await expect(page.getByText(/Linia Elfów — Wysoki/).first()).toBeVisible();

  await page.getByRole("button", { name: "Drow" }).click();
  await expect(page.getByText(/Linia Elfów — Drow/).first()).toBeVisible();
});

test("rasy bez podras nie pokazują sekcji Podrasa", async ({ page }) => {
  await raceBtn(page, "Człowiek").click();
  await expect(page.getByText("PODRASA")).not.toBeVisible();
});

test("wyszukiwarka filtruje rasy", async ({ page }) => {
  await page.locator('input[placeholder*="Szukaj"]').fill("kras");
  await expect(page.locator("button").filter({ hasText: "Krasnolud" })).toBeVisible();
  await expect(page.locator("button").filter({ hasText: "Człowiek" })).not.toBeVisible();
});

test("wyczyszczenie wyszukiwarki przywraca wszystkie rasy", async ({ page }) => {
  await page.locator('input[placeholder*="Szukaj"]').fill("kras");
  await page.locator('input[placeholder*="Szukaj"]').clear();
  await expect(page.locator("button").filter({ hasText: "Człowiek" })).toBeVisible();
  await expect(page.locator("button").filter({ hasText: "Tiefling" })).toBeVisible();
});

test("przycisk Dalej aktywny po wyborze rasy", async ({ page }) => {
  await raceBtn(page, "Człowiek").click();
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("Dalej nawiguje do kroku Klasa", async ({ page }) => {
  await raceBtn(page, "Człowiek").click();
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator\/klasa/);
});

test("Wróć nawiguje do kroku Koncept", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/koncept/);
});
