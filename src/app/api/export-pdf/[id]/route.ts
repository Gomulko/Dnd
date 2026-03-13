import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, PDFName, PDFBool } from "pdf-lib";
import fs from "fs";
import path from "path";
import { auth } from "@/shared/lib/auth";
import { getCharacter } from "@/domains/character/actions/getCharacter";
import { CLASSES } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { allSpells } from "@/data/dnd/spells";

// ── Stałe ─────────────────────────────────────────────────────────────────────

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry",    NG: "Neutralny Dobry",    CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwie Neutralny", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły",      NE: "Neutralny Zły",       CE: "Chaotyczny Zły",
};

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

// Ustaw pole po indeksie (0-based) zamiast po nazwie
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

// Indeks = debug ID - 1
function set(
  form: ReturnType<PDFDocument["getForm"]>,
  debugId: number,
  value: string
) {
  setByIndex(form, debugId - 1, value);
}

// ── Definicje umiejętności (kolejność zgodna z PDF) ───────────────────────────

type SkillDef = {
  stat: "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";
  dbKey: string;
};

// ID 28–45 = indeksy 27–44 = Text29–Text46
const SKILLS: SkillDef[] = [
  { stat: "dexterity",    dbKey: "acrobatics" },    // 28 Akrobatyka
  { stat: "strength",     dbKey: "athletics" },      // 29 Atletyka
  { stat: "intelligence", dbKey: "history" },        // 30 Historia
  { stat: "wisdom",       dbKey: "insight" },        // 31 Intuicja
  { stat: "wisdom",       dbKey: "medicine" },       // 32 Medycyna
  { stat: "wisdom",       dbKey: "animalHandling" }, // 33 Opieka nad zwierzętami
  { stat: "charisma",     dbKey: "deception" },      // 34 Oszustwo
  { stat: "wisdom",       dbKey: "perception" },     // 35 Percepcja
  { stat: "charisma",     dbKey: "persuasion" },     // 36 Perswazja
  { stat: "intelligence", dbKey: "nature" },         // 37 Przyroda
  { stat: "intelligence", dbKey: "religion" },       // 38 Religia
  { stat: "dexterity",    dbKey: "stealth" },        // 39 Skradanie się
  { stat: "wisdom",       dbKey: "survival" },       // 40 Sztuka przetrwania
  { stat: "intelligence", dbKey: "investigation" },  // 41 Śledztwo
  { stat: "intelligence", dbKey: "arcana" },         // 42 Wiedza tajemna
  { stat: "charisma",     dbKey: "performance" },    // 43 Występy
  { stat: "charisma",     dbKey: "intimidation" },   // 44 Zastraszanie
  { stat: "dexterity",    dbKey: "sleightOfHand" },  // 45 Zwinne dłonie
];

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) {
    return NextResponse.json({ error: "Postać nie istnieje" }, { status: 404 });
  }

  // ── Obliczenia ────────────────────────────────────────────────────────────
  const prof  = profBonus(character.level);
  const cls   = CLASSES.find((c) => c.id === character.class);
  const race  = RACES.find((r) => r.id === character.race);
  const bg    = BACKGROUNDS.find((b) => b.id === character.background);

  const stats = {
    strength:     character.strength,
    dexterity:    character.dexterity,
    constitution: character.constitution,
    intelligence: character.intelligence,
    wisdom:       character.wisdom,
    charisma:     character.charisma,
  };

  const dexMod = Math.floor((stats.dexterity - 10) / 2);
  const conMod = Math.floor((stats.constitution - 10) / 2);
  const wisMod = Math.floor((stats.wisdom - 10) / 2);
  const maxHp  = (cls?.hitDie ?? 8) + conMod;
  const ac     = 10 + dexMod;
  const speedFt = race?.speed ?? 30;
  const speed   = `${Math.round(speedFt * 0.3)}m`;

  const skills          = JSON.parse(character.skills || "[]") as string[];
  const saveProficiencies = cls?.savingThrows ?? [];
  const saveStatKeys    = ["str", "dex", "con", "int", "wis", "cha"] as const;

  // Pasywna percepcja
  const passivePerception = 10 + wisMod + (skills.includes("perception") ? prof : 0);

  // Rzuty obronne
  const statKeys: Array<keyof typeof stats> = [
    "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma",
  ];

  // Ataki
  type Attack = { name: string; atkBonus: string; damage: string };
  const attacks: Attack[] = JSON.parse(character.attacks || "[]");

  // Cechy osobowości — zamień ID na tekst z danych tła
  function resolveIds(jsonStr: string | null, pool: { id: string; text: string }[]): string {
    const ids = JSON.parse(jsonStr || "[]") as string[];
    return ids
      .map((id) => pool.find((o) => o.id === id)?.text ?? id)
      .join("\n");
  }
  const personalityTraits = resolveIds(character.personalityTraits, bg?.personalityTraits ?? []);
  const ideals  = resolveIds(character.ideals,  bg?.ideals  ?? []);
  const bonds   = resolveIds(character.bonds,   bg?.bonds   ?? []);
  const flaws   = resolveIds(character.flaws,   bg?.flaws   ?? []);
  const languages = (JSON.parse(character.languages || "[]") as string[]).join(", ");

  // Ekwipunek
  type EquipItem = { name: string; qty: number };
  const equipItems: EquipItem[] = JSON.parse(character.equipment || "[]");
  const equipText = equipItems.map((e) => `${e.name}${e.qty > 1 ? ` ×${e.qty}` : ""}`).join("\n");

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
  const cantripIds = JSON.parse(character.cantrips || "[]") as string[];
  const spellIds   = JSON.parse(character.spells   || "[]") as string[];
  const resolveSpellName = (id: string) => allSpells.find((s) => s.id === id)?.namePl ?? id;
  const cantrips = cantripIds.map(resolveSpellName);
  const spells   = spellIds.map(resolveSpellName);

  // ── Wczytaj szablon PDF ───────────────────────────────────────────────────
  const templatePath  = path.join(process.cwd(), "public", "character-sheet-template.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc        = await PDFDocument.load(templateBytes);
  const form          = pdfDoc.getForm();

  // ── Strona 1 — Nagłówek ───────────────────────────────────────────────────
  set(form,  1, character.name);
  set(form,  2, `${cls?.name ?? character.class} ${character.level}`);
  set(form,  3, race?.name ?? character.race);
  set(form,  4, bg?.name ?? character.background ?? "");
  set(form,  5, ALIGNMENT_PL[character.alignment] ?? character.alignment);
  set(form,  6, session.user.name ?? "");
  set(form,  7, String(character.experience ?? 0));

  // ── Strona 1 — Wartości cech ──────────────────────────────────────────────
  set(form,  8, String(stats.strength));
  set(form,  9, String(stats.dexterity));
  set(form, 10, String(stats.constitution));
  set(form, 11, String(stats.intelligence));
  set(form, 12, String(stats.wisdom));
  set(form, 13, String(stats.charisma));

  // ── Strona 1 — Statystyki bojowe ─────────────────────────────────────────
  set(form, 14, character.inspiration ? "★" : "");
  set(form, 15, `+${prof}`);
  set(form, 16, String(ac));
  set(form, 17, mod(stats.dexterity));               // Inicjatywa
  set(form, 18, speed);
  set(form, 19, String(Math.max(1, maxHp)));         // Max HP
  set(form, 20, String(character.currentHp ?? Math.max(1, maxHp)));
  set(form, 21, String(character.tempHp ?? 0));
  set(form, 46, String(character.level));            // Hit dice łącznie
  set(form, 47, `k${cls?.hitDie ?? 8}`);             // Hit dice typ

  // ── Strona 1 — Rzuty Obronne (22–27) ─────────────────────────────────────
  statKeys.forEach((stat, i) => {
    const isProficient = saveProficiencies.includes(saveStatKeys[i]);
    set(form, 22 + i, skillMod(stats[stat], isProficient, prof));
    // Checkboxy proficiency rzutów obronnych: ID 130–135
    set(form, 130 + i, isProficient ? "●" : "");
  });

  // ── Strona 1 — Umiejętności (28–45) ──────────────────────────────────────
  SKILLS.forEach((skill, i) => {
    const isProficient = skills.includes(skill.dbKey);
    set(form, 28 + i, skillMod(stats[skill.stat], isProficient, prof));
    // Checkboxy proficiency umiejętności: ID 136–153
    set(form, 136 + i, isProficient ? "●" : "");
  });

  // Pasywna Percepcja
  set(form, 117, String(passivePerception));

  // ── Strona 1 — Ataki ─────────────────────────────────────────────────────
  // Broń 1
  if (attacks[0]) {
    set(form, 48, attacks[0].name);
    set(form, 49, attacks[0].atkBonus);
    set(form, 50, attacks[0].damage);
  }
  // Broń 2
  if (attacks[1]) {
    set(form, 51, attacks[1].name);
    set(form, 53, attacks[1].atkBonus);
    set(form, 55, attacks[1].damage);
  }
  // Broń 3
  if (attacks[2]) {
    set(form, 52, attacks[2].name);
    set(form, 54, attacks[2].atkBonus);
    set(form, 56, attacks[2].damage);
  }

  // ── Strona 1 — Cechy Osobowości ──────────────────────────────────────────
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

  // ── Strona 1 — Monety ────────────────────────────────────────────────────
  set(form, 64, "0");                         // Miedź
  set(form, 65, "0");                         // Srebro
  set(form, 66, "0");                         // Elektron
  set(form, 67, String(character.gold ?? 0)); // Złoto
  set(form, 68, "0");                         // Platyna
  set(form, 69, equipText);                   // Wyposażenie

  // ── Strona 1 — Modyfikatory cech ─────────────────────────────────────────
  set(form, 124, mod(stats.strength));
  set(form, 125, mod(stats.dexterity));
  set(form, 126, mod(stats.constitution));
  set(form, 127, mod(stats.intelligence));
  set(form, 128, mod(stats.wisdom));
  set(form, 129, mod(stats.charisma));

  // ── Strona 2 — Informacje o postaci ──────────────────────────────────────
  set(form, 70, character.name);
  set(form, 71, character.age    ? String(character.age)    : "");
  set(form, 72, character.eyeColor   ?? "");
  set(form, 73, character.height ? String(character.height) : "");
  set(form, 74, character.skinColor  ?? "");
  set(form, 75, character.weight ? String(character.weight) : "");
  set(form, 76, character.hairColor  ?? "");
  set(form, 77, character.description ?? "");  // wygląd postaci
  set(form, 78, character.backstory   ?? "");  // historia postaci
  set(form, 81, character.allies     ?? "");   // organizacje i sojusznicy
  set(form, 83, bg
    ? `${bg.specialFeature.name}: ${bg.specialFeature.description}`
    : "");                                      // pozostałe korzyści
  set(form, 84, character.treasure   ?? "");   // majątek

  // ── Strona 3 — Magia (jeśli klasa rzuca zaklęcia) ────────────────────────
  if (cls?.spellcasting && spellAbilityKey) {
    const abilityLabels: Record<string, string> = { cha: "CHA", wis: "MĄD", int: "INT" };
    set(form, 85, cls.name);                                          // klasa rzucającego
    set(form, 86, abilityLabels[cls.spellcastingAbility ?? ""] ?? ""); // cecha bazowa
    set(form, 87, String(spellDC));                                   // ST czarów
    set(form, 88, spellAttack >= 0 ? `+${spellAttack}` : String(spellAttack)); // premia ataku
    set(form, 89, cantrips.join("\n"));                               // sztuczki
    set(form, 92, spells.join("\n"));                                 // czary poz. 1
  }

  // ── Zapisz ────────────────────────────────────────────────────────────────
  // NeedAppearances: true — przeglądarka PDF sama wyrenderuje wygląd pól (obsługuje polskie znaki)
  // updateFieldAppearances: false — pdf-lib nie próbuje sam generować (nie obsługuje UTF-8)
  form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);
  const pdfBytes = await pdfDoc.save({ updateFieldAppearances: false });

  const safeName = (character.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_") || "karta");

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_karta.pdf"; filename*=UTF-8''${encodeURIComponent(`${character.name.replace(/\s+/g, "_")}_karta.pdf`)}`,
      "Content-Length": pdfBytes.byteLength.toString(),
    },
  });
}
