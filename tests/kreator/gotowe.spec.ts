import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

async function setupStep8(page: Page) {
  await loginAs(page);
  await page.goto("/kreator/koncept");
  await page.evaluate(() => {
    const data = {
      state: {
        step1: {
          name: "Araniel Świetlisty",
          gender: "mezczyzna",
          age: 130,
          height: 175,
          weight: null,
          eyeColor: "",
          skinColor: "",
          hairColor: "",
          description: "Dawny sługa świątyni szukający odkupienia.",
          alignment: "LG",
        },
        step2: { race: "elf", subrace: "wysoki-elf" },
        step3: { class: "cleric", subclass: "life", skills: ["insight", "history"] },
        step4: {
          method: "standard",
          strength: 8, dexterity: 13, constitution: 12,
          intelligence: 10, wisdom: 15, charisma: 14,
        },
        step5: {
          background: "acolyte",
          personalityTraits: ["pt1", "pt2"],
          ideals: ["i1"],
          bonds: ["b1"],
          flaws: ["f1"],
          languages: [],
          backstory: "",
          allies: "",
          treasure: "",
        },
        step6: {
          equipment: [
            { name: "Kolczuga", qty: 1, weight: 0 },
            { name: "Tarcza", qty: 1, weight: 0 },
          ],
          gold: 0,
        },
        step7: {
          cantrips: ["guidance", "light", "sacred-flame"],
          spells: ["bless", "cure-wounds"],
        },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  });
  await page.goto("/kreator/gotowe");
}

test.beforeEach(async ({ page }) => {
  await setupStep8(page);
});

test("stepper pokazuje krok 8 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^8$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("badge KREATOR UKOŃCZONY jest widoczny", async ({ page }) => {
  await expect(page.getByText("✓ KREATOR UKOŃCZONY")).toBeVisible();
});

test("imię postaci jest widoczne w hero", async ({ page }) => {
  await expect(page.getByText("Araniel Świetlisty").first()).toBeVisible();
});

test("rasa i klasa są widoczne pod imieniem", async ({ page }) => {
  await expect(page.getByText(/Elf.*Kleryk/).first()).toBeVisible();
});

test("sekcja Koncept pokazuje dane kroku 1", async ({ page }) => {
  await expect(page.getByText("Praworządny Dobry")).toBeVisible();
  await expect(page.getByText("Mężczyzna").first()).toBeVisible();
});

test("sekcja Rasa pokazuje wybraną rasę", async ({ page }) => {
  await expect(page.getByText("Elf").first()).toBeVisible();
});

test("sekcja Klasa pokazuje wybraną klasę i podklasę", async ({ page }) => {
  await expect(page.getByText("Kleryk").first()).toBeVisible();
  await expect(page.getByText("Domena Życia", { exact: true })).toBeVisible();
});

test("sekcja Wartości Cech pokazuje 6 statystyk", async ({ page }) => {
  await expect(page.getByText("SIŁ")).toBeVisible();
  await expect(page.getByText("ZRR")).toBeVisible();
  await expect(page.getByText("KON", { exact: true })).toBeVisible();
  await expect(page.getByText("INT", { exact: true })).toBeVisible();
  await expect(page.getByText("MĄD")).toBeVisible();
  await expect(page.getByText("CHA", { exact: true })).toBeVisible();
});

test("sekcja Tło pokazuje wybrane tło", async ({ page }) => {
  await expect(page.getByText("Akolita").first()).toBeVisible();
});

test("historia postaci jest widoczna", async ({ page }) => {
  await expect(page.getByText("Dawny sługa świątyni szukający odkupienia.")).toBeVisible();
});

test("QuickStats: Max HP, KP, Inicjatywa, Prędkość są widoczne", async ({ page }) => {
  await expect(page.getByText("Max HP")).toBeVisible();
  await expect(page.getByText("KP", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Inicjatywa")).toBeVisible();
  await expect(page.getByText("Prędkość").first()).toBeVisible();
});

test("przycisk Edytuj w sekcji nawiguje do kroku", async ({ page }) => {
  const editButtons = page.getByRole("button", { name: "Edytuj →" });
  await editButtons.first().click();
  await expect(page).toHaveURL(/\/kreator\//);
});

test("przycisk Zapisz Postać jest widoczny i aktywny", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Zapisz Postać/ })).toBeEnabled();
});

test("Zapisz Postać zapisuje i przekierowuje na dashboard", async ({ page }) => {
  await page.getByRole("button", { name: /Zapisz Postać/ }).click();
  // Powinno przekierować na /dashboard po zapisie
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
});

test("po zapisie postać pojawia się na dashboardzie", async ({ page }) => {
  await page.getByRole("button", { name: /Zapisz Postać/ }).click();
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  await expect(page.getByText("Araniel Świetlisty").first()).toBeVisible();
});

test("Wróć nawiguje do kroku Magia", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/magia/);
});
