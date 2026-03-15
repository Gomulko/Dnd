import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { loginAs } from "../helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/kreator/tlo");
});

function bgBtn(page: Page, name: string) {
  return page.locator("button").filter({ hasText: name }).first();
}

test("stepper pokazuje krok 5 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^5$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("grid pokazuje wszystkie 12 teł", async ({ page }) => {
  const buttons = page.locator("button").filter({
    hasText: /Akolita|Kryminalista|Uczony|Żołnierz|Ludowy Bohater|Szlachcic|Wędrowiec|Oszust|Artysta|Rzemieślnik|Pustelnik|Marynarz/,
  });
  await expect(buttons).toHaveCount(12);
});

test("przycisk Dalej zablokowany gdy brak wybranego tła", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("kliknięcie tła pokazuje panel szczegółów", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await expect(page.getByText("Schronienie Wiernych")).toBeVisible();
  await expect(page.locator("span").filter({ hasText: /^Wnikliwość$/ }).first()).toBeVisible();
});

test("panel pokazuje źródło SRD dla Akolity", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await expect(page.locator("span").filter({ hasText: /^SRD$/ })).toBeVisible();
});

test("panel pokazuje cechę specjalną tła", async ({ page }) => {
  await bgBtn(page, "Żołnierz").click();
  await expect(page.getByText("✦ Stopień Wojskowy")).toBeVisible();
});

test("wyszukiwarka filtruje tła", async ({ page }) => {
  await page.locator("input[placeholder='Szukaj tła...']").fill("Uczony");
  await expect(bgBtn(page, "Uczony")).toBeVisible();
  await expect(bgBtn(page, "Akolita")).not.toBeVisible();
});

test("wyczyszczenie wyszukiwarki przywraca wszystkie tła", async ({ page }) => {
  const input = page.locator("input[placeholder='Szukaj tła...']");
  await input.fill("Uczony");
  await input.fill("");
  const buttons = page.locator("button").filter({
    hasText: /Akolita|Kryminalista|Uczony|Żołnierz|Ludowy Bohater|Szlachcic|Wędrowiec|Oszust|Artysta|Rzemieślnik|Pustelnik|Marynarz/,
  });
  await expect(buttons).toHaveCount(12);
});

// ── Cechy charakteru ──────────────────────────────────────────────────────────

test("sekcja cech charakteru pokazuje opcje po wyborze tła", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await expect(page.getByText("CECHY CHARAKTERU (0/2)")).toBeVisible();
});

test("można wybrać 2 cechy charakteru", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  const traits = page.getByText(/Wielbię pewne bóstwo|Jestem tolerancyjny/);
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await expect(page.getByText("CECHY CHARAKTERU (2/2)")).toBeVisible();
  void traits; // suppress unused warning
});

test("trzecia cecha jest zablokowana po wyborze 2", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  const thirdTrait = page.getByText("Mogę znaleźć wspólny język");
  await expect(thirdTrait).toBeDisabled();
});

test("można wybrać ideał", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wiara. Ufam").click();
  await expect(page.getByText("IDEAŁ (1/1)")).toBeVisible();
});

test("można wybrać więź", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Poświęcę wszystko").click();
  await expect(page.getByText("WIĘŹ (1/1)")).toBeVisible();
});

test("można wybrać wadę", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Jestem nieprzejednany").click();
  await expect(page.getByText("WADA (1/1)")).toBeVisible();
});

test("Dalej aktywny po wyborze tła + 2 cech + ideału + więzi + wady", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await page.getByText("Wiara. Ufam").click();
  await page.getByText("Poświęcę wszystko").click();
  await page.getByText("Jestem nieprzejednany").click();
  // Akolita wymaga 2 języków do wyboru
  await page.getByRole("button", { name: "Elficki" }).click();
  await page.getByRole("button", { name: "Krasnoludzki" }).click();
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("Dalej nawiguje do Ekwipunku po kompletnym wyborze", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await page.getByText("Wiara. Ufam").click();
  await page.getByText("Poświęcę wszystko").click();
  await page.getByText("Jestem nieprzejednany").click();
  // Akolita wymaga 2 języków do wyboru
  await page.getByRole("button", { name: "Elficki" }).click();
  await page.getByRole("button", { name: "Krasnoludzki" }).click();
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator\/ekwipunek/);
});

test("Wróć nawiguje do kroku Cechy", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/cechy/);
});

test("zmiana tła resetuje wybrane cechy", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  // Zmień tło na Żołnierz
  await bgBtn(page, "Żołnierz").click();
  await expect(page.getByText("CECHY CHARAKTERU (0/2)")).toBeVisible();
});
