import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

/**
 * BLOK 5.2 — E2E: Weryfikacja AC i Inicjatywy
 * Źródło zasad: SRD 5.2.1 rules/rules.txt
 *
 * AC bez zbroi = 10 + DEX modyfikator
 * Inicjatywa   = DEX modyfikator
 */

async function createAndOpenCharacter(
  page: Page,
  name: string,
  dexterity: number
): Promise<void> {
  await loginAs(page);
  await page.goto("/kreator/koncept");

  await page.evaluate(
    ({ name, dexterity }) => {
      const data = {
        state: {
          step1: {
            name,
            gender: "mezczyzna",
            age: null,
            height: null,
            description: "",
            alignment: "TN",
          },
          step2: { race: "human", subrace: null },
          step3: { class: "fighter", subclass: "champion", skills: ["athletics", "intimidation"] },
          step4: {
            method: "standard",
            strength: 15,
            dexterity,
            constitution: 13,
            intelligence: 10,
            wisdom: 12,
            charisma: 8,
          },
          step5: {
            background: "soldier",
            personalityTraits: ["pt1"],
            ideals: ["i1"],
            bonds: ["b1"],
            flaws: ["f1"],
            languages: [],
            backstory: "",
          },
          step6: { equipment: [], gold: 0 },
          step7: { cantrips: [], spells: [] },
        },
        version: 0,
      };
      sessionStorage.setItem("wizard-character", JSON.stringify(data));
    },
    { name, dexterity }
  );

  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Postać/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  const charLink = page.getByText(name).first();
  await expect(charLink).toBeVisible({ timeout: 5000 });
  await page.getByRole("link", { name: /Graj/i }).first().click();
  await page.waitForURL("**/karta/**", { timeout: 10000 });
}

// DEX 16 (+3) → AC = 10 + 3 = 13, Inicjatywa = +3
test("AC: DEX 16 (+3) → AC = 13 (SRD: 10 + DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestAC-DEX16", 16);
  const acBox = page.locator('[aria-label="Klasa Pancerza"]');
  await expect(acBox).toContainText("13");
});

test("Inicjatywa: DEX 16 (+3) → +3 (SRD: DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestInit-DEX16", 16);
  const initBox = page.locator('[aria-label="Inicjatywa"]');
  await expect(initBox).toContainText("+3");
});

// DEX 10 (+0) → AC = 10 + 0 = 10, Inicjatywa = +0
test("AC: DEX 10 (+0) → AC = 10 (SRD: 10 + DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestAC-DEX10", 10);
  const acBox = page.locator('[aria-label="Klasa Pancerza"]');
  await expect(acBox).toContainText("10");
});

test("Inicjatywa: DEX 10 (+0) → 0 (SRD: DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestInit-DEX10", 10);
  const initBox = page.locator('[aria-label="Inicjatywa"]');
  await expect(initBox).toContainText("0");
});

// DEX 8 (-1) → AC = 10 + (-1) = 9, Inicjatywa = -1
test("AC: DEX 8 (-1) → AC = 9 (SRD: 10 + DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestAC-DEX8", 8);
  const acBox = page.locator('[aria-label="Klasa Pancerza"]');
  await expect(acBox).toContainText("9");
});

test("Inicjatywa: DEX 8 (-1) → -1 (SRD: DEX mod)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestInit-DEX8", 8);
  const initBox = page.locator('[aria-label="Inicjatywa"]');
  await expect(initBox).toContainText("-1");
});
