import { test, expect } from "@playwright/test";

test("wejście na dashboard bez sesji przekierowuje na logowanie", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/logowanie/);
});

test("wejście na kreator bez sesji przekierowuje na logowanie", async ({ page }) => {
  await page.goto("/kreator/koncept");
  await expect(page).toHaveURL(/\/logowanie/);
});
