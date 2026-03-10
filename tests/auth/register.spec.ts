import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Unikalny email per uruchomienie (unikamy kolizji między testami)
const uniqueEmail = () => `test_${Date.now()}@playwright.pl`;

async function fillForm(
  page: Page,
  opts: { name?: string; email?: string; password?: string; confirm?: string }
) {
  if (opts.name !== undefined)
    await page.locator('input[name="name"]').fill(opts.name);
  if (opts.email !== undefined)
    await page.locator('input[name="email"]').fill(opts.email);
  if (opts.password !== undefined)
    await page.locator('input[name="password"]').fill(opts.password);
  if (opts.confirm !== undefined)
    await page.locator('input[name="confirmPassword"]').fill(opts.confirm);
}

test("poprawna rejestracja przekierowuje na logowanie", async ({ page }) => {
  await page.goto("/rejestracja");
  await fillForm(page, {
    name: "Nowy Gracz",
    email: uniqueEmail(),
    password: "Test1234!",
    confirm: "Test1234!",
  });
  await page.getByRole("button", { name: /rozpocznij/i }).click();
  await expect(page).toHaveURL(/\/logowanie/);
});

test("zajęty email pokazuje komunikat błędu", async ({ page }) => {
  await page.goto("/rejestracja");
  await fillForm(page, {
    name: "Duplikat",
    email: "test@kroniki.pl", // konto z seeda
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
    name: "Gracz",
    email: uniqueEmail(),
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
    name: "Gracz",
    email: uniqueEmail(),
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
