import { describe, it, expect } from "vitest";
import { RACES } from "@/data/dnd/races";
import { CLASSES } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { allSpells } from "@/data/dnd/spells";

// ── 2.1 Rasy ────────────────────────────────────────────────────────────────

describe("RACES — integralność danych", () => {
  it("liczba ras = 11", () => {
    expect(RACES).toHaveLength(11);
  });

  it("każda rasa ma wymagane pola", () => {
    for (const race of RACES) {
      expect(race.id, `rasa ${race.id} brak id`).toBeTruthy();
      expect(race.name, `rasa ${race.id} brak name`).toBeTruthy();
      expect(race.speed, `rasa ${race.id} brak speed`).toBeGreaterThan(0);
      expect(race.statBonuses, `rasa ${race.id} brak statBonuses`).toBeDefined();
      expect(race.traits, `rasa ${race.id} brak traits`).toBeDefined();
    }
  });

  it.each([
    ["human", 30], ["elf", 30], ["dragonborn", 30], ["tiefling", 30],
    ["goliath", 30], ["orc", 30], ["half-elf", 30], ["half-orc", 30],
  ])("rasa %s ma prędkość 30", (id, speed) => {
    const race = RACES.find((r) => r.id === id);
    expect(race, `nie znaleziono rasy ${id}`).toBeDefined();
    expect(race!.speed).toBe(speed);
  });

  it.each([
    ["dwarf", 25], ["halfling", 25], ["gnome", 25],
  ])("rasa %s ma prędkość 25", (id, speed) => {
    const race = RACES.find((r) => r.id === id);
    expect(race, `nie znaleziono rasy ${id}`).toBeDefined();
    expect(race!.speed).toBe(speed);
  });

  it("Człowiek (human) ma +1 do wszystkich 6 cech", () => {
    const human = RACES.find((r) => r.id === "human")!;
    const bonuses = human.statBonuses;
    expect(bonuses.str).toBe(1);
    expect(bonuses.dex).toBe(1);
    expect(bonuses.con).toBe(1);
    expect(bonuses.int).toBe(1);
    expect(bonuses.wis).toBe(1);
    expect(bonuses.cha).toBe(1);
  });

  it("Drakonid ma +2 SIŁ, +1 CHA", () => {
    const r = RACES.find((r) => r.id === "dragonborn")!;
    expect(r.statBonuses.str).toBe(2);
    expect(r.statBonuses.cha).toBe(1);
  });

  it("Tiefling ma +2 CHA, +1 INT", () => {
    const r = RACES.find((r) => r.id === "tiefling")!;
    expect(r.statBonuses.cha).toBe(2);
    expect(r.statBonuses.int).toBe(1);
  });

  it("Goliath ma +2 SIŁ, +1 KON", () => {
    const r = RACES.find((r) => r.id === "goliath")!;
    expect(r.statBonuses.str).toBe(2);
    expect(r.statBonuses.con).toBe(1);
  });

  it("Ork ma +2 SIŁ, +1 KON", () => {
    const r = RACES.find((r) => r.id === "orc")!;
    expect(r.statBonuses.str).toBe(2);
    expect(r.statBonuses.con).toBe(1);
  });

  it("Półelf ma +2 CHA", () => {
    const r = RACES.find((r) => r.id === "half-elf")!;
    expect(r.statBonuses.cha).toBe(2);
  });

  it("Półork ma +2 SIŁ, +1 KON", () => {
    const r = RACES.find((r) => r.id === "half-orc")!;
    expect(r.statBonuses.str).toBe(2);
    expect(r.statBonuses.con).toBe(1);
  });
});

// ── 2.2 Klasy ───────────────────────────────────────────────────────────────

describe("CLASSES — integralność danych", () => {
  it("liczba klas = 12", () => {
    expect(CLASSES).toHaveLength(12);
  });

  it("każda klasa ma co najmniej 1 podklasę", () => {
    for (const cls of CLASSES) {
      expect(cls.subclasses.length, `klasa ${cls.id} brak podklas`).toBeGreaterThanOrEqual(1);
    }
  });

  it.each([
    ["barbarian", 12],
    ["fighter", 10], ["paladin", 10], ["ranger", 10],
    ["bard", 8], ["cleric", 8], ["druid", 8], ["monk", 8], ["rogue", 8], ["warlock", 8],
    ["sorcerer", 6], ["wizard", 6],
  ])("klasa %s ma hitDie = %i", (id, die) => {
    const cls = CLASSES.find((c) => c.id === id)!;
    expect(cls.hitDie).toBe(die);
  });

  it.each([
    ["barbarian", ["str", "con"]],
    ["bard", ["dex", "cha"]],
    ["cleric", ["wis", "cha"]],
    ["druid", ["int", "wis"]],
    ["fighter", ["str", "con"]],
    ["monk", ["str", "dex"]],
    ["paladin", ["wis", "cha"]],
    ["ranger", ["str", "dex"]],
    ["rogue", ["dex", "int"]],
    ["sorcerer", ["con", "cha"]],
    ["warlock", ["wis", "cha"]],
    ["wizard", ["int", "wis"]],
  ])("klasa %s ma poprawne rzuty obronne", (id, saves) => {
    const cls = CLASSES.find((c) => c.id === id)!;
    expect(cls.savingThrows).toEqual(expect.arrayContaining(saves));
    expect(cls.savingThrows).toHaveLength(saves.length);
  });

  it.each([
    ["cleric", "wis"], ["druid", "wis"], ["ranger", "wis"],
    ["paladin", "cha"],
    ["bard", "cha"], ["warlock", "cha"], ["sorcerer", "cha"],
    ["wizard", "int"],
  ])("klasa magiczna %s ma spellcastingAbility = %s", (id, ability) => {
    const cls = CLASSES.find((c) => c.id === id)!;
    expect(cls.spellcasting).toBe(true);
    expect(cls.spellcastingAbility).toBe(ability);
  });

  it.each(["barbarian", "fighter", "monk", "rogue"])(
    "klasa niemagiczna %s ma spellcasting = false",
    (id) => {
      const cls = CLASSES.find((c) => c.id === id)!;
      expect(cls.spellcasting).toBe(false);
    }
  );
});

