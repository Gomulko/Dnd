import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/kreator-goscia/tlo");
});

function bgBtn(page: Page, name: string) {
  return page.locator("button").filter({ hasText: name }).first();
}

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await expect(page.getByText(/TRYB GOŚCIA/i)).toBeVisible();
});

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

test("sekcja cech charakteru pokazuje opcje po wyborze tła", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await expect(page.getByText("CECHY CHARAKTERU (0/2)")).toBeVisible();
});

test("można wybrać 2 cechy charakteru", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await expect(page.getByText("CECHY CHARAKTERU (2/2)")).toBeVisible();
});

test("trzecia cecha jest zablokowana po wyborze 2", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await expect(page.getByText("Mogę znaleźć wspólny język")).toBeDisabled();
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

test("Dalej aktywny po pełnym wyborze tła Akolity", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await page.getByText("Jestem tolerancyjny").click();
  await page.getByText("Wiara. Ufam").click();
  await page.getByText("Poświęcę wszystko").click();
  await page.getByText("Jestem nieprzejednany").click();
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
  await page.getByRole("button", { name: "Elficki" }).click();
  await page.getByRole("button", { name: "Krasnoludzki" }).click();
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/ekwipunek/);
});

test("Wróć nawiguje do kroku Cechy", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/cechy/);
});

test("zmiana tła resetuje wybrane cechy", async ({ page }) => {
  await bgBtn(page, "Akolita").click();
  await page.getByText("Wielbię pewne bóstwo").click();
  await bgBtn(page, "Żołnierz").click();
  await expect(page.getByText("CECHY CHARAKTERU (0/2)")).toBeVisible();
});
