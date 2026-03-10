import type { Page } from "@playwright/test";

export const TEST_USER = {
  email: "test@kroniki.pl",
  password: "Test1234!",
  name: "Tester",
};

export async function loginAs(page: Page, email = TEST_USER.email, password = TEST_USER.password) {
  await page.goto("/logowanie");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /wkrocz/i }).click();
  await page.waitForURL("**/dashboard");
}
