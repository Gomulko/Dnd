/**
 * Testy nowych pól kreatora postaci:
 * - KonceptForm: waga, kolor oczu, skóry, włosów
 * - TloForm: historia postaci, sojusznicy
 * - EkwipunekForm: majątek/skarby
 * - Integracja: pełny kreator → zapis → PDF
 */

import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { loginAs } from "../helpers";

// Neon (free tier) może spać — pierwszy login może trwać do 90s
// Ustawiamy globalny timeout dla tego pliku
test.use({ actionTimeout: 90000 });

// ── Helper: wstrzyknij kompletny stan kreatora przez sessionStorage ────────────

async function injectWizardState(page: Page) {
  await page.evaluate(() => {
    const data = {
      state: {
        step1: {
          name: "Ragnvald Zelazny",
          gender: "mezczyzna",
          age: 34,
          height: 182,
          weight: 95,
          eyeColor: "Szare",
          skinColor: "Blada",
          hairColor: "Rude",
          description: "Zahartowany wojownik z polnocy.",
          alignment: "TN",
        },
        step2: { race: "human", subrace: null },
        step3: { class: "fighter", subclass: "champion", skills: ["athletics", "perception"] },
        step4: {
          method: "standard",
          strength: 16, dexterity: 12, constitution: 15,
          intelligence: 8, wisdom: 10, charisma: 11,
        },
        step5: {
          background: "soldier",
          personalityTraits: ["pt1", "pt2"],
          ideals: ["i1"],
          bonds: ["b1"],
          flaws: ["f1"],
          languages: [],
          backstory: "Sluzyl w Legionie Zelaznej Korony przez 12 lat.",
          allies: "Legion Zelaznej Korony, Kapitan Halvard",
          treasure: "Zloty medalion z herbem Legionu",
        },
        step6: {
          equipment: [
            { name: "Zbroja luskowa", qty: 1, weight: 45 },
            { name: "Miecz dlugi", qty: 1, weight: 3 },
          ],
          gold: 25,
        },
        step7: { cantrips: [], spells: [] },
      },
      version: 0,
    };
    sessionStorage.setItem("wizard-character", JSON.stringify(data));
  });
}

// ── KonceptForm — nowe pola wyglądu ──────────────────────────────────────────

test.describe("KonceptForm — nowe pola wyglądu", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    await loginAs(page);
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/kreator/koncept");
  });

  test("pole Waga w kg jest widoczne", async ({ page }) => {
    await expect(page.getByText(/waga w kg/i)).toBeVisible();
    await expect(page.getByPlaceholder(/np. 70/i)).toBeVisible();
  });

  test("pole Kolor oczu jest widoczne", async ({ page }) => {
    await expect(page.getByText(/kolor oczu/i)).toBeVisible();
    await expect(page.getByPlaceholder(/np. Niebieski/i)).toBeVisible();
  });

  test("pole Kolor skóry jest widoczne", async ({ page }) => {
    await expect(page.getByText(/kolor skóry/i)).toBeVisible();
    await expect(page.getByPlaceholder(/np. Oliwkowy/i)).toBeVisible();
  });

  test("pole Kolor włosów jest widoczne", async ({ page }) => {
    await expect(page.getByText(/kolor włosów/i)).toBeVisible();
    await expect(page.getByPlaceholder(/np. Czarny/i)).toBeVisible();
  });

  test("waga przyjmuje wartość liczbową", async ({ page }) => {
    await page.getByPlaceholder(/np. 70/i).fill("95");
    await expect(page.getByPlaceholder(/np. 70/i)).toHaveValue("95");
  });

  test("kolor oczu przyjmuje tekst", async ({ page }) => {
    await page.getByPlaceholder(/np. Niebieski/i).fill("Szare");
    await expect(page.getByPlaceholder(/np. Niebieski/i)).toHaveValue("Szare");
  });

  test("kolor skóry przyjmuje tekst", async ({ page }) => {
    await page.getByPlaceholder(/np. Oliwkowy/i).fill("Blada");
    await expect(page.getByPlaceholder(/np. Oliwkowy/i)).toHaveValue("Blada");
  });

  test("kolor włosów przyjmuje tekst", async ({ page }) => {
    await page.getByPlaceholder(/np. Czarny/i).fill("Rude");
    await expect(page.getByPlaceholder(/np. Czarny/i)).toHaveValue("Rude");
  });

  test("nowe pola zostają zapisane w sessionStorage po odświeżeniu", async ({ page }) => {
    await page.locator('input[placeholder*="Aldric"]').fill("Ragnvald");
    await page.getByPlaceholder(/np. 70/i).fill("90");
    await page.getByPlaceholder(/np. Niebieski/i).fill("Zielone");
    await page.getByPlaceholder(/np. Oliwkowy/i).fill("Opalone");
    await page.getByPlaceholder(/np. Czarny/i).fill("Czarne");
    await page.reload();
    await expect(page.getByPlaceholder(/np. 70/i)).toHaveValue("90");
    await expect(page.getByPlaceholder(/np. Niebieski/i)).toHaveValue("Zielone");
    await expect(page.getByPlaceholder(/np. Oliwkowy/i)).toHaveValue("Opalone");
    await expect(page.getByPlaceholder(/np. Czarny/i)).toHaveValue("Czarne");
  });
});

