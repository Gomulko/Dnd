import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test("dashboard pokazuje sidebar z linkami nawigacji", async ({ page }) => {
  await loginAs(page);
  const sidebar = page.locator("aside").first();
  await expect(sidebar.getByRole("link", { name: /Moje Postacie/ })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /Stwórz Postać/ })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /Rzutnik Kości/ })).toBeVisible();
});

test("dashboard pokazuje karty postaci z seeda", async ({ page }) => {
  await loginAs(page);
  await expect(page.getByText("Aldric Swietlisty", { exact: true })).toBeVisible();
  await expect(page.getByText("Mira Cienioszeptka", { exact: true })).toBeVisible();
});

test("dashboard pokazuje sekcję szybkich akcji", async ({ page }) => {
  await loginAs(page);
  await expect(page.getByRole("heading", { name: "Szybkie Akcje" })).toBeVisible();
  await expect(page.getByText("Rzutnik Kości").first()).toBeVisible();
});

test("przycisk Nowa Postać prowadzi do kreatora", async ({ page }) => {
  await loginAs(page);
  await page.locator('a[href="/kreator"]').first().click();
  await expect(page).toHaveURL(/\/kreator/);
});
