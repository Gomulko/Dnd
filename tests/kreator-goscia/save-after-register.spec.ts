import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

const GUEST_STORAGE_KEY = "guest-wizard-character";

const guestState = {
  step1: { name: "PostacZGoscia", gender: "inne", age: null, height: null, weight: null, eyeColor: "", skinColor: "", hairColor: "", description: "", alignment: "TN" },
  step2: { race: "human", subrace: null },
  step3: { class: "fighter", subclass: null, skills: ["athletics", "intimidation"] },
  step4: { method: "standard", strength: 15, dexterity: 13, constitution: 14, intelligence: 10, wisdom: 12, charisma: 8 },
  step5: { background: "soldier", personalityTraits: [], ideals: [], bonds: [], flaws: [], languages: [], backstory: "", allies: "", treasure: "" },
  step6: { equipment: [], gold: 10 },
  step7: { cantrips: [], spells: [] },
};

test("po zalogowaniu z pending character w localStorage postać pojawia się na dashboardzie", async ({ page }) => {
  test.setTimeout(60000);

  // Symuluj stan: gość stworzył postać i jest localStorage z danymi
  // GuestCharacterSaver na dashboard obsługuje tworzenie postaci asynchronicznie

  await page.goto("/logowanie");
  await page.evaluate(
    ([key, state]) => {
      localStorage.setItem("cookiesAccepted", "true");
      localStorage.setItem(key, JSON.stringify(state));
    },
    [GUEST_STORAGE_KEY, guestState] as const
  );

  // Zaloguj się jako istniejący użytkownik testowy
  await page.locator('input[name="username"]').fill("tester");
  await page.locator('input[name="password"]').fill("Test1234!");
  await page.getByRole("button", { name: /wkrocz/i }).click();

  // Login jest teraz szybki (bez createCharacter)
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  // GuestCharacterSaver działa w tle — poczekaj na pojawienie się postaci
  await expect(page.getByText("PostacZGoscia").first()).toBeVisible({ timeout: 30000 });

  // localStorage powinno być wyczyszczone po zapisaniu przez GuestCharacterSaver
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), GUEST_STORAGE_KEY), { timeout: 20000 })
    .toBeNull();
});

test("strona logowania z parametrem pendingCharacter pokazuje baner", async ({ page }) => {
  await page.goto("/logowanie?pendingCharacter=1");
  await expect(page.getByText(/Zaloguj się, aby zapisać swoją postać z trybu gościa/i)).toBeVisible();
});

test("strona rejestracji z pendingCharacter w localStorage przekierowuje z właściwym param", async ({ page }) => {
  const username = `gosctester_${Date.now()}`;

  // Ustaw localStorage PRZED załadowaniem strony rejestracji
  await page.goto("/rejestracja");
  await page.evaluate(
    ([key, state]) => {
      localStorage.setItem("cookiesAccepted", "true");
      localStorage.setItem(key, JSON.stringify(state));
    },
    [GUEST_STORAGE_KEY, guestState] as const
  );

  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill("Test1234!");
  await page.locator('input[name="confirmPassword"]').fill("Test1234!");
  await page.getByRole("button", { name: /Rozpocznij przygodę/i }).click();

  // Rejestracja powinna przekierować z pendingCharacter=1
  await expect(page).toHaveURL(/\/logowanie.*pendingCharacter=1/, { timeout: 15000 });
});
