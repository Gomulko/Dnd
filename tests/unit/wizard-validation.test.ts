import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * BLOK 4 — Walidacja Kreatora Postaci
 * Źródło zasad: SRD 5.2.1 (rules/rules.txt)
 */

// ── 4.1 Standard Array (SRD s.12) ────────────────────────────────────────────
// "If you use the standard array, your six ability scores are 15, 14, 13, 12, 10, and 8."

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

describe("Standard Array — SRD s.12", () => {
  it("tablica zawiera dokładnie 6 wartości", () => {
    expect(STANDARD_ARRAY).toHaveLength(6);
  });

  it("wartości to [15, 14, 13, 12, 10, 8] zgodnie z SRD", () => {
    expect(STANDARD_ARRAY).toEqual([15, 14, 13, 12, 10, 8]);
  });

  it("suma Standard Array = 72", () => {
    const sum = STANDARD_ARRAY.reduce((a, b) => a + b, 0);
    expect(sum).toBe(72);
  });

  it("wszystkie wartości są unikalne (brak duplikatów)", () => {
    const unique = new Set(STANDARD_ARRAY);
    expect(unique.size).toBe(STANDARD_ARRAY.length);
  });

  it("minimalna wartość = 8", () => {
    expect(Math.min(...STANDARD_ARRAY)).toBe(8);
  });

  it("maksymalna wartość = 15", () => {
    expect(Math.max(...STANDARD_ARRAY)).toBe(15);
  });

  it("formularz odblokowany gdy wszystkie 6 statystyk jest różnych (zestaw kompletny)", () => {
    const assigned = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    const values = Object.values(assigned);
    const isComplete = new Set(values).size === 6;
    expect(isComplete).toBe(true);
  });

  it("formularz zablokowany gdy wartości się powtarzają (duplikaty)", () => {
    const assigned = { str: 15, dex: 15, con: 13, int: 12, wis: 10, cha: 8 };
    const values = Object.values(assigned);
    const isComplete = new Set(values).size === 6;
    expect(isComplete).toBe(false);
  });

  it("formularz zablokowany gdy nie wszystkie statystyki przypisane (wartość 0)", () => {
    const assigned = { str: 15, dex: 0, con: 13, int: 12, wis: 10, cha: 8 };
    const values = Object.values(assigned);
    const isComplete = new Set(values).size === 6 && !values.includes(0);
    expect(isComplete).toBe(false);
  });
});

// ── 4.2 Point Buy (SRD s.13) ─────────────────────────────────────────────────
// "You have 27 points to spend on your ability scores."
// Cost table from SRD: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
const POINT_BUY_BUDGET = 27;
const POINT_BUY_MIN = 8;
const POINT_BUY_MAX = 15;

describe("Point Buy — SRD s.13", () => {
  it("budżet startowy = 27 punktów", () => {
    expect(POINT_BUY_BUDGET).toBe(27);
  });

  it("minimalna wartość cechy = 8", () => {
    expect(POINT_BUY_MIN).toBe(8);
  });

  it("maksymalna wartość cechy = 15", () => {
    expect(POINT_BUY_MAX).toBe(15);
  });

  it.each([
    [8,  0],
    [9,  1],
    [10, 2],
    [11, 3],
    [12, 4],
    [13, 5],
    [14, 7],
    [15, 9],
  ])("koszt cechy %i = %i punktów (SRD tabela)", (score, cost) => {
    expect(POINT_BUY_COSTS[score]).toBe(cost);
  });

  it("koszt niedostępny (7) = undefined — wartość poniżej minimum", () => {
    expect(POINT_BUY_COSTS[7]).toBeUndefined();
  });

  it("koszt niedostępny (16) = undefined — wartość powyżej maximum", () => {
    expect(POINT_BUY_COSTS[16]).toBeUndefined();
  });

  it("6× wartość 8 kosztuje 0 punktów", () => {
    const stats = [8, 8, 8, 8, 8, 8];
    const spent = stats.reduce((sum, s) => sum + (POINT_BUY_COSTS[s] ?? 0), 0);
    expect(spent).toBe(0);
    expect(spent).toBeLessThanOrEqual(POINT_BUY_BUDGET);
  });

  it("6× wartość 13 kosztuje 30 punktów — przekracza budżet", () => {
    const stats = [13, 13, 13, 13, 13, 13];
    const spent = stats.reduce((sum, s) => sum + (POINT_BUY_COSTS[s] ?? 0), 0);
    expect(spent).toBe(30);
    expect(spent).toBeGreaterThan(POINT_BUY_BUDGET);
  });

  it("6× wartość 13 minus jeden 13 + jeden 8 kosztuje 25 — mieści się w budżecie", () => {
    // str:13(5) dex:13(5) con:13(5) int:13(5) wis:13(5) cha:8(0) = 25
    const stats = [13, 13, 13, 13, 13, 8];
    const spent = stats.reduce((sum, s) => sum + (POINT_BUY_COSTS[s] ?? 0), 0);
    expect(spent).toBe(25);
    expect(spent).toBeLessThanOrEqual(POINT_BUY_BUDGET);
  });

  it("maksymalny możliwy zakup: 15+15+15+8+8+8 = 9+9+9+0+0+0 = 27 (dokładnie budżet)", () => {
    const stats = [15, 15, 15, 8, 8, 8];
    const spent = stats.reduce((sum, s) => sum + (POINT_BUY_COSTS[s] ?? 0), 0);
    expect(spent).toBe(27);
    expect(spent).toBe(POINT_BUY_BUDGET);
  });

  it("skok kosztu między 13 a 14: różnica 2 (nie 1) — zgodnie z SRD", () => {
    expect(POINT_BUY_COSTS[14]! - POINT_BUY_COSTS[13]!).toBe(2);
  });

  it("skok kosztu między 14 a 15: różnica 2 (nie 1) — zgodnie z SRD", () => {
    expect(POINT_BUY_COSTS[15]! - POINT_BUY_COSTS[14]!).toBe(2);
  });
});