// ── TloForm — historia i sojusznicy ──────────────────────────────────────────

test.describe("TloForm — historia i sojusznicy", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    await loginAs(page);
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/kreator/tlo");
  });

  test("pola historia i sojusznicy nie są widoczne bez wybranego tła", async ({ page }) => {
    await expect(page.getByPlaceholder(/Opisz skąd pochodzi/i)).not.toBeVisible();
    await expect(page.getByPlaceholder(/Frakcje, gildie/i)).not.toBeVisible();
  });

  test("po wyborze tła pojawia się pole historii postaci", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Żołnierz" }).first().click();
    await expect(page.getByPlaceholder(/Opisz skąd pochodzi/i)).toBeVisible();
  });

  test("po wyborze tła pojawia się pole sojuszników", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Żołnierz" }).first().click();
    await expect(page.getByPlaceholder(/Frakcje, gildie/i)).toBeVisible();
  });

  test("historia postaci przyjmuje tekst", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Akolita" }).first().click();
    await page.getByPlaceholder(/Opisz skąd pochodzi/i).fill("Urodzony w malej wiosce.");
    await expect(page.getByPlaceholder(/Opisz skąd pochodzi/i)).toHaveValue("Urodzony w malej wiosce.");
  });

  test("sojusznicy przyjmują tekst", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Akolita" }).first().click();
    await page.getByPlaceholder(/Frakcje, gildie/i).fill("Zakon Srebrnej Gwiazdy");
    await expect(page.getByPlaceholder(/Frakcje, gildie/i)).toHaveValue("Zakon Srebrnej Gwiazdy");
  });

  test("label Historia postaci widoczny po wyborze tła", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Akolita" }).first().click();
    await expect(page.getByText(/historia postaci/i)).toBeVisible();
  });

  test("label Sojusznicy i organizacje widoczny po wyborze tła", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Akolita" }).first().click();
    await expect(page.getByText(/sojusznicy i organizacje/i)).toBeVisible();
  });
});

// ── EkwipunekForm — majątek/skarby ───────────────────────────────────────────

test.describe("EkwipunekForm — pole majątku", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    await loginAs(page);
    await page.evaluate(() => sessionStorage.clear());
    await injectWizardState(page);
    await page.goto("/kreator/ekwipunek");
  });

  test("pole Majątek / Skarby jest widoczne", async ({ page }) => {
    await expect(page.getByText(/majątek \/ skarby/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Klejnoty, relikwie/i)).toBeVisible();
  });

  test("pole majątku przyjmuje tekst", async ({ page }) => {
    await page.getByPlaceholder(/Klejnoty, relikwie/i).fill("Zloty pierscien z rubinem");
    await expect(page.getByPlaceholder(/Klejnoty, relikwie/i)).toHaveValue("Zloty pierscien z rubinem");
  });
});

