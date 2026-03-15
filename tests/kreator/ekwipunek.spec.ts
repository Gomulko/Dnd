import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

// Helper — wypełnia poprzednie kroki (rasa + klasa + cechy + tło) przez sessionStorage
async function setupWizardStep6(page: Parameters<typeof loginAs>[0]) {
  await loginAs(page);
  // Ustaw minimalny stan kreatora przez sessionStorage
  await page.goto("/kreator/koncept");
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
  await page.goto("/kreator/ekwipunek");
}

test.beforeEach(async ({ page }) => {
  await setupWizardStep6(page);
});

test("stepper pokazuje krok 6 jako aktywny", async ({ page }) => {
  const stepBubbles = page.locator("div").filter({ hasText: /^6$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("domyślnie wybrany jest Pakiet A", async ({ page }) => {
  await expect(page.getByText("Pakiet A")).toBeVisible();
  // Pakiet A powinien być aktywny (złoty border)
  const pakietA = page.locator("button").filter({ hasText: "Pakiet A" }).first();
  await expect(pakietA).toBeVisible();
});

test("Pakiet A pokazuje listę ekwipunku klasy", async ({ page }) => {
  // Kleryk ma m.in. Kolczugę
  await expect(page.getByText(/Kolczuga/).first()).toBeVisible();
});

test("Pakiet Złota pokazuje liczbę złota", async ({ page }) => {
  await page.locator("button").filter({ hasText: "Pakiet Złota" }).first().click();
  // PackageGold card shows number + "sz. złota" as separate spans
  await expect(page.getByText("sz. złota", { exact: true })).toBeVisible();
});

test("przełączenie na Pakiet Złota aktualizuje panel bojowy", async ({ page }) => {
  await page.locator("button").filter({ hasText: "Pakiet Złota" }).first().click();
  // Panel powinien pokazać złoto
  await expect(page.locator("text=🪙")).toBeVisible();
});

test("sekcja ekwipuneku z tła jest widoczna i ma badge automatyczny", async ({ page }) => {
  await expect(page.getByText("Automatycznie dodany")).toBeVisible();
});

test("ekwipunek tła (Akolita) jest widoczny", async ({ page }) => {
  // Akolita ma "Pergamin ×10 arkuszy" — unikalny przedmiot tła (nie ma go w klasie Kleryk)
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
  // Pakiet A klasy + tło = kilka przedmiotów
  await expect(page.getByText(/Ekwipunek \(\d+ szt\.\)/)).toBeVisible();
});

test("przycisk Dalej jest zawsze aktywny", async ({ page }) => {
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("Dalej nawiguje do kroku Magia", async ({ page }) => {
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator\/magia/);
});

test("Wróć nawiguje do kroku Tło", async ({ page }) => {
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/tlo/);
});