// ── 4.3 Walidacja Schematu Zod (createCharacterSchema) ───────────────────────

const equipmentItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().min(0),
  weight: z.number().min(0),
});

const createCharacterSchema = z.object({
  name: z.string().min(2).max(100),
  gender: z.enum(["kobieta", "mezczyzna", "inne"]),
  age: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  description: z.string().max(500),
  alignment: z.enum(["LG", "NG", "CG", "LN", "TN", "CN", "LE", "NE", "CE"]),
  race: z.string().min(1),
  subrace: z.string().nullable(),
  class: z.string().min(1),
  subclass: z.string().nullable(),
  skills: z.array(z.string()),
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
  background: z.string().nullable(),
  personalityTraits: z.array(z.string()),
  ideals: z.array(z.string()),
  bonds: z.array(z.string()),
  flaws: z.array(z.string()),
  languages: z.array(z.string()),
  backstory: z.string(),
  equipment: z.array(equipmentItemSchema),
  gold: z.number().int().min(0),
  cantrips: z.array(z.string()),
  spells: z.array(z.string()),
});

function makeValidInput(): z.infer<typeof createCharacterSchema> {
  return {
    name: "Araniel Świetlisty",
    gender: "mezczyzna",
    age: 130,
    height: 175,
    description: "Dawny sługa świątyni.",
    alignment: "LG",
    race: "elf",
    subrace: "wysoki-elf",
    class: "cleric",
    subclass: "life",
    skills: ["insight", "history"],
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 15,
    charisma: 13,
    background: "acolyte",
    personalityTraits: ["Miłuję ład."],
    ideals: ["Sprawiedliwość."],
    bonds: ["Świątynia jest moim domem."],
    flaws: ["Jestem nieufny wobec obcych."],
    languages: ["common", "elvish"],
    backstory: "",
    equipment: [{ name: "Kolczuga", qty: 1, weight: 20 }],
    gold: 10,
    cantrips: ["guidance", "sacred-flame"],
    spells: ["bless"],
  };
}

describe("createCharacterSchema — walidacja Zod", () => {
  it("kompletne poprawne dane przechodzą walidację", () => {
    const result = createCharacterSchema.safeParse(makeValidInput());
    expect(result.success).toBe(true);
  });

  it("imię < 2 znaki → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), name: "A" });
    expect(result.success).toBe(false);
  });

  it("imię > 100 znaków → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("imię dokładnie 2 znaki → OK", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), name: "Ab" });
    expect(result.success).toBe(true);
  });

  it("nieznany alignment ('XY') → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), alignment: "XY" as "LG" });
    expect(result.success).toBe(false);
  });

  it.each(["LG", "NG", "CG", "LN", "TN", "CN", "LE", "NE", "CE"] as const)(
    "alignment '%s' → OK",
    (alignment) => {
      const result = createCharacterSchema.safeParse({ ...makeValidInput(), alignment });
      expect(result.success).toBe(true);
    }
  );

  it("wartość cechy = 0 → błąd (min 1, SRD nie dopuszcza 0)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), strength: 0 });
    expect(result.success).toBe(false);
  });

  it("wartość cechy = 31 → błąd (max 30, SRD)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), charisma: 31 });
    expect(result.success).toBe(false);
  });

  it("wartość cechy = 30 → OK (max smok)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), strength: 30 });
    expect(result.success).toBe(true);
  });

  it("wartość cechy = 1 → OK (min SRD)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), constitution: 1 });
    expect(result.success).toBe(true);
  });

  it("gold < 0 → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), gold: -1 });
    expect(result.success).toBe(false);
  });

  it("gold = 0 → OK", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), gold: 0 });
    expect(result.success).toBe(true);
  });

  it("nieznana płeć ('robot') → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), gender: "robot" as "kobieta" });
    expect(result.success).toBe(false);
  });

  it.each(["kobieta", "mezczyzna", "inne"] as const)(
    "płeć '%s' → OK",
    (gender) => {
      const result = createCharacterSchema.safeParse({ ...makeValidInput(), gender });
      expect(result.success).toBe(true);
    }
  );

  it("opis > 500 znaków → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), description: "x".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("opis = 500 znaków → OK", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), description: "x".repeat(500) });
    expect(result.success).toBe(true);
  });

  it("age = null → OK (opcjonalne)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), age: null });
    expect(result.success).toBe(true);
  });

  it("age ujemny → błąd", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), age: -5 });
    expect(result.success).toBe(false);
  });

  it("subrace = null → OK (nie wszystkie rasy mają podrasy)", () => {
    const result = createCharacterSchema.safeParse({ ...makeValidInput(), subrace: null });
    expect(result.success).toBe(true);
  });
});
