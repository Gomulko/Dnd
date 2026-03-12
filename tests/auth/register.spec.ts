import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Unikalny username per uruchomienie (unikamy kolizji między testami)
const uniqueUsername = () => `gracz_${Date.now()}`;

async function fillForm(
  page: Page,
  opts: { username?: string; password?: string; confirm?: string }
) {
  if (opts.username !== undefined)
    await page.locator('input[name="username"]').fill(opts.username);
  if (opts.password !== undefined)
    await page.locator('input[name="password"]').fill(opts.password);
  if (opts.confirm !== undefined)
    await page.locator('input[name="confirmPassword"]').fill(opts.confirm);
}

test("poprawna rejestracja przekierowuje na logowanie", async ({ page }) => {
  await page.goto("/rejestracja");
  await fillForm(page, {
    username: uniqueUsername(),
    password: "Test1234!",
    confirm: "Test1234!",
  });
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page).toHaveURL(/\/logowanie/);
});

test("zajęta nazwa użytkownika pokazuje komunikat błędu", async ({ page }) => {
  await page.goto("/rejestracja");
  await fillForm(page, {
    username: "tester", // konto z seeda
    password: "Test1234!",
    confirm: "Test1234!",
  });
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page.getByText(/już istnieje/i)).toBeVisible();
});

test("niezaakceptowany regulamin blokuje rejestrację", async ({ page }) => {
  await page.goto("/rejestracja");
  // Odznacz regulamin (domyślnie jest zaznaczony)
  await page.getByText("Akceptuję").click();
  await fillForm(page, {
    username: uniqueUsername(),
    password: "Test1234!",
    confirm: "Test1234!",
  });
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page.getByText("Musisz zaakceptować regulamin")).toBeVisible();
  await expect(page).toHaveURL(/\/rejestracja/);
});

test("niezgodne hasła pokazują błąd walidacji", async ({ page }) => {
  await page.goto("/rejestracja");
  await fillForm(page, {
    username: uniqueUsername(),
    password: "Test1234!",
    confirm: "InneHaslo!",
  });
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page.getByText(/hasła/i)).toBeVisible();
  await expect(page).toHaveURL(/\/rejestracja/);
});

test("pusty formularz nie przechodzi walidacji HTML", async ({ page }) => {
  await page.goto("/rejestracja");
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page).toHaveURL(/\/rejestracja/);
});
