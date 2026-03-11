import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

/**
 * BLOK 5.3 — E2E: Weryfikacja Spell Save DC i Spell Attack Bonus
 * Źródło zasad: SRD 5.2.1 rules/rules.txt
 *
 * Spell Save DC      = 8 + spellcasting ability mod + Proficiency Bonus
 * Spell Attack Bonus = spellcasting ability mod + Proficiency Bonus
 *
 * Poziom 1 → Proficiency Bonus = +2
 * Klasa rzutująca cechą:
 *   Kleryk  → MĄD (wisdom)
 *   Czarodziej → INT (intelligence)
 *   Czarownik  → CHA (charisma)
 *   Bard       → CHA (charisma)
 */

async function createAndOpenSpellcaster(
  page: Page,
  name: string,
  cls: string,
  subclass: string,
  stats: { wis?: number; int?: number; cha?: number }
): Promise<void> {
  await loginAs(page);
  await page.goto("/kreator/koncept");

  await page.evaluate(
    ({ name, cls, subclass, stats }) => {
      const data = {
        state: {
          step1: {
            name,
            gender: "kobieta",
            age: null,
            height: null,
            description: "",
            alignment: "NG",
          },
          step2: { race: "human", subrace: null },
          step3: { class: cls, subclass, skills: ["insight", "history"] },
          step4: {
            method: "standard",
            strength: 8,
            dexterity: 13,
            constitution: 12,
            intelligence: stats.int ?? 10,
            wisdom: stats.wis ?? 10,
            charisma: stats.cha ?? 10,
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
          step7: {
            cantrips: cls === "cleric" ? ["guidance", "sacred-flame"] : cls === "wizard" ? ["fire-bolt", "mage-hand"] : ["vicious-mockery", "minor-illusion"],
            spells: cls === "cleric" ? ["bless"] : cls === "wizard" ? ["magic-missile"] : ["healing-word"],
          },
        },
        version: 0,
      };
      sessionStorage.setItem("wizard-character", JSON.stringify(data));
    },
    { name, cls, subclass, stats }
  );

  await page.goto("/kreator/gotowe");
  await page.getByRole("button", { name: /Zapisz Postać/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  const charLink = page.getByText(name).first();
  await expect(charLink).toBeVisible({ timeout: 5000 });
  await page.getByRole("link", { name: /Graj/i }).first().click();
  await page.waitForURL("**/karta/**", { timeout: 10000 });
}

// Kleryk, MĄD 17 (+3), poziom 1 (PB +2)
// DC = 8 + 3 + 2 = 13, Atak = 3 + 2 = +5
test("SpellDC: Kleryk MĄD 17 (+3), poziom 1 → DC = 13 (SRD)", async ({ page }) => {
  await createAndOpenSpellcaster(page, "TestDC-Kleryk-MAD17", "cleric", "life", { wis: 17 });

  // "ST Czarów" label — wartość jest w pierwszym child diva rodzica
  const stLabel = page.getByText("ST Czarów");
  await expect(stLabel).toBeVisible();
  const stValue = stLabel.locator("xpath=..").locator("div").first();
  await expect(stValue).toContainText("13");
});

test("SpellAttack: Kleryk MĄD 17 (+3), poziom 1 → Atak = +5 (SRD)", async ({ page }) => {
  await createAndOpenSpellcaster(page, "TestSA-Kleryk-MAD17", "cleric", "life", { wis: 17 });

  const atkLabel = page.getByText("Atak", { exact: true }).first();
  await expect(atkLabel).toBeVisible();
  const atkValue = atkLabel.locator("xpath=..").locator("div").first();
  await expect(atkValue).toContainText("+5");
});

// Czarodziej, INT 20 (+5), poziom 1 (PB +2)
// DC = 8 + 5 + 2 = 15, Atak = 5 + 2 = +7
test("SpellDC: Czarodziej INT 20 (+5), poziom 1 → DC = 15 (SRD)", async ({ page }) => {
  await createAndOpenSpellcaster(page, "TestDC-Czarodziej-INT20", "wizard", "evocation", { int: 20 });

  const stLabel = page.getByText("ST Czarów");
  await expect(stLabel).toBeVisible();
  const stValue = stLabel.locator("xpath=..").locator("div").first();
  await expect(stValue).toContainText("15");
});

test("SpellAttack: Czarodziej INT 20 (+5), poziom 1 → Atak = +7 (SRD)", async ({ page }) => {
  await createAndOpenSpellcaster(page, "TestSA-Czarodziej-INT20", "wizard", "evocation", { int: 20 });

  const atkLabel = page.getByText("Atak", { exact: true }).first();
  await expect(atkLabel).toBeVisible();
  const atkValue = atkLabel.locator("xpath=..").locator("div").first();
  await expect(atkValue).toContainText("+7");
});

// Czarownik (Warlock), CHA 14 (+2), poziom 1 (PB +2)
// DC = 8 + 2 + 2 = 12, Atak = 2 + 2 = +4
test("SpellDC: Warlock CHA 14 (+2), poziom 1 → DC = 12 (SRD)", async ({ page }) => {
  await createAndOpenSpellcaster(page, "TestDC-Warlock-CHA14", "warlock", "fiend", { cha: 14 });

  const stLabel = page.getByText("ST Czarów");
  await expect(stLabel).toBeVisible();
  const stValue = stLabel.locator("xpath=..").locator("div").first();
  await expect(stValue).toContainText("12");
});
