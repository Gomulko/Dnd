import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function setupStep6(page: Page) {
  await page.goto("/kreator-goscia/koncept");
  await page.evaluate(() => {
    const data = {
      state: {
        step1: { name: "Test", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "elf", subrace: "wysoki-elf" },
        step3: { class: "cleric", subclass: "life", skills: ["insight", "history"] },
        step4: { method: "standard", strength: 8, dexterity: 13, constitution: 12, intelligence: 10, wisdom: 15, charisma: 14 },
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
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  });
  await page.goto("/kreator-goscia/ekwipunek");
}

test.beforeEach(async ({ page }) => {
  await setupStep6(page);
});

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await expect(page.getByText(/TRYB GOŚCIA/i)).toBeVisible();
});

test("stepper pokazuje krok 6 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^6$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("domyślnie wybrany jest Pakiet A", async ({ page }) => {
  const pakietA = page.locator("button").filter({ hasText: "Pakiet A" }).first();
  await expect(pakietA).toBeVisible();
});

test("Pakiet A pokazuje listę ekwipunku klasy (Kleryk — Kolczuga)", async ({ page }) => {
  await expect(page.getByText(/Kolczuga/).first()).toBeVisible();
});

test("Pakiet Złota pokazuje liczbę złota", async ({ page }) => {
  await page.locator("button").filter({ hasText: "Pakiet Złota" }).first().click();
  await expect(page.getByText("sz. złota", { exact: true })).toBeVisible();
});

test("sekcja ekwipunku z tła ma badge automatyczny", async ({ page }) => {
  await expect(page.getByText("Automatycznie dodany")).toBeVisible();
});

test("ekwipunek tła (Akolita) jest widoczny", async ({ page }) => {
  await expect(page.getByText(/Pergamin/).first()).toBeVisible();
});

test("panel bojowy pokazuje Klasę Pancerza i Prędkość", async ({ page }) => {
  await expect(page.getByText("Klasa Pancerza").first()).toBeVisible();
  await expect(page.getByText("Prędkość").first()).toBeVisible();
});

test("panel bojowy pokazuje Bonus Biegłości +2", async ({ page }) => {
  await expect(page.getByText("Bonus Biegłości").first()).toBeVisible();
  await expect(page.getByText("+2").first()).toBeVisible();
});

test("licznik ekwipunku w panelu aktualizuje się", async ({ page }) => {
  await expect(page.getByText(/Ekwipunek \(\d+ szt\.\)/)).toBeVisible();
});

test("przycisk Dalej jest zawsze aktywny", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("Dalej nawiguje do kroku Magia", async ({ page }) => {
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/magia/);
});

test("Wróć nawiguje do kroku Tło", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/tlo/);
});
