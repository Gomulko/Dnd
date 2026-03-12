import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

// Helper: załaduj stan wizarda przez sessionStorage (bez przechodzenia przez formularze)
async function setWizardState(page: import("@playwright/test").Page, state: Record<string, unknown>) {
  await page.evaluate((s) => {
    const existing = JSON.parse(sessionStorage.getItem("wizard-character") ?? "{}");
    sessionStorage.setItem("wizard-character", JSON.stringify({ ...existing, state: { ...existing.state, ...s } }));
  }, state);
  await page.reload();
}

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  // Wyczyść stan wizarda przed każdym testem
  await page.goto("/kreator/koncept");
  await page.evaluate(() => sessionStorage.removeItem("wizard-character"));
  await page.reload();
});

// ── Blok 1: Widoczność podstawowa ─────────────────────────────────────────────

test("podgląd postaci jest zawsze widoczny na stronie kreatora", async ({ page }) => {
  await expect(page.getByTestId("character-preview")).toBeVisible();
});

test("podgląd pokazuje placeholder inicjałów gdy brak imienia", async ({ page }) => {
  await expect(page.getByTestId("preview-initials")).toHaveText("?");
});

test("podgląd pokazuje placeholder imienia gdy brak imienia", async ({ page }) => {
  await expect(page.getByTestId("preview-name")).toHaveText("Imię postaci");
});

// ── Blok 2: Dynamiczne aktualizacje Konceptu ──────────────────────────────────

test("inicjały aktualizują się na żywo przy wpisywaniu imienia", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Aldric Świetlisty");
  await expect(page.getByTestId("preview-initials")).toHaveText("AŚ");
});

test("imię pojawia się w podglądzie po wpisaniu", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Mira Zła");
  await expect(page.getByTestId("preview-name")).toHaveText("Mira Zła");
});

test("inicjały z jednego słowa to pierwsze dwie litery", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Gandalf");
  await expect(page.getByTestId("preview-initials")).toHaveText("G");
});

test("sekcja Koncept pokazuje płeć", async ({ page }) => {
  await page.getByRole("button", { name: /kobieta/i }).click();
  await expect(page.getByTestId("character-preview")).toContainText("Kobieta");
});

test("sekcja Koncept pokazuje wiek gdy podany", async ({ page }) => {
  await page.locator('input[type="number"]').first().fill("25");
  await expect(page.getByTestId("character-preview")).toContainText("25 lat");
});

test("sekcja Koncept pokazuje wzrost gdy podany", async ({ page }) => {
  await page.locator('input[type="number"]').nth(1).fill("180");
  await expect(page.getByTestId("character-preview")).toContainText("180 cm");
});

// ── Blok 3: Rasa i Klasa ──────────────────────────────────────────────────────

test("podgląd pokazuje rasę po jej wyborze w kroku 2", async ({ page }) => {
  await page.locator('input[placeholder*="Aldric"]').fill("Tester");
  await page.getByRole("button", { name: /dalej/i }).click();
  await page.waitForURL(/\/kreator\/rasa/);

  // Klikamy pierwszą rasę (Człowiek)
  await page.getByRole("button", { name: /człowiek/i }).first().click();

  await expect(page.getByTestId("preview-race-class")).toContainText("Człowiek");
});

test("podgląd pokazuje klasę po jej wyborze w kroku 3", async ({ page }) => {
  // Ustaw sessionStorage z rasą i przejdź do kroku klasy
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "", subclass: null, skills: [] },
        step4: { method: "standard", strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        step5: { background: "", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/klasa");

  await page.getByRole("button", { name: /wojownik/i }).first().click();

  await expect(page.getByTestId("preview-race-class")).toContainText("Wojownik");
  await expect(page.getByTestId("preview-race-class")).toContainText("Człowiek");
});

// ── Blok 4: Statystyki bojowe (krok 4) ───────────────────────────────────────

test("sekcja walki NIE jest widoczna gdy cechy nie są uzupełnione", async ({ page }) => {
  await expect(page.getByTestId("preview-combat")).not.toBeVisible();
});

test("sekcja walki pojawia się po uzupełnieniu cech", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/cechy");

  await expect(page.getByTestId("preview-combat")).toBeVisible();
});

