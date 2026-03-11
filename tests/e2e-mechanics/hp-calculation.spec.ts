import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

/**
 * BLOK 5.1 — E2E: Weryfikacja kalkulacji HP
 * Źródło zasad: SRD 5.2.1 rules/rules.txt
 *
 * HP na poziomie 1 = hit die (max) + KON modyfikator
 * Kolejne poziomy: +floor(hitDie/2)+1+conMod każdy
 */

async function createAndOpenCharacter(
  page: Page,
  name: string,
  cls: string,
  constitution: number,
  subclass: string = "life"
): Promise<void> {
  await loginAs(page);
  await page.goto("/kreator/koncept");

  await page.evaluate(
    ({ name, cls, constitution, subclass }) => {
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
          step3: { class: cls, subclass, skills: ["insight", "history"] },
          step4: {
            method: "standard",
            strength: 10,
            dexterity: 10,
            constitution,
            intelligence: 10,
            wisdom: 15,
            charisma: 10,
          },
          step5: {
            background: "acolyte",
            personalityTraits: ["pt1"],
            ideals: ["i1"],
            bonds: ["b1"],
            flaws: ["f1"],
            languages: [],
            backstory: "",
          },
          step6: { equipment: [], gold: 0 },
          step7: { cantrips: ["guidance", "sacred-flame"], spells: ["bless"] },
        },
        version: 0,
      };
      sessionStorage.setItem("wizard-character", JSON.stringify(data));
    },
    { name, cls, constitution, subclass }
  );

  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Postać/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  // Wejdź na kartę nowo utworzonej postaci
  const charLink = page.getByText(name).first();
  await expect(charLink).toBeVisible({ timeout: 5000 });
  await page.getByRole("link", { name: /Graj/i }).first().click();
  await page.waitForURL("**/karta/**", { timeout: 10000 });
}

// Kleryk (d8), KON 13 (+1), poziom 1 → HP = 8 + 1 = 9
test("HP: Kleryk (d8), KON 13 (+1), poziom 1 → 9 (SRD)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestHP-Kleryk-d8-KON13", "cleric", 13, "life");
  await expect(page.getByTestId("current-hp")).toHaveText("9");
});

// Wojownik (d10), KON 16 (+3), poziom 1 → HP = 10 + 3 = 13
test("HP: Wojownik (d10), KON 16 (+3), poziom 1 → 13 (SRD)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestHP-Wojownik-d10-KON16", "fighter", 16, "champion");
  await expect(page.getByTestId("current-hp")).toHaveText("13");
});

// Czarodziej (d6), KON 10 (+0), poziom 1 → HP = 6 + 0 = 6
test("HP: Czarodziej (d6), KON 10 (+0), poziom 1 → 6 (SRD)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestHP-Czarodziej-d6-KON10", "wizard", 10, "evocation");
  await expect(page.getByTestId("current-hp")).toHaveText("6");
});

// Barbarzyńca (d12), KON 16 (+3), poziom 1 → HP = 12 + 3 = 15
test("HP: Barbarzyńca (d12), KON 16 (+3), poziom 1 → 15 (SRD)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestHP-Barb-d12-KON16", "barbarian", 16, "berserker");
  await expect(page.getByTestId("current-hp")).toHaveText("15");
});

// Kleryk (d8), KON 8 (-1), poziom 1 → HP = max(1, 8 - 1) = 7
test("HP: Kleryk (d8), KON 8 (-1), poziom 1 → 7 (minimum 1 per SRD)", async ({ page }) => {
  await createAndOpenCharacter(page, "TestHP-Kleryk-d8-KON8", "cleric", 8, "life");
  await expect(page.getByTestId("current-hp")).toHaveText("7");
});
