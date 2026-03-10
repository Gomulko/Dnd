import { test, expect } from "@playwright/test";
import { loginAs, TEST_USER } from "../helpers";

test("poprawne logowanie przekierowuje na dashboard", async ({ page }) => {
  await loginAs(page);
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Moje Postacie" })).toBeVisible();
});

test("błędne hasło pokazuje komunikat błędu", async ({ page }) => {
  await page.goto("/logowanie");
  await page.locator('input[name="email"]').fill(TEST_USER.email);
  await page.locator('input[name="password"]').fill("ZleHaslo123!");
  await page.getByRole("button", { name: /wkrocz/i }).click();
  await expect(page.getByText(/nieprawidłowy/i)).toBeVisible();
});

test("pusty formularz nie pozwala na wysłanie", async ({ page }) => {
  await page.goto("/logowanie");
  await page.getByRole("button", { name: /wkrocz/i }).click();
  // input[required] blokuje submit natywnie — zostajemy na stronie
  await expect(page).toHaveURL(/\/logowanie/);
});