test("HP w podglądzie jest poprawnie wyliczone (k10 Wojownik + KON mod)", async ({ page }) => {
  // Wojownik k10, KON=13 → mod=+1, HP = 10+1 = 11
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/cechy");

  await expect(page.getByTestId("preview-hp")).toHaveText("11");
});

test("KP w podglądzie jest poprawnie wyliczone (10 + DEX mod)", async ({ page }) => {
  // DEX=14 → mod=+2, AC = 12
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/cechy");

  await expect(page.getByTestId("preview-ac")).toHaveText("12");
});

test("siatka 6 statystyk pojawia się po uzupełnieniu cech", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/cechy");

  await expect(page.getByTestId("preview-stats")).toBeVisible();
  await expect(page.getByTestId("preview-stat-sił")).toContainText("15");
  await expect(page.getByTestId("preview-stat-zrr")).toContainText("14");
});

// ── Blok 5: Tło ───────────────────────────────────────────────────────────────

test("sekcja Tło NIE jest widoczna przed wyborem tła", async ({ page }) => {
  await expect(page.getByTestId("preview-background")).not.toBeVisible();
});

test("sekcja Tło pojawia się po wyborze tła", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "acolyte", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/tlo");

  await expect(page.getByTestId("preview-background")).toBeVisible();
  await expect(page.getByTestId("preview-background-name")).toHaveText("Akolita");
});

// ── Blok 6: Ekwipunek ─────────────────────────────────────────────────────────

test("sekcja Ekwipunek pojawia się gdy są przedmioty", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: { method: "standard", strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
        step5: { background: "acolyte", personalityTraits: ["p1", "p2"], ideals: ["i1"], bonds: ["b1"], flaws: ["f1"], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [{ name: "Miecz", qty: 1, weight: 1 }, { name: "Tarcza", qty: 1, weight: 2 }], gold: 0 },
        step7: { cantrips: [], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  // Używamy kroku gotowe — EkwipunekForm nie nadpisuje stanu
  await page.goto("/kreator/gotowe");

  await expect(page.getByTestId("preview-equipment")).toBeVisible();
  await expect(page.getByTestId("preview-equipment")).toContainText("2 szt.");
});

// ── Blok 7: Magia ─────────────────────────────────────────────────────────────

test("sekcja Magia NIE jest widoczna bez zaklęć", async ({ page }) => {
  await expect(page.getByTestId("preview-magic")).not.toBeVisible();
});

test("sekcja Magia pojawia się po wyborze cantrypów", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "wizard", subclass: "abjurer", skills: ["arcana", "history"] },
        step4: { method: "standard", strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 },
        step5: { background: "acolyte", personalityTraits: ["p1", "p2"], ideals: ["i1"], bonds: ["b1"], flaws: ["f1"], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: ["fire-bolt", "mage-hand", "prestidigitation"], spells: [] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/magia");

  await expect(page.getByTestId("preview-magic")).toBeVisible();
  await expect(page.getByTestId("preview-cantrips")).toHaveText("3");
});

test("liczba zaklęć w podglądzie aktualizuje się po wyborze", async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("wizard-character", JSON.stringify({
      state: {
        step1: { name: "Tester", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "human", subrace: null },
        step3: { class: "wizard", subclass: "abjurer", skills: ["arcana", "history"] },
        step4: { method: "standard", strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 },
        step5: { background: "acolyte", personalityTraits: ["p1", "p2"], ideals: ["i1"], bonds: ["b1"], flaws: ["f1"], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: ["fire-bolt", "mage-hand", "prestidigitation"], spells: ["magic-missile", "shield", "thunderwave", "charm-person", "detect-magic", "sleep"] },
        editingId: null,
      },
      version: 0,
    }));
  });
  await page.goto("/kreator/magia");

  await expect(page.getByTestId("preview-cantrips")).toHaveText("3");
  await expect(page.getByTestId("preview-spells")).toHaveText("6");
});
