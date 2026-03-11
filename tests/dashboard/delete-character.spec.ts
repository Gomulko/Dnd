import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

const DELETE_CHARACTER_NAME = "Postać Do Usunięcia";

async function createCharacterForDeletion(page: Page) {
  await loginAs(page);
  await page.goto("/kreator/koncept");
  await page.evaluate((name) => {
    const data = {
      state: {
        step1: { name, gender: "mezczyzna", age: 25, height: 180, description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "intimidation"] },
        step4: { method: "standard", strength: 15, dexterity: 13, constitution: 14, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "soldier", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "" },
        step6: { equipment: [{ name: "Miecz długi", qty: 1, weight: 0 }], gold: 10 },
        step7: { cantrips: [], spells: [] },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  }, DELETE_CHARACTER_NAME);
  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Postać/ }).click();
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  await expect(page.getByText(DELETE_CHARACTER_NAME).first()).toBeVisible();
}

test("menu '···' otwiera dropdown z opcją usunięcia", async ({ page }) => {
  await createCharacterForDeletion(page);
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: DELETE_CHARACTER_NAME });
  await card.getByTestId("menu-btn").click();
  await expect(card.getByTestId("menu-dropdown")).toBeVisible();
  await expect(card.getByTestId("delete-btn")).toBeVisible();
});

test("kliknięcie Anuluj zamyka dialog bez usunięcia", async ({ page }) => {
  await loginAs(page);
  await page.goto("/dashboard");
  await expect(page.getByText(DELETE_CHARACTER_NAME).first()).toBeVisible();
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: DELETE_CHARACTER_NAME });
  await card.getByTestId("menu-btn").click();
  await card.getByTestId("delete-btn").click();
  await expect(page.getByTestId("confirm-dialog")).toBeVisible();
  await page.getByTestId("cancel-delete").click();
  await expect(page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="character-card"]').filter({ hasText: DELETE_CHARACTER_NAME })).toBeVisible();
});

test("potwierdzenie usunięcia usuwa postać z dashboardu", async ({ page }) => {
  await loginAs(page);
  await page.goto("/dashboard");
  await expect(page.getByText(DELETE_CHARACTER_NAME).first()).toBeVisible();
  const card = page.locator('[data-testid="character-card"]').filter({ hasText: DELETE_CHARACTER_NAME });
  await card.getByTestId("menu-btn").click();
  await card.getByTestId("delete-btn").click();
  await expect(page.getByTestId("confirm-dialog")).toBeVisible();
  await page.getByTestId("confirm-delete").click();
  await expect(page.locator('[data-testid="character-card"]').filter({ hasText: DELETE_CHARACTER_NAME })).not.toBeVisible({ timeout: 8000 });
});
