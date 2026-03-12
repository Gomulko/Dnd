import type { Page } from "@playwright/test";

export const TEST_USER = {
  username: "tester",
  password: "Test1234!",
  name: "tester",
};

export async function loginAs(page: Page, username = TEST_USER.username, password = TEST_USER.password) {
  await page.goto("/logowanie");
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /wkrocz/i }).click();
  await page.waitForURL("**/dashboard");
}