// ── 2.3 Tła ─────────────────────────────────────────────────────────────────

describe("BACKGROUNDS — integralność danych", () => {
  it("liczba teł = 13", () => {
    expect(BACKGROUNDS).toHaveLength(13);
  });

  it("każde tło ma wymagane pola i min. 4 opcje każdej kategorii", () => {
    for (const bg of BACKGROUNDS) {
      expect(bg.id, `tło ${bg.id} brak id`).toBeTruthy();
      expect(bg.name, `tło ${bg.id} brak name`).toBeTruthy();
      expect(bg.skillProficiencies, `tło ${bg.id} brak skillProficiencies`).toBeDefined();
      expect(bg.personalityTraits.length, `tło ${bg.id} za mało cech charakteru`).toBeGreaterThanOrEqual(4);
      expect(bg.ideals.length, `tło ${bg.id} za mało ideałów`).toBeGreaterThanOrEqual(4);
      expect(bg.bonds.length, `tło ${bg.id} za mało więzi`).toBeGreaterThanOrEqual(4);
      expect(bg.flaws.length, `tło ${bg.id} za mało wad`).toBeGreaterThanOrEqual(4);
    }
  });

  it("akolita ma umiejętności Wnikliwość i Religia", () => {
    const bg = BACKGROUNDS.find((b) => b.id === "acolyte")!;
    expect(bg.skillProficiencies).toContain("insight");
    expect(bg.skillProficiencies).toContain("religion");
  });

  it("żołnierz ma umiejętności Atletyka i Zastraszanie", () => {
    const bg = BACKGROUNDS.find((b) => b.id === "soldier")!;
    expect(bg.skillProficiencies).toContain("athletics");
    expect(bg.skillProficiencies).toContain("intimidation");
  });

  it("uczony ma umiejętności Arcana i Historia", () => {
    const bg = BACKGROUNDS.find((b) => b.id === "sage")!;
    expect(bg.skillProficiencies).toContain("arcana");
    expect(bg.skillProficiencies).toContain("history");
  });
});

// ── 2.4 Czary ────────────────────────────────────────────────────────────────

describe("allSpells — integralność danych", () => {
  it("brak duplikatów ID czarów", () => {
    const ids = allSpells.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("każdy czar ma wymagane pola", () => {
    for (const spell of allSpells) {
      expect(spell.id, `czar brak id`).toBeTruthy();
      expect(spell.name, `czar ${spell.id} brak name`).toBeTruthy();
      expect(spell.namePl, `czar ${spell.id} brak namePl`).toBeTruthy();
      expect(spell.school, `czar ${spell.id} brak school`).toBeTruthy();
      expect(typeof spell.level, `czar ${spell.id} brak level`).toBe("number");
      expect(spell.classes.length, `czar ${spell.id} brak classes`).toBeGreaterThan(0);
    }
  });

  // Paladin i Ranger nie mają cantripów w SRD 5.2.1
  const classesWithCantrips = ["cleric", "druid", "bard", "warlock", "sorcerer", "wizard"];

  it.each(classesWithCantrips)("klasa %s ma min. 3 cantripy", (cls) => {
    const classCantrips = allSpells.filter((s) => s.level === 0 && s.classes.includes(cls));
    expect(classCantrips.length).toBeGreaterThanOrEqual(3);
  });

  const magicClasses = ["cleric", "druid", "paladin", "ranger", "bard", "warlock", "sorcerer", "wizard"];
  it.each(magicClasses)("klasa %s ma min. 2 zaklęcia poz. 1", (cls) => {
    const classSpells = allSpells.filter((s) => s.level === 1 && s.classes.includes(cls));
    expect(classSpells.length).toBeGreaterThanOrEqual(2);
  });

  it("cantripy kleryka zawierają guidance, sacred-flame, light", () => {
    const clericCantrips = allSpells.filter((s) => s.level === 0 && s.classes.includes("cleric"));
    const ids = clericCantrips.map((s) => s.id);
    expect(ids).toContain("guidance");
    expect(ids).toContain("sacred-flame");
    expect(ids).toContain("light");
  });

  it("cantripy czarodzieja zawierają fire-bolt, mage-hand", () => {
    const wizardCantrips = allSpells.filter((s) => s.level === 0 && s.classes.includes("wizard"));
    const ids = wizardCantrips.map((s) => s.id);
    expect(ids).toContain("fire-bolt");
    expect(ids).toContain("mage-hand");
  });
});
