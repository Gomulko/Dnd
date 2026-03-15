import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function setupStep8(page: Page) {
  await page.goto("/kreator-goscia/koncept");
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
  await page.goto("/kreator-goscia/gotowe");
}

test.beforeEach(async ({ page }) => {
  await setupStep8(page);
});

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await expect(page.getByText(/TRYB GOŚCIA/i).first()).toBeVisible();
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
  await expect(page.getByText("SIŁ").first()).toBeVisible();
  await expect(page.getByText("ZRR").first()).toBeVisible();
  await expect(page.getByText("KON", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("INT", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("MĄD").first()).toBeVisible();
  await expect(page.getByText("CHA", { exact: true }).first()).toBeVisible();
});

test("sekcja Tło pokazuje wybrane tło", async ({ page }) => {
  await expect(page.getByText("Akolita").first()).toBeVisible();
});

test("historia postaci jest widoczna", async ({ page }) => {
  await expect(page.getByText("Dawny sługa świątyni szukający odkupienia.")).toBeVisible();
});

test("QuickStats: Max HP, KP, Inicjatywa, Prędkość są widoczne", async ({ page }) => {
  await expect(page.getByText("Max HP").first()).toBeVisible();
  await expect(page.getByText("KP", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Inicjatywa").first()).toBeVisible();
  await expect(page.getByText("Prędkość").first()).toBeVisible();
});

// ── Przyciski specyficzne dla trybu gościa ───────────────────────────────────

test("NIE ma przycisku Zapisz Postać i Graj", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Zapisz Postać i Graj →" })).not.toBeVisible();
});

test("przycisk Eksportuj PDF jest widoczny i aktywny", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Eksportuj PDF/i })).toBeEnabled();
});

test("przycisk Zarejestruj się i zapisz postać jest widoczny", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Zarejestruj się i zapisz postać/i })).toBeVisible();
});

test("Zarejestruj się przekierowuje na /rejestracja", async ({ page }) => {
  await page.getByRole("button", { name: /Zarejestruj się i zapisz postać/i }).click();
  await expect(page).toHaveURL(/\/rejestracja/);
});

test("Zarejestruj się zapisuje stan w localStorage", async ({ page }) => {
  await page.getByRole("button", { name: /Zarejestruj się i zapisz postać/i }).click();
  const stored = await page.evaluate(() => localStorage.getItem("guest-wizard-character"));
  expect(stored).toBeTruthy();
  const parsed = JSON.parse(stored!);
  expect(parsed.step1.name).toBe("Araniel Świetlisty");
});

test("przycisk Edytuj nawiguje do odpowiedniego kroku gościa", async ({ page }) => {
  const editButtons = page.getByRole("button", { name: "Edytuj →" });
  await editButtons.first().click();
  await expect(page).toHaveURL(/\/kreator-goscia\//);
});

test("Wróć nawiguje do kroku Magia", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/magia/);
});
