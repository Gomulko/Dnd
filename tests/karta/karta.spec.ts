/**
 * Faza 7 — Karta Postaci (/karta/[id])
 * Testy używają seed character: seed-char-kleryk (Aldric Swietlisty, Kleryk poz.3)
 * Login: test@kroniki.pl / Test1234!
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

const KARTA_URL = "/karta/seed-char-kleryk";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await page.goto(KARTA_URL);
});

// ── Auth guard ──────────────────────────────────────────────────────────────

test("niezalogowany użytkownik jest przekierowany na logowanie", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto(KARTA_URL);
  await expect(page).toHaveURL(/\/logowanie/);
});

// ── Header — podstawowe dane ────────────────────────────────────────────────

test("imię postaci jest widoczne w nagłówku", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Aldric Swietlisty" })).toBeVisible();
});

test("rasa i klasa są widoczne w nagłówku", async ({ page }) => {
  await expect(page.getByText(/Człowiek.*Kleryk/)).toBeVisible();
});

test("poziom postaci jest widoczny", async ({ page }) => {
  await expect(page.getByText(/Poziom 3/)).toBeVisible();
});

test("avatar wyświetla inicjały AL", async ({ page }) => {
  await expect(page.getByLabel("Avatar postaci")).toBeVisible();
  await expect(page.getByLabel("Avatar postaci")).toContainText("AL");
});

// ── Quick stats ─────────────────────────────────────────────────────────────

test("KP (Klasa Pancerza) jest widoczna", async ({ page }) => {
  // AC = 10 + DEX mod, DEX=10 → mod=0, AC=10
  await expect(page.getByLabel("Klasa Pancerza")).toBeVisible();
  await expect(page.getByLabel("Klasa Pancerza")).toContainText("10");
});

test("inicjatywa jest widoczna", async ({ page }) => {
  await expect(page.getByLabel("Inicjatywa")).toBeVisible();
});

test("bonus biegłości jest widoczny", async ({ page }) => {
  // Level 3 → PB = +2
  await expect(page.getByLabel("Bonus biegłości")).toBeVisible();
  await expect(page.getByLabel("Bonus biegłości")).toContainText("+2");
});

// ── Cechy (ability scores) ──────────────────────────────────────────────────

test("cechy postaci są widoczne", async ({ page }) => {
  // Aldric: STR 14, DEX 10, CON 15, INT 12, WIS 17, CHA 13
  await expect(page.getByLabel("Siła: 14")).toBeVisible();
  await expect(page.getByLabel("Mądrość: 17")).toBeVisible();
  await expect(page.getByLabel("Kondycja: 15")).toBeVisible();
});

test("modyfikatory cech są poprawne dla Mądrości 17", async ({ page }) => {
  // WIS 17 → mod +3
  const wisCard = page.getByLabel("Mądrość: 17");
  await expect(wisCard).toContainText("+3");
});

// ── Rzuty obronne ───────────────────────────────────────────────────────────

test("sekcja rzutów obronnych jest widoczna", async ({ page }) => {
  await expect(page.getByText("Rzuty Obronne")).toBeVisible();
});

// ── Umiejętności ────────────────────────────────────────────────────────────

test("sekcja umiejętności jest widoczna", async ({ page }) => {
  await expect(page.getByText("Umiejętności")).toBeVisible();
});

test("biegłe umiejętności kleryka są widoczne (Medycyna, Religia, Perswazja)", async ({ page }) => {
  // Aldric has: medicine, religion, insight, persuasion
  await expect(page.getByText("Medycyna")).toBeVisible();
  await expect(page.getByText("Religia")).toBeVisible();
  await expect(page.getByText("Perswazja")).toBeVisible();
});

test("Wnikliwość jest widoczna w umiejętnościach", async ({ page }) => {
  // Wnikliwość appears twice (skill label + elsewhere), use first
  await expect(page.getByText("Wnikliwość").first()).toBeVisible();
});

// ── HP ──────────────────────────────────────────────────────────────────────

test("sekcja HP jest widoczna z przyciskami", async ({ page }) => {
  await expect(page.getByText("Punkty Trafienia")).toBeVisible();
  await expect(page.getByLabel("Zmniejsz HP")).toBeVisible();
  await expect(page.getByLabel("Zwiększ HP")).toBeVisible();
});

test("aktualne HP postaci jest widoczne jako liczba", async ({ page }) => {
  // currentHp is a number displayed in the HP panel
  const hpEl = page.getByTestId("current-hp");
  await expect(hpEl).toBeVisible();
  const text = await hpEl.textContent();
  expect(Number(text)).not.toBeNaN();
});

test("kliknięcie Zmniejsz HP zmniejsza wartość o 1", async ({ page }) => {
  const hpEl = page.getByTestId("current-hp");
  const initialHp = Number(await hpEl.textContent());
  await page.getByLabel("Zmniejsz HP").click();
  await expect(hpEl).toContainText(String(initialHp - 1));
});

test("kliknięcie Zwiększ HP zwiększa wartość o 1", async ({ page }) => {
  const hpEl = page.getByTestId("current-hp");
  // First decrease to make room for increase
  await page.getByLabel("Zmniejsz HP").click();
  const decreasedHp = Number(await hpEl.textContent());
  await page.getByLabel("Zwiększ HP").click();
  await expect(hpEl).toContainText(String(decreasedHp + 1));
});

// ── Kość Trafień i Rzuty Śmierci ────────────────────────────────────────────

test("kość trafień kleryka to k8", async ({ page }) => {
  await expect(page.getByText("k8")).toBeVisible();
});

test("sekcja rzutów śmierci jest widoczna", async ({ page }) => {
  await expect(page.getByText("Rzuty Śmierci")).toBeVisible();
  await expect(page.getByText("Sukcesy")).toBeVisible();
  await expect(page.getByText("Porażki")).toBeVisible();
});

// ── Ekwipunek ────────────────────────────────────────────────────────────────

test("ekwipunek postaci jest widoczny", async ({ page }) => {
  await expect(page.getByText("Ekwipunek")).toBeVisible();
  await expect(page.getByText("Kolczuga")).toBeVisible();
  await expect(page.getByText("Tarcza", { exact: true })).toBeVisible();
  await expect(page.getByText("Buzdygan")).toBeVisible();
});

test("złoto postaci jest widoczne", async ({ page }) => {
  // gold = 45
  await expect(page.getByText("45 sz. złota")).toBeVisible();
});

// ── Osobowość ────────────────────────────────────────────────────────────────

test("cechy osobowości postaci są widoczne", async ({ page }) => {
  await expect(page.getByText("Osobowość")).toBeVisible();
  await expect(page.getByText(/Zawsze pomagam rannym/)).toBeVisible();
});

test("ideały postaci są widoczne", async ({ page }) => {
  await expect(page.getByText(/Życie każdej istoty jest święte/)).toBeVisible();
});

// ── Magia ────────────────────────────────────────────────────────────────────

test("sekcja magia jest widoczna dla kleryka", async ({ page }) => {
  await expect(page.getByText("Magia")).toBeVisible();
});

test("sztuczki kleryka są widoczne", async ({ page }) => {
  // Cantrips: sacred-flame → "Płomień Sakralny", guidance → "Wskazówki"
  await expect(page.getByText("Sztuczki (k0)")).toBeVisible();
  await expect(page.getByText("Płomień Sakralny")).toBeVisible();
  await expect(page.getByText("Wskazówki")).toBeVisible();
});

test("zaklęcia poz.1 kleryka są widoczne", async ({ page }) => {
  // Spells: bless → "Błogosławieństwo", cure-wounds → "Leczenie Ran"
  await expect(page.getByText("Zaklęcia poz.1")).toBeVisible();
  await expect(page.getByText("Błogosławieństwo")).toBeVisible();
  await expect(page.getByText("Leczenie Ran")).toBeVisible();
});

// ── Notatki sesji ─────────────────────────────────────────────────────────────

test("notatki sesji — textarea jest widoczna", async ({ page }) => {
  await expect(page.getByLabel("Notatki sesji")).toBeVisible();
});

test("edycja notatek sesji wyzwala autosave z potwierdzeniem", async ({ page }) => {
  const textarea = page.getByLabel("Notatki sesji");
  await textarea.click();
  await textarea.pressSequentially(" test");
  // After ~1s debounce + save, should show "✓ Zapisano"
  await expect(page.getByText("✓ Zapisano")).toBeVisible({ timeout: 6000 });
});

// ── Historia ─────────────────────────────────────────────────────────────────

test("historia (description) postaci jest widoczna", async ({ page }) => {
  // "Historia" also appears as a skill name, so use first()
  await expect(page.getByText("Historia").first()).toBeVisible();
  await expect(page.getByText(/Dawny żołnierz/)).toBeVisible();
});
