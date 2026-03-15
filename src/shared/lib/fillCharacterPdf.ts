import { PDFDocument, PDFName, PDFBool } from "pdf-lib";
import { CLASSES } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { allSpells } from "@/data/dnd/spells";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CharacterPdfData = {
  name: string;
  race: string;
  class: string;
  level: number;
  background: string | null;
  alignment: string;
  userName: string;
  experience: number;
  inspiration: boolean;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  currentHp: number | null;
  tempHp: number;
  skills: string[];
  attacks: { name: string; atkBonus: string; damage: string }[];
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  languages: string[];
  equipment: { name: string; qty: number }[];
  gold: number;
  cantrips: string[];
  spells: string[];
  backstory: string | null;
  allies: string | null;
  treasure: string | null;
  description: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  eyeColor: string | null;
  skinColor: string | null;
  hairColor: string | null;
};

// ── Stałe ─────────────────────────────────────────────────────────────────────

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry",    NG: "Neutralny Dobry",    CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwie Neutralny", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły",      NE: "Neutralny Zły",       CE: "Chaotyczny Zły",
};

type SkillDef = {
  stat: "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";
  dbKey: string;
};

// ID 28–45 = indeksy 27–44 = Text29–Text46
const SKILLS: SkillDef[] = [
  { stat: "dexterity",    dbKey: "acrobatics" },
  { stat: "strength",     dbKey: "athletics" },
  { stat: "intelligence", dbKey: "history" },
  { stat: "wisdom",       dbKey: "insight" },
  { stat: "wisdom",       dbKey: "medicine" },
  { stat: "wisdom",       dbKey: "animalHandling" },
  { stat: "charisma",     dbKey: "deception" },
  { stat: "wisdom",       dbKey: "perception" },
  { stat: "charisma",     dbKey: "persuasion" },
  { stat: "intelligence", dbKey: "nature" },
  { stat: "intelligence", dbKey: "religion" },
  { stat: "dexterity",    dbKey: "stealth" },
  { stat: "wisdom",       dbKey: "survival" },
  { stat: "intelligence", dbKey: "investigation" },
  { stat: "intelligence", dbKey: "arcana" },
  { stat: "charisma",     dbKey: "performance" },
  { stat: "charisma",     dbKey: "intimidation" },
  { stat: "dexterity",    dbKey: "sleightOfHand" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function skillMod(base: number, isProficient: boolean, prof: number): string {
  const m = Math.floor((base - 10) / 2) + (isProficient ? prof : 0);
  return m >= 0 ? `+${m}` : `${m}`;
}

function setByIndex(
  form: ReturnType<PDFDocument["getForm"]>,
  index: number,
  value: string
) {
  try {
    const fields = form.getFields();
    const field = fields[index];
    if (!field) return;
    form.getTextField(field.getName()).setText(value ?? "");
  } catch {
    // ignoruj
  }
}

function set(
  form: ReturnType<PDFDocument["getForm"]>,
  debugId: number,
  value: string
) {
  setByIndex(form, debugId - 1, value);
}

// ── Główna funkcja ─────────────────────────────────────────────────────────────

export async function fillCharacterPdf(
  templateBytes: Buffer | Uint8Array,
  data: CharacterPdfData
): Promise<Uint8Array> {
  const prof  = profBonus(data.level);
  const cls   = CLASSES.find((c) => c.id === data.class);
  const race  = RACES.find((r) => r.id === data.race);
  const bg    = BACKGROUNDS.find((b) => b.id === data.background);

  const stats = {
    strength:     data.strength,
    dexterity:    data.dexterity,
    constitution: data.constitution,
    intelligence: data.intelligence,
    wisdom:       data.wisdom,
    charisma:     data.charisma,
  };

  const dexMod = Math.floor((stats.dexterity - 10) / 2);
  const conMod = Math.floor((stats.constitution - 10) / 2);
  const wisMod = Math.floor((stats.wisdom - 10) / 2);
  const maxHp  = (cls?.hitDie ?? 8) + conMod;
  const ac     = 10 + dexMod;
  const speedFt = race?.speed ?? 30;
  const speed   = `${Math.round(speedFt * 0.3)}m`;

  const saveProficiencies = cls?.savingThrows ?? [];
  const saveStatKeys = ["str", "dex", "con", "int", "wis", "cha"] as const;
  const passivePerception = 10 + wisMod + (data.skills.includes("perception") ? prof : 0);

  const statKeys: Array<keyof typeof stats> = [
    "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma",
  ];

  // Cechy osobowości — zamień ID na tekst z danych tła
  function resolveIds(ids: string[], pool: { id: string; text: string }[]): string {
    return ids.map((id) => pool.find((o) => o.id === id)?.text ?? id).join("\n");
  }
  const personalityTraits = resolveIds(data.personalityTraits, bg?.personalityTraits ?? []);
  const ideals  = resolveIds(data.ideals,  bg?.ideals  ?? []);
  const bonds   = resolveIds(data.bonds,   bg?.bonds   ?? []);
  const flaws   = resolveIds(data.flaws,   bg?.flaws   ?? []);
  const languages = data.languages.join(", ");

  // Ekwipunek
  const equipText = data.equipment.map((e) => `${e.name}${e.qty > 1 ? ` ×${e.qty}` : ""}`).join("\n");

  // Biegłości i języki
  const profText = [
    cls ? `Zbroja: ${cls.armorTraining.join(", ")}` : "",
    languages ? `Języki: ${languages}` : "",
  ].filter(Boolean).join("\n");

  // Magia
  const spellAbilityMap: Record<string, keyof typeof stats> = {
    cha: "charisma", wis: "wisdom", int: "intelligence",
  };
  const spellAbilityKey   = cls?.spellcastingAbility ? spellAbilityMap[cls.spellcastingAbility] : null;
  const spellAbilityScore = spellAbilityKey ? stats[spellAbilityKey] : 10;
  const spellMod          = Math.floor((spellAbilityScore - 10) / 2);
  const spellDC           = 8 + prof + spellMod;
  const spellAttack       = prof + spellMod;

  const resolveSpellName = (id: string) => allSpells.find((s) => s.id === id)?.namePl ?? id;
  const cantrips = data.cantrips.map(resolveSpellName);
  const spells   = data.spells.map(resolveSpellName);

  // ── Wczytaj i wypełnij PDF ─────────────────────────────────────────────────
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form   = pdfDoc.getForm();

  // Strona 1 — Nagłówek
  set(form,  1, data.name);
  set(form,  2, `${cls?.name ?? data.class} ${data.level}`);
  set(form,  3, race?.name ?? data.race);
  set(form,  4, bg?.name ?? data.background ?? "");
  set(form,  5, ALIGNMENT_PL[data.alignment] ?? data.alignment);
  set(form,  6, data.userName);
  set(form,  7, String(data.experience));

  // Wartości cech
  set(form,  8, String(stats.strength));
  set(form,  9, String(stats.dexterity));
  set(form, 10, String(stats.constitution));
  set(form, 11, String(stats.intelligence));
  set(form, 12, String(stats.wisdom));
  set(form, 13, String(stats.charisma));

  // Statystyki bojowe
  set(form, 14, data.inspiration ? "★" : "");
  set(form, 15, `+${prof}`);
  set(form, 16, String(ac));
  set(form, 17, mod(stats.dexterity));
  set(form, 18, speed);
  set(form, 19, String(Math.max(1, maxHp)));
  set(form, 20, String(data.currentHp ?? Math.max(1, maxHp)));
  set(form, 21, String(data.tempHp ?? 0));
  set(form, 46, String(data.level));
  set(form, 47, `k${cls?.hitDie ?? 8}`);

  // Rzuty Obronne (22–27)
  statKeys.forEach((stat, i) => {
    const isProficient = saveProficiencies.includes(saveStatKeys[i]);
    set(form, 22 + i, skillMod(stats[stat], isProficient, prof));
    set(form, 130 + i, isProficient ? "●" : "");
  });

  // Umiejętności (28–45)
  SKILLS.forEach((skill, i) => {
    const isProficient = data.skills.includes(skill.dbKey);
    set(form, 28 + i, skillMod(stats[skill.stat], isProficient, prof));
    set(form, 136 + i, isProficient ? "●" : "");
  });

  set(form, 117, String(passivePerception));

  // Ataki
  if (data.attacks[0]) {
    set(form, 48, data.attacks[0].name);
    set(form, 49, data.attacks[0].atkBonus);
    set(form, 50, data.attacks[0].damage);
  }
  if (data.attacks[1]) {
    set(form, 51, data.attacks[1].name);
    set(form, 53, data.attacks[1].atkBonus);
    set(form, 55, data.attacks[1].damage);
  }
  if (data.attacks[2]) {
    set(form, 52, data.attacks[2].name);
    set(form, 54, data.attacks[2].atkBonus);
    set(form, 56, data.attacks[2].damage);
  }

  // Cechy Osobowości
  set(form, 57, personalityTraits);
  set(form, 58, ideals);
  set(form, 59, bonds);
  set(form, 60, flaws);
  set(form, 61, cls?.spellcasting
    ? `ST Czarów: ${spellDC} | Bonus Ataku: +${spellAttack}`
    : "");
  set(form, 62, bg
    ? `${bg.specialFeature.name}: ${bg.specialFeature.description}`
    : "");
  set(form, 63, profText);

  // Monety
  set(form, 64, "0");
  set(form, 65, "0");
  set(form, 66, "0");
  set(form, 67, String(data.gold ?? 0));
  set(form, 68, "0");
  set(form, 69, equipText);

  // Modyfikatory cech
  set(form, 124, mod(stats.strength));
  set(form, 125, mod(stats.dexterity));
  set(form, 126, mod(stats.constitution));
  set(form, 127, mod(stats.intelligence));
  set(form, 128, mod(stats.wisdom));
  set(form, 129, mod(stats.charisma));

  // Strona 2 — Informacje o postaci
  set(form, 70, data.name);
  set(form, 71, data.age    ? String(data.age)    : "");
  set(form, 72, data.eyeColor   ?? "");
  set(form, 73, data.height ? String(data.height) : "");
  set(form, 74, data.skinColor  ?? "");
  set(form, 75, data.weight ? String(data.weight) : "");
  set(form, 76, data.hairColor  ?? "");
  set(form, 77, data.description ?? "");
  set(form, 78, data.backstory   ?? "");
  set(form, 81, data.allies     ?? "");
  set(form, 83, bg
    ? `${bg.specialFeature.name}: ${bg.specialFeature.description}`
    : "");
  set(form, 84, data.treasure   ?? "");

  // Strona 3 — Magia
  if (cls?.spellcasting && spellAbilityKey) {
    const abilityLabels: Record<string, string> = { cha: "CHA", wis: "MĄD", int: "INT" };
    set(form, 85, cls.name);
    set(form, 86, abilityLabels[cls.spellcastingAbility ?? ""] ?? "");
    set(form, 87, String(spellDC));
    set(form, 88, spellAttack >= 0 ? `+${spellAttack}` : String(spellAttack));
    set(form, 89, cantrips.join("\n"));
    set(form, 92, spells.join("\n"));
  }

  // NeedAppearances: true — przeglądarka PDF sama wyrenderuje wygląd pól
  form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);
  return await pdfDoc.save({ updateFieldAppearances: false });
}
