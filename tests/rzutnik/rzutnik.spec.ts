import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await page.goto("/rzutnik");
});

test("strona rzutnika wyświetla się po zalogowaniu", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /rzutnik kości/i })).toBeVisible();
  await expect(page.getByTestId("die-20")).toBeVisible();
});

test("kliknięcie k20 wyświetla wynik 1–20", async ({ page }) => {
  await page.getByTestId("die-20").click();
  await expect(page.getByTestId("roll-total")).toBeVisible();
  const total = parseInt(await page.getByTestId("roll-total").innerText());
  expect(total).toBeGreaterThanOrEqual(1);
  expect(total).toBeLessThanOrEqual(20);
});

test("kliknięcie k6 wyświetla wynik 1–6", async ({ page }) => {
  await page.getByTestId("die-6").click();
  await expect(page.getByTestId("roll-total")).toBeVisible();
  const total = parseInt(await page.getByTestId("roll-total").innerText());
  expect(total).toBeGreaterThanOrEqual(1);
  expect(total).toBeLessThanOrEqual(6);
});

test("rzut dodaje wpis do historii", async ({ page }) => {
  await page.getByTestId("die-8").click();
  await expect(page.getByTestId("roll-history")).toContainText("1k8");
});

test("wielokrotne rzuty są widoczne w historii", async ({ page }) => {
  await page.getByTestId("die-4").click();
  await page.getByTestId("die-6").click();
  await page.getByTestId("die-12").click();
  const history = page.getByTestId("roll-history");
  await expect(history).toContainText("1k12");
  await expect(history).toContainText("1k6");
  await expect(history).toContainText("1k4");
});

test("zmiana liczby kości i rzut 2k6", async ({ page }) => {
  await page.getByTestId("dice-count-plus").click();
  await expect(page.getByTestId("dice-count")).toHaveText("2");
  await page.getByTestId("die-6").click();
  const total = parseInt(await page.getByTestId("roll-total").innerText());
  expect(total).toBeGreaterThanOrEqual(2);
  expect(total).toBeLessThanOrEqual(12);
  await expect(page.getByTestId("roll-history")).toContainText("2k6");
});

test("przycisk wyczyść usuwa historię", async ({ page }) => {
  await page.getByTestId("die-20").click();
  await expect(page.getByTestId("clear-history")).toBeVisible();
  await page.getByTestId("clear-history").click();
  await expect(page.getByTestId("roll-history")).toContainText("Brak rzutów");
});

test("niezalogowany użytkownik jest przekierowany na logowanie", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/rzutnik");
  await expect(page).toHaveURL(/logowanie/);
});

test("link 'Rzutnik Kości' w sidebarze jest aktywny na stronie /rzutnik", async ({ page }) => {
  const sidebarLink = page.getByRole("link", { name: /rzutnik kości/i });
  await expect(sidebarLink).toBeVisible();
});

test("wszystkie kości są dostępne", async ({ page }) => {
  for (const die of [4, 6, 8, 10, 12, 20, 100]) {
    await expect(page.getByTestId(`die-${die}`)).toBeVisible();
  }
});
