import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const WIZARD_STORAGE_KEY = "wizard-character";

async function injectWizardState(page: Page) {
  await page.evaluate((key) => {
    const data = {
      state: {
        step1: { name: "Goscinnaia", gender: "kobieta", age: 25, height: 165, weight: 60, eyeColor: "niebieskie", skinColor: "jasna", hairColor: "blond", description: "Elf ze wschodu", alignment: "NG" },
        step2: { race: "elf", subrace: "high-elf" },
        step3: { class: "wizard", subclass: null, skills: ["arcana", "history"] },
        step4: { method: "standard", strength: 8, dexterity: 14, constitution: 12, intelligence: 15, wisdom: 13, charisma: 10 },
        step5: { background: "sage", personalityTraits: ["sage-pt1", "sage-pt2"], ideals: ["sage-i1"], bonds: ["sage-b1"], flaws: ["sage-f1"], languages: [], backstory: "Uczony z wieloletnim doświadczeniem", allies: "", treasure: "" },
        step6: { equipment: [{ name: "Spellbook", qty: 1, weight: 3 }], gold: 10 },
        step7: { cantrips: ["fire-bolt", "mage-hand", "prestidigitation"], spells: ["magic-missile", "shield", "mage-armor", "charm-person", "sleep", "thunderwave"] },
        editingId: null,
      },
      version: 0,
    };
    sessionStorage.setItem(key, JSON.stringify(data));
  }, WIZARD_STORAGE_KEY);
}

test("strona logowania zawiera przycisk Stwórz postać bez konta", async ({ page }) => {
  await page.goto("/logowanie");
  await expect(page.getByRole("link", { name: /Stwórz postać bez konta/i })).toBeVisible();
});

test("kliknięcie otwiera /kreator-goscia/koncept", async ({ page }) => {
  await page.goto("/logowanie");
  await page.getByRole("link", { name: /Stwórz postać bez konta/i }).click();
  await expect(page).toHaveURL(/\/kreator-goscia\/koncept/);
});

test("baner TRYB GOŚCIA jest widoczny", async ({ page }) => {
  await page.goto("/kreator-goscia/koncept");
  await expect(page.getByText(/TRYB GOŚCIA/i)).toBeVisible();
});

test("kreator gościa: stepper na kroku 1 (koncept)", async ({ page }) => {
  await page.goto("/kreator-goscia/koncept");
  // Sprawdź że stepper pokazuje 8 kroków (sprawdzamy labels w stepperze)
  await expect(page.locator(".stepper-label").filter({ hasText: "Koncept" }).first()).toBeVisible();
  await expect(page.locator(".stepper-label").filter({ hasText: "Gotowe" }).first()).toBeVisible();
});

test("strona gotowe gościa nie ma przycisku Zapisz Postać i Graj", async ({ page }) => {
  await page.goto("/kreator-goscia/gotowe");
  await injectWizardState(page);
  await page.reload();
  // GuestGotoweForm nie ma przycisku "Zapisz Postać i Graj →" (tego z normalnego kreatora)
  await expect(page.getByRole("button", { name: "Zapisz Postać i Graj →" })).not.toBeVisible();
});

test("strona gotowe gościa ma przycisk Eksportuj PDF", async ({ page }) => {
  await page.goto("/kreator-goscia/gotowe");
  await injectWizardState(page);
  await page.reload();
  await expect(page.getByRole("button", { name: /Eksportuj PDF/i })).toBeVisible();
});

test("strona gotowe gościa ma przycisk Zarejestruj się i zapisz postać", async ({ page }) => {
  await page.goto("/kreator-goscia/gotowe");
  await injectWizardState(page);
  await page.reload();
  await expect(page.getByRole("button", { name: /Zarejestruj się i zapisz postać/i })).toBeVisible();
});

test("Eksportuj PDF zwraca plik PDF (POST /api/export-pdf/guest)", async ({ page }) => {
  const payload = {
    step1: { name: "Goscinnaia", gender: "kobieta", age: 25, height: 165, weight: 60, eyeColor: "niebieskie", skinColor: "jasna", hairColor: "blond", description: "Elf ze wschodu", alignment: "NG" },
    step2: { race: "elf", subrace: "high-elf" },
    step3: { class: "wizard", subclass: null, skills: ["arcana", "history"] },
    step4: { method: "standard", strength: 8, dexterity: 14, constitution: 12, intelligence: 15, wisdom: 13, charisma: 10 },
    step5: { background: "sage", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
    step6: { equipment: [], gold: 10 },
    step7: { cantrips: ["fire-bolt", "mage-hand", "prestidigitation"], spells: ["magic-missile", "shield"] },
  };

  const res = await page.request.post("/api/export-pdf/guest", {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});

test("Zarejestruj się ustawia localStorage i przekierowuje na /rejestracja", async ({ page }) => {
  await page.goto("/kreator-goscia/gotowe");
  await injectWizardState(page);
  await page.reload();

  await page.getByRole("button", { name: /Zarejestruj się i zapisz postać/i }).click();
  await expect(page).toHaveURL(/\/rejestracja/);

  const stored = await page.evaluate(() => localStorage.getItem("guest-wizard-character"));
  expect(stored).toBeTruthy();
  const parsed = JSON.parse(stored!);
  expect(parsed.step1.name).toBe("Goscinnaia");
});