// ── Integracja: pełny kreator (via sessionStorage) → zapis → PDF ─────────────

test.describe("Integracja — kreator z nowymi polami → PDF", () => {
  test("tworzy postać z nowymi polami i eksportuje PDF", async ({ page, request }) => {
    test.setTimeout(180000);
    await loginAs(page);
    await page.evaluate(() => sessionStorage.clear());
    await injectWizardState(page);
    await page.goto("/kreator/gotowe");

    // Zapisz postać
    const saveBtn = page.getByRole("button", { name: /stwórz postać|zapisz/i });
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await saveBtn.click();
    await page.waitForURL("**/dashboard", { timeout: 30000 });

    // Postać widoczna na dashboardzie
    const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Ragnvald" }).first();
    await expect(card).toBeVisible();

    // Przejdź na kartę postaci
    await card.getByRole("link", { name: /Otwórz kartę/i }).click();
    await page.waitForURL(/\/karta\//, { timeout: 15000 });

    const characterId = page.url().split("/karta/")[1];
    expect(characterId).toBeTruthy();

    // Eksportuj PDF przez API
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await request.get(`/api/export-pdf/${characterId}`, {
      headers: { Cookie: cookieHeader },
      timeout: 30000,
    });

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect(res.headers()["content-disposition"]).toContain(".pdf");

    const body = await res.body();
    expect(body.slice(0, 4).toString()).toBe("%PDF");
    expect(body.length).toBeGreaterThan(10000);

    // Cleanup — usuń postać
    await page.goto("/dashboard");
    const freshCard = page.locator('[data-testid="character-card"]').filter({ hasText: "Ragnvald" }).first();
    if (await freshCard.isVisible()) {
      await freshCard.locator('[data-testid="menu-btn"]').click();
      const deleteBtn = page.getByRole("button", { name: /usuń/i }).first();
      if (await deleteBtn.isVisible({ timeout: 3000 })) {
        await deleteBtn.click();
        const confirmBtn = page.getByRole("button", { name: /potwierdź|usuń postać/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 })) await confirmBtn.click();
      }
    }
  });

  test("przycisk Eksportuj PDF widoczny na karcie nowej postaci", async ({ page }) => {
    test.setTimeout(120000);
    await loginAs(page);
    await page.evaluate(() => sessionStorage.clear());
    await injectWizardState(page);
    await page.goto("/kreator/gotowe");

    const saveBtn = page.getByRole("button", { name: /stwórz postać|zapisz/i });
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await saveBtn.click();
    await page.waitForURL("**/dashboard", { timeout: 30000 });

    const card = page.locator('[data-testid="character-card"]').filter({ hasText: "Ragnvald" }).first();
    await card.getByRole("link", { name: /Otwórz kartę/i }).click();
    await page.waitForURL(/\/karta\//, { timeout: 15000 });

    await expect(page.getByTestId("export-pdf-btn")).toBeVisible();

    // Cleanup
    await page.goto("/dashboard");
    const freshCard = page.locator('[data-testid="character-card"]').filter({ hasText: "Ragnvald" }).first();
    if (await freshCard.isVisible()) {
      await freshCard.locator('[data-testid="menu-btn"]').click();
      const deleteBtn = page.getByRole("button", { name: /usuń/i }).first();
      if (await deleteBtn.isVisible({ timeout: 3000 })) {
        await deleteBtn.click();
        const confirmBtn = page.getByRole("button", { name: /potwierdź|usuń postać/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 })) await confirmBtn.click();
      }
    }
  });
});
