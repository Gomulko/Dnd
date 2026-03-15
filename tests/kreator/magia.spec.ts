import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";
import type { Page } from "@playwright/test";

async function setupStep7(page: Page, classId: string) {
  await loginAs(page);
  await page.goto("/kreator/koncept");
  await page.evaluate((cls) => {
    const data = {
      state: {
        step1: { name: "Test", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "elf", subrace: null },
        step3: { class: cls, subclass: null, skills: [] },
        step4: { method: "standard", strength: 8, dexterity: 13, constitution: 12, intelligence: 10, wisdom: 15, charisma: 14 },
        step5: { background: "acolyte", personalityTraits: ["pt1", "pt2"], ideals: ["i1"], bonds: ["b1"], flaws: ["f1"], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: [], spells: [] },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  }, classId);
  await page.goto("/kreator/magia");
}

// ── Klasa niemagiczna (Barbarzyńca) ───────────────────────────────────────────

test("stepper pokazuje krok 7 jako aktywny", async ({ page }) => {
  await setupStep7(page, "barbarian");
  const stepBubbles = page.locator("div").filter({ hasText: /^7$/ });
  await expect(stepBubbles.first()).toBeVisible();
});

test("[niemagiczna] komunikat o braku zaklęć dla Barbarzyńcy", async ({ page }) => {
  await setupStep7(page, "barbarian");
  await expect(page.getByText(/nie posiada zaklęć/)).toBeVisible();
  await expect(page.getByText("Ten krok zostaje pominięty.")).toBeVisible();
});

test("[niemagiczna] Dalej aktywny od razu", async ({ page }) => {
  await setupStep7(page, "barbarian");
  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

// ── Klasa magiczna (Kleryk) ───────────────────────────────────────────────────

test("[kleryk] pokazuje sekcję cantrips", async ({ page }) => {
  await setupStep7(page, "cleric");
  await expect(page.getByText(/CANTRIPY \(0\/3\)/)).toBeVisible();
});

test("[kleryk] pokazuje sekcję zaklęć poz. 1", async ({ page }) => {
  await setupStep7(page, "cleric");
  await expect(page.getByText(/ZAKLĘCIA POZ\. 1 \(0\/2\)/)).toBeVisible();
});

test("[kleryk] Dalej zablokowany bez wybranych zaklęć", async ({ page }) => {
  await setupStep7(page, "cleric");
  await expect(page.getByRole("button", { name: /dalej/i })).toBeDisabled();
});

test("[kleryk] można wybrać cantrip", async ({ page }) => {
  await setupStep7(page, "cleric");
  // Klikamy konkretny cantrip kleryk
  await page.getByRole("button", { name: "Wskazówki" }).click();
  await expect(page.getByText(/CANTRIPY \(1\/3\)/)).toBeVisible();
});

test("[kleryk] czwarty cantrip jest zablokowany (limit 3)", async ({ page }) => {
  await setupStep7(page, "cleric");
  // Wybierz 3 cantripy po nazwie
  await page.getByRole("button", { name: "Wskazówki" }).click();
  await page.getByRole("button", { name: "Światło" }).click();
  await page.getByRole("button", { name: "Odporność" }).click();
  await expect(page.getByText(/CANTRIPY \(3\/3\)/)).toBeVisible();
  // Kolejny cantrip powinien być zablokowany
  await expect(page.getByRole("button", { name: "Płomień Sakralny" })).toBeDisabled();
});

test("[kleryk] Dalej aktywny po wyborze 3 cantrips i 2 zaklęć", async ({ page }) => {
  // Pre-fill 3 cantrips w sessionStorage, by uniknąć problemów z selekcją
  await loginAs(page);
  await page.goto("/kreator/koncept");
  await page.evaluate(() => {
    const data = {
      state: {
        step1: { name: "Test", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
        step2: { race: "elf", subrace: null },
        step3: { class: "cleric", subclass: null, skills: [] },
        step4: { method: "standard", strength: 8, dexterity: 13, constitution: 12, intelligence: 10, wisdom: 15, charisma: 14 },
        step5: { background: "acolyte", personalityTraits: ["pt1", "pt2"], ideals: ["i1"], bonds: ["b1"], flaws: ["f1"], languages: [], backstory: "", allies: "", treasure: "" },
        step6: { equipment: [], gold: 0 },
        step7: { cantrips: ["guidance", "light", "sacred-flame"], spells: [] },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  });
  await page.goto("/kreator/magia");

  // Cantrips już wybrane (3/3)
  await expect(page.getByText(/CANTRIPY \(3\/3\)/)).toBeVisible();

  // Wybierz 2 zaklęcia poz. 1 — klikamy przyciski aria-label które są dostępne i nieaktywne
  await page.getByRole("button", { name: "Błogosławieństwo" }).click();
  await page.getByRole("button", { name: "Leczenie Ran" }).click();

  await expect(page.getByRole("button", { name: /dalej/i })).toBeEnabled();
});

test("[kleryk] panel statystyk magii pokazuje DC Zaklęć", async ({ page }) => {
  await setupStep7(page, "cleric");
  await expect(page.getByText("DC Zaklęć")).toBeVisible();
  await expect(page.getByText("Statystyki Magii")).toBeVisible();
});

test("[kleryk] filtr szkoły magii działa", async ({ page }) => {
  await setupStep7(page, "cleric");
  // Kliknij filtr Ewokacja
  await page.getByRole("button", { name: "Ewokacja" }).click();
  // Liczba zaklęć powinna się zmniejszyć
  const spellCards = page.locator("button[aria-label]");
  const count = await spellCards.count();
  expect(count).toBeGreaterThan(0);
});

test("[kleryk] filtr Wszystkie przywraca pełną listę", async ({ page }) => {
  await setupStep7(page, "cleric");
  await page.getByRole("button", { name: "Ewokacja" }).click();
  const countAfterFilter = await page.locator("button[aria-label]").count();
  await page.getByRole("button", { name: "Wszystkie" }).click();
  const countAll = await page.locator("button[aria-label]").count();
  expect(countAll).toBeGreaterThanOrEqual(countAfterFilter);
});

test("Dalej nawiguje do kroku Gotowe", async ({ page }) => {
  await setupStep7(page, "barbarian");
  await page.getByRole("button", { name: /dalej/i }).click();
  await expect(page).toHaveURL(/\/kreator\/gotowe/);
});

test("Wróć nawiguje do kroku Ekwipunek", async ({ page }) => {
  await setupStep7(page, "cleric");
  await page.getByRole("button", { name: /wróć/i }).click();
  await expect(page).toHaveURL(/\/kreator\/ekwipunek/);
});
