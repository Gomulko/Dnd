import { describe, it, expect } from "vitest";
import {
  mod,
  modNum,
  profBonus,
  maxHp,
  unarmoredAC,
  passivePerception,
  spellSaveDC,
  spellAttackBonus,
  savingThrow,
  skillBonus,
} from "@/shared/lib/dnd-mechanics";

// ── 1.1 Modyfikator cechy ───────────────────────────────────────────────────

describe("modNum — modyfikator cechy (SRD s.6)", () => {
  it.each([
    [1, -5],
    [7, -2],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [13, 1],
    [15, 2],
    [17, 3],
    [20, 5],
    [30, 10],
  ])("modNum(%i) = %i", (score, expected) => {
    expect(modNum(score)).toBe(expected);
  });
});

describe("mod — modyfikator jako string ze znakiem", () => {
  it("mod(10) = '+0'", () => expect(mod(10)).toBe("+0"));
  it("mod(17) = '+3'", () => expect(mod(17)).toBe("+3"));
  it("mod(7) = '-2'", () => expect(mod(7)).toBe("-2"));
  it("mod(1) = '-5'", () => expect(mod(1)).toBe("-5"));
});

// ── 1.2 Bonus Biegłości ─────────────────────────────────────────────────────

describe("profBonus — bonus biegłości wg poziomu (SRD)", () => {
  it.each([
    [1, 2], [4, 2],
    [5, 3], [8, 3],
    [9, 4], [12, 4],
    [13, 5], [16, 5],
    [17, 6], [20, 6],
  ])("profBonus(%i) = %i", (level, expected) => {
    expect(profBonus(level)).toBe(expected);
  });
});

// ── 1.3 Punkty Życia ────────────────────────────────────────────────────────

describe("maxHp — punkty życia (SRD)", () => {
  it("Wojownik (d10), KON 14 (+2), poziom 1 → 12", () => {
    expect(maxHp(10, 1, 2)).toBe(12);
  });
  it("Wojownik (d10), KON 14 (+2), poziom 2 → 20", () => {
    expect(maxHp(10, 2, 2)).toBe(20);
  });
  it("Wojownik (d10), KON 14 (+2), poziom 5 → 44", () => {
    expect(maxHp(10, 5, 2)).toBe(44);
  });
  it("Kleryk (d8), KON 12 (+1), poziom 1 → 9", () => {
    expect(maxHp(8, 1, 1)).toBe(9);
  });
  it("Kleryk (d8), KON 12 (+1), poziom 3 → 21", () => {
    expect(maxHp(8, 3, 1)).toBe(21);
  });
  it("Czarodziej (d6), KON 10 (+0), poziom 1 → 6", () => {
    expect(maxHp(6, 1, 0)).toBe(6);
  });
  it("Czarodziej (d6), KON 8 (-1), poziom 1 → 5 (min 1 ochrona: 6-1=5)", () => {
    expect(maxHp(6, 1, -1)).toBe(5);
  });
  it("Czarodziej (d6), KON 8 (-1), poziom 2 → 8", () => {
    // level1: max(1, 6-1)=5, level2: 5 + max(1, 3+1-1)=5+3=8
    expect(maxHp(6, 2, -1)).toBe(8);
  });
  it("Barbarzyńca (d12), KON 16 (+3), poziom 1 → 15", () => {
    expect(maxHp(12, 1, 3)).toBe(15);
  });
});

// ── 1.4 Klasa Pancerza (bez zbroi) ─────────────────────────────────────────

describe("unarmoredAC — klasa pancerza bez zbroi (SRD)", () => {
  it("DEX 10 (+0) → AC = 10", () => expect(unarmoredAC(10)).toBe(10));
  it("DEX 14 (+2) → AC = 12", () => expect(unarmoredAC(14)).toBe(12));
  it("DEX 16 (+3) → AC = 13", () => expect(unarmoredAC(16)).toBe(13));
  it("DEX 8 (-1) → AC = 9", () => expect(unarmoredAC(8)).toBe(9));
});

// ── 1.5 Inicjatywa ──────────────────────────────────────────────────────────

describe("inicjatywa = modNum(DEX) (SRD)", () => {
  it("DEX 10 → 0", () => expect(modNum(10)).toBe(0));
  it("DEX 14 → +2", () => expect(modNum(14)).toBe(2));
  it("DEX 8 → -1", () => expect(modNum(8)).toBe(-1));
});

// ── 1.6 Bierna Percepcja ────────────────────────────────────────────────────

describe("passivePerception (SRD s.22)", () => {
  it("WIS 14 (+2), biegły, poziom 1 (PB+2) → 14", () => {
    expect(passivePerception(14, true, 1)).toBe(14);
  });
  it("WIS 14 (+2), nie biegły → 12", () => {
    expect(passivePerception(14, false, 1)).toBe(12);
  });
  it("WIS 10 (+0), biegły, poziom 5 (PB+3) → 13", () => {
    expect(passivePerception(10, true, 5)).toBe(13);
  });
});

// ── 1.7 Spell Save DC ───────────────────────────────────────────────────────

describe("spellSaveDC (SRD s.23)", () => {
  it("Kleryk MĄD 17 (+3), poziom 1 (PB+2) → DC 13", () => {
    expect(spellSaveDC(17, 1)).toBe(13);
  });
  it("Kleryk MĄD 17 (+3), poziom 5 (PB+3) → DC 14", () => {
    expect(spellSaveDC(17, 5)).toBe(14);
  });
  it("Czarodziej INT 16 (+3), poziom 1 (PB+2) → DC 13", () => {
    expect(spellSaveDC(16, 1)).toBe(13);
  });
  it("Czarownik CHA 14 (+2), poziom 9 (PB+4) → DC 14", () => {
    expect(spellSaveDC(14, 9)).toBe(14);
  });
  it("Bard CHA 20 (+5), poziom 17 (PB+6) → DC 19", () => {
    expect(spellSaveDC(20, 17)).toBe(19);
  });
});

// ── 1.8 Bonus Ataku Czarami ─────────────────────────────────────────────────

describe("spellAttackBonus (SRD s.23)", () => {
  it("Kleryk MĄD 17 (+3), poziom 1 (PB+2) → +5", () => {
    expect(spellAttackBonus(17, 1)).toBe(5);
  });
  it("Czarodziej INT 18 (+4), poziom 5 (PB+3) → +7", () => {
    expect(spellAttackBonus(18, 5)).toBe(7);
  });
});

// ── 1.9 Rzuty Obronne ───────────────────────────────────────────────────────

describe("savingThrow (SRD)", () => {
  it("Kleryk MĄD 17 (+3), biegły, poziom 1 → +5", () => {
    expect(savingThrow(17, true, 1)).toBe(5);
  });
  it("Kleryk SIŁ 10 (+0), nie biegły, poziom 1 → 0", () => {
    expect(savingThrow(10, false, 1)).toBe(0);
  });
  it("Wojownik SIŁ 18 (+4), biegły, poziom 1 → +6", () => {
    expect(savingThrow(18, true, 1)).toBe(6);
  });
});

// ── 1.10 Umiejętności ───────────────────────────────────────────────────────

describe("skillBonus (SRD)", () => {
  it("Atletyka (SIŁ 16), biegły, poziom 1 → +5", () => {
    expect(skillBonus(16, true, 1)).toBe(5);
  });
  it("Skrytobójstwo (ZRR 14), biegły, poziom 5 → +5", () => {
    expect(skillBonus(14, true, 5)).toBe(5);
  });
  it("Percepcja (MĄD 12), nie biegły → +1", () => {
    expect(skillBonus(12, false, 1)).toBe(1);
  });
});
