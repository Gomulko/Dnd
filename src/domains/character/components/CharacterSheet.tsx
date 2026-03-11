"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CharacterFull } from "@/domains/character/actions/getCharacter";
import { updateCharacterHp } from "@/domains/character/actions/updateCharacterHp";
import { updateSessionNotes } from "@/domains/character/actions/updateSessionNotes";
import { updateInspiration } from "@/domains/character/actions/updateInspiration";
import { updateSpellSlots } from "@/domains/character/actions/updateSpellSlots";
import { CLASSES, SKILL_NAMES_PL } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { allSpells } from "@/data/dnd/spells";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardData } from "@/domains/character/store/wizardStore";
import { modNum, profBonus, maxHp } from "@/shared/lib/dnd-mechanics";

// Normalize skill key from hyphenated or camelCase to SKILL_NAMES_PL key
function normalizeSkillKey(raw: string): string {
  return raw.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

// Skill → ability mapping
const SKILL_ABILITY: Record<string, "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma"> = {
  acrobatics: "dexterity",
  arcana: "intelligence",
  athletics: "strength",
  deception: "charisma",
  history: "intelligence",
  insight: "wisdom",
  intimidation: "charisma",
  investigation: "intelligence",
  medicine: "wisdom",
  nature: "intelligence",
  perception: "wisdom",
  performance: "charisma",
  persuasion: "charisma",
  religion: "intelligence",
  sleightOfHand: "dexterity",
  stealth: "dexterity",
  survival: "wisdom",
  animalHandling: "wisdom",
};

// Skill → short ability label
const SKILL_ABILITY_SHORT: Record<string, string> = {
  acrobatics: "ZRR",
  arcana: "INT",
  athletics: "SIŁ",
  deception: "CHA",
  history: "INT",
  insight: "MĄD",
  intimidation: "CHA",
  investigation: "INT",
  medicine: "MĄD",
  nature: "INT",
  perception: "MĄD",
  performance: "CHA",
  persuasion: "CHA",
  religion: "INT",
  sleightOfHand: "ZRR",
  stealth: "ZRR",
  survival: "MĄD",
  animalHandling: "MĄD",
};

const STAT_LABELS: { key: "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma"; short: string; label: string; saveKey: string }[] = [
  { key: "strength", short: "SIŁA", label: "Siła", saveKey: "str" },
  { key: "dexterity", short: "ZRĘCZNOŚĆ", label: "Zręczność", saveKey: "dex" },
  { key: "constitution", short: "KONDYCJA", label: "Kondycja", saveKey: "con" },
  { key: "intelligence", short: "INTELEKT", label: "Intelekt", saveKey: "int" },
  { key: "wisdom", short: "MĄDROŚĆ", label: "Mądrość", saveKey: "wis" },
  { key: "charisma", short: "CHARYZMA", label: "Charyzma", saveKey: "cha" },
];

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwie Neutralny", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

// D&D 5e SRD — spell slots per class at level 1 for each spell level (1–9)
// Index = spell level - 1.  Level 1 characters only.
const SPELL_SLOTS_LVL1: Record<string, number[]> = {
  //              1  2  3  4  5  6  7  8  9
  bard:     [     2, 0, 0, 0, 0, 0, 0, 0, 0 ],
  cleric:   [     2, 0, 0, 0, 0, 0, 0, 0, 0 ],
  druid:    [     2, 0, 0, 0, 0, 0, 0, 0, 0 ],
  paladin:  [     0, 0, 0, 0, 0, 0, 0, 0, 0 ], // Paladin starts slots at level 2
  ranger:   [     0, 0, 0, 0, 0, 0, 0, 0, 0 ], // Ranger starts slots at level 2
  sorcerer: [     2, 0, 0, 0, 0, 0, 0, 0, 0 ],
  warlock:  [     1, 0, 0, 0, 0, 0, 0, 0, 0 ],
  wizard:   [     2, 0, 0, 0, 0, 0, 0, 0, 0 ],
};

// Shared style constants
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', Helvetica, sans-serif";
const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT_BORDER = "1px solid #cccccc";
const STRONG_BORDER = "1.5px solid #0a0a0a";

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_UI,
  fontWeight: 700,
  fontSize: 7,
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  color: MID,
  display: "block",
  marginBottom: 3,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_UI,
      fontWeight: 900,
      fontSize: 8,
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: BLACK,
      paddingBottom: 5,
      borderBottom: STRONG_BORDER,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function ProfDot({ filled }: { filled: boolean }) {
  return (
    <div style={{
      width: 9,
      height: 9,
      border: STRONG_BORDER,
      borderRadius: 0,
      background: filled ? BLACK : "transparent",
      flexShrink: 0,
    }} />
  );
}

// ── Main component ─────────────────────────────────────────────────────────

type Props = { character: CharacterFull };

export default function CharacterSheet({ character }: Props) {
  const router = useRouter();
  const { loadCharacter } = useWizardStore();

  // Cast to access new fields not yet in Prisma types
  const charExt = character as Record<string, unknown>;
  const inspiration = Boolean(charExt.inspiration ?? false);
  const [inspirationState, setInspirationState] = useState(inspiration);

  async function handleInspirationToggle() {
    const next = !inspirationState;
    setInspirationState(next);
    await updateInspiration(character.id, next);
  }

  // Spell slots used (from DB, default empty)
  const initialSlotsUsed: Record<string, number> = (() => {
    try { return JSON.parse((charExt.spellSlotsUsed as string) ?? "{}") as Record<string, number>; }
    catch { return {}; }
  })();
  const [slotsUsed, setSlotsUsed] = useState<Record<string, number>>(initialSlotsUsed);

  async function handleSlotToggle(level: number, idx: number, totalSlots: number) {
    const key = String(level);
    const used = slotsUsed[key] ?? 0;
    // Clicking used slot → restore; clicking free slot → use
    const next = idx < used ? used - 1 : Math.min(used + 1, totalSlots);
    const updated = { ...slotsUsed, [key]: next };
    setSlotsUsed(updated);
    await updateSpellSlots(character.id, updated);
  }

  function handleEdit() {
    const wizardData: WizardData = {
      step1: {
        name: character.name,
        gender: character.gender as WizardData["step1"]["gender"],
        age: character.age,
        height: character.height,
        description: character.description ?? "",
        alignment: character.alignment as WizardData["step1"]["alignment"],
      },
      step2: { race: character.race, subrace: character.subrace },
      step3: {
        class: character.class,
        subclass: character.subclass,
        skills: (() => { try { return JSON.parse(character.skills) as string[]; } catch { return []; } })(),
      },
      step4: {
        method: "standard",
        strength: character.strength,
        dexterity: character.dexterity,
        constitution: character.constitution,
        intelligence: character.intelligence,
        wisdom: character.wisdom,
        charisma: character.charisma,
      },
      step5: {
        background: character.background ?? "",
        personalityTraits: (() => { try { return JSON.parse(character.personalityTraits) as string[]; } catch { return []; } })(),
        ideals: (() => { try { return JSON.parse(character.ideals) as string[]; } catch { return []; } })(),
        bonds: (() => { try { return JSON.parse(character.bonds) as string[]; } catch { return []; } })(),
        flaws: (() => { try { return JSON.parse(character.flaws) as string[]; } catch { return []; } })(),
        languages: (() => { try { return JSON.parse(character.languages) as string[]; } catch { return []; } })(),
        backstory: character.backstory ?? "",
      },
      step6: {
        equipment: (() => { try { return JSON.parse(character.equipment) as { name: string; qty: number; weight: number }[]; } catch { return []; } })(),
        gold: character.gold,
      },
      step7: {
        cantrips: (() => { try { return JSON.parse(character.cantrips) as string[]; } catch { return []; } })(),
        spells: (() => { try { return JSON.parse(character.spells) as string[]; } catch { return []; } })(),
      },
    };
    loadCharacter(wizardData, character.id);
    router.push("/kreator/koncept");
  }

  const cls = CLASSES.find((c) => c.id === character.class);
  const race = RACES.find((r) => r.id === character.race);
  const bg = BACKGROUNDS.find((b) => b.id === character.background);
  const subclass = cls?.subclasses.find((s) => s.id === character.subclass);

  const prof = profBonus(character.level);
  const conMod = modNum(character.constitution);
  const dexMod = modNum(character.dexterity);
  const wisMod = modNum(character.wisdom);
  const intMod = modNum(character.intelligence);
  const chaMod = modNum(character.charisma);

  const hp = maxHp(cls?.hitDie ?? 8, character.level, conMod);
  const ac = 10 + dexMod;
  const speed = race?.speed ?? 30;
  const initiative = dexMod;

  // Parsed JSON fields
  const proficientSkills: string[] = (() => {
    try { return JSON.parse(character.skills) as string[]; } catch { return []; }
  })();
  const normalizedProfSkills = proficientSkills.map(normalizeSkillKey);

  const passivePerc = 10 + wisMod + (normalizedProfSkills.includes("perception") ? prof : 0);

  const savingThrowProficiencies: string[] = cls?.savingThrows ?? [];

  const resolveTraitIds = (raw: string, field: "personalityTraits" | "ideals" | "bonds" | "flaws"): string[] => {
    try {
      const ids = JSON.parse(raw) as string[];
      return ids.map((id) => bg?.[field].find((o) => o.id === id)?.text ?? id);
    } catch { return []; }
  };
  const personalityTraits = resolveTraitIds(character.personalityTraits, "personalityTraits");
  const ideals = resolveTraitIds(character.ideals, "ideals");
  const bonds = resolveTraitIds(character.bonds, "bonds");
  const flaws = resolveTraitIds(character.flaws, "flaws");

  const equipmentList: { name: string; qty: number; weight: number }[] = (() => {
    try { return JSON.parse(character.equipment) as { name: string; qty: number; weight: number }[]; } catch { return []; }
  })();

  const cantripIds: string[] = (() => {
    try { return JSON.parse(character.cantrips) as string[]; } catch { return []; }
  })();
  const spellIds: string[] = (() => {
    try { return JSON.parse(character.spells) as string[]; } catch { return []; }
  })();

  const languageList: string[] = (() => {
    try { return JSON.parse(character.languages ?? "[]") as string[]; } catch { return []; }
  })();

  const cantripData = cantripIds.map((id) => allSpells.find((s) => s.id === id)).filter(Boolean);
  const spellData = spellIds.map((id) => allSpells.find((s) => s.id === id)).filter(Boolean);

  const isSpellcaster = cls?.spellcasting ?? false;
  const spellAbilityMod = isSpellcaster
    ? cls?.spellcastingAbility === "wis" ? wisMod
      : cls?.spellcastingAbility === "int" ? intMod
      : chaMod
    : 0;
  const spellDC = 8 + prof + spellAbilityMod;
  const spellAttack = prof + spellAbilityMod;
  // SRD 5e: at level 1, only 1st-level slots (and cantrips = ∞)
  const classSlotsLvl1 = SPELL_SLOTS_LVL1[character.class] ?? [0,0,0,0,0,0,0,0,0];
  // slotsForLevel[i] = total slots for spell level (i+1) at character's level
  // For level-1 character, we use the level-1 table
  const slotsForSpellLevel = classSlotsLvl1;

  // Faza 4 extended fields
  const experience = Number(charExt.experience ?? 0);
  const weight = charExt.weight ? String(charExt.weight) : null;
  const eyeColor = charExt.eyeColor as string | null ?? null;
  const skinColor = charExt.skinColor as string | null ?? null;
  const hairColor = charExt.hairColor as string | null ?? null;
  const allies = charExt.allies as string | null ?? null;
  const treasure = charExt.treasure as string | null ?? null;
  const hitDiceUsed = Number(charExt.hitDiceUsed ?? 0);
  const attacksList: { name: string; atkBonus: string; damage: string }[] = (() => {
    try { return JSON.parse((charExt.attacks as string) ?? "[]") as { name: string; atkBonus: string; damage: string }[]; }
    catch { return []; }
  })();

  // Spellcasting ability label
  const spellAbilityLabel = cls?.spellcastingAbility === "wis" ? "Mądrość"
    : cls?.spellcastingAbility === "int" ? "Intelekt"
    : "Charyzma";

  // Death saves
  const deathSaves = (() => {
    try { return JSON.parse(character.deathSaves) as { successes: number; failures: number }; }
    catch { return { successes: 0, failures: 0 }; }
  })();

  // HP state (optimistic)
  const [currentHp, setCurrentHp] = useState(character.currentHp ?? hp);
  const [hpSaving, setHpSaving] = useState(false);
  const [hpError, setHpError] = useState<string | null>(null);

  async function changeHp(delta: number) {
    const next = Math.max(-99, Math.min(999, currentHp + delta));
    if (next === currentHp) return;
    setCurrentHp(next);
    setHpSaving(true);
    setHpError(null);
    const result = await updateCharacterHp(character.id, next);
    setHpSaving(false);
    if (result.error) {
      setCurrentHp(currentHp);
      setHpError(result.error);
    }
  }

  // Session notes with debounced auto-save
  const [notes, setNotes] = useState(character.sessionNotes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNotes = useCallback(
    async (value: string) => {
      await updateSessionNotes(character.id, value);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    },
    [character.id]
  );

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setNotes(value);
    setNotesSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNotes(value), 1000);
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const initials = character.name.trim().slice(0, 2).toUpperCase() || "??";

  // Attacks
  const attacksRaw = charExt.attacks;
  const attacks: { name: string; bonus: string; damage: string }[] = (() => {
    try {
      if (typeof attacksRaw === "string") return JSON.parse(attacksRaw) as { name: string; bonus: string; damage: string }[];
      return [];
    } catch { return []; }
  })();

  // Button base styles
  const btnOutline: React.CSSProperties = {
    background: "transparent",
    border: STRONG_BORDER,
    fontFamily: FONT_UI,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: BLACK,
    padding: "7px 14px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  const btnFilled: React.CSSProperties = {
    background: BLACK,
    border: STRONG_BORDER,
    fontFamily: FONT_UI,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#ffffff",
    padding: "7px 14px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ background: "#d8d8d8", minHeight: "100vh", padding: "24px", fontFamily: FONT_UI, color: BLACK }}>

      {/* ── Topbar ── */}
      <div style={{ maxWidth: 920, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Link
          href="/dashboard"
          data-testid="back-to-dashboard"
          style={btnOutline}
        >
          ← Moje Postacie
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            data-testid="edit-character-btn"
            onClick={handleEdit}
            style={btnOutline}
          >
            Edytuj Postać
          </button>
          <a
            href={`/api/export-pdf/${character.id}`}
            download
            data-testid="export-pdf-btn"
            style={btnFilled}
          >
            Eksportuj PDF
          </a>
        </div>
      </div>

      {/* ── Sheet ── */}
      <div style={{ background: "#ffffff", maxWidth: 920, margin: "0 auto 40px", border: STRONG_BORDER }}>

        {/* ── HEADER SECTION ── */}
        <div style={{ padding: "20px 24px", borderBottom: STRONG_BORDER }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end" }}>

            {/* Title block */}
            <div style={{ borderRight: STRONG_BORDER, paddingRight: 32, paddingBottom: 4 }}>
              <div style={{
                fontFamily: FONT_UI, fontWeight: 300, fontSize: 8,
                letterSpacing: "4px", textTransform: "uppercase", color: MID, marginBottom: 6,
              }}>
                Dungeons &amp; Dragons · 5e
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 400,
                letterSpacing: "-1.5px", lineHeight: 1, color: BLACK,
              }}>
                Karta Postaci
              </div>
            </div>

            {/* Fields grid */}
            <div>
              {/* Name line */}
              <div style={{ borderBottom: "2px solid " + BLACK, paddingBottom: 4, marginBottom: 14 }}>
                <span style={labelStyle}>Imię Postaci</span>
                <div
                  aria-label="Avatar postaci"
                  style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontStyle: "italic", color: BLACK, display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{
                    width: 28, height: 28, background: BLACK, color: "#fff",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT_DISPLAY, fontSize: 11, flexShrink: 0,
                  }}>
                    {initials}
                  </span>
                  {character.name}
                </div>
              </div>

              {/* Fields 3-col */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 24px" }}>
                {[
                  { label: "Klasa i Poziom", value: `${cls?.name ?? character.class} ${character.level}${subclass ? ` (${subclass.name})` : ""}` },
                  { label: "Rasa", value: race?.name ?? character.race },
                  { label: "Charakter", value: ALIGNMENT_PL[character.alignment] ?? character.alignment },
                  { label: "Tło", value: bg?.name ?? character.background ?? "—" },
                  { label: "PD", value: String(experience) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderBottom: LIGHT_BORDER, paddingBottom: 4 }}>
                    <span style={labelStyle}>{label}</span>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: BLACK }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY: 3-column ── */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 200px 1fr", borderBottom: STRONG_BORDER }}>

          {/* ══ COL A — Cechy ══ */}
          <div style={{ borderRight: STRONG_BORDER, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {STAT_LABELS.map(({ key, short, label }) => {
              const score = character[key];
              const m = modNum(score);
              const mStr = m >= 0 ? `+${m}` : `${m}`;
              return (
                <div
                  key={key}
                  aria-label={`${label}: ${score}`}
                  style={{ border: STRONG_BORDER, textAlign: "center", padding: "8px 6px 6px" }}
                >
                  <div style={{
                    fontFamily: FONT_UI, fontWeight: 900, fontSize: 7,
                    letterSpacing: "2px", textTransform: "uppercase", color: BLACK, marginBottom: 4,
                  }}>
                    {short}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontSize: 26, color: BLACK,
                    borderBottom: STRONG_BORDER, marginBottom: 5, paddingBottom: 2, letterSpacing: "-1px",
                  }}>
                    {score}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <span style={{ fontFamily: FONT_UI, fontSize: 8, fontWeight: 600, color: MID, letterSpacing: "1px", textTransform: "uppercase" }}>
                      mod
                    </span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: BLACK, borderBottom: LIGHT_BORDER, minWidth: 30, textAlign: "center" }}>
                      {mStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══ COL B — Saves & Skills ══ */}
          <div style={{ borderRight: STRONG_BORDER, padding: "20px 14px" }}>

            {/* Inspiracja + Premia Biegłości */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: STRONG_BORDER, marginBottom: 14 }}>
              <div
                style={{ padding: "8px 10px", textAlign: "center", borderRight: STRONG_BORDER, cursor: "pointer" }}
                onClick={handleInspirationToggle}
                title="Kliknij, aby przełączyć inspirację"
              >
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px",
                  borderBottom: LIGHT_BORDER, textAlign: "center", marginBottom: 4,
                  color: inspirationState ? BLACK : "#cccccc",
                }}>
                  ★
                </div>
                <span style={labelStyle}>Inspiracja</span>
              </div>
              <div style={{ padding: "8px 10px", textAlign: "center" }}>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px",
                  borderBottom: LIGHT_BORDER, textAlign: "center", marginBottom: 4,
                }}>
                  +{prof}
                </div>
                <span style={labelStyle}>Premia Biegłości</span>
              </div>
            </div>

            {/* Rzuty Obronne */}
            <SectionTitle>Rzuty Obronne</SectionTitle>
            <ul style={{ listStyle: "none", marginBottom: 14 }}>
              {STAT_LABELS.map(({ key, label, saveKey }) => {
                const isProficient = savingThrowProficiencies.includes(saveKey);
                const m = modNum(character[key]) + (isProficient ? prof : 0);
                const mStr = m >= 0 ? `+${m}` : `${m}`;
                return (
                  <li key={key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2.5px 0", borderBottom: "1px solid #eeeeee" }}>
                    <ProfDot filled={isProficient} />
                    <span style={{ width: 22, fontFamily: FONT_DISPLAY, fontSize: 11, textAlign: "center", borderBottom: LIGHT_BORDER, flexShrink: 0 }}>
                      {mStr}
                    </span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 400, color: "#1c1c1c", flex: 1, lineHeight: 1.2 }}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Umiejętności */}
            <SectionTitle>Umiejętności</SectionTitle>
            <ul style={{ listStyle: "none", marginBottom: 14 }}>
              {Object.entries(SKILL_NAMES_PL).map(([rawKey, namePl]) => {
                const isProficient = normalizedProfSkills.includes(rawKey);
                const abilityKey = SKILL_ABILITY[rawKey];
                const abilityScore = abilityKey ? character[abilityKey] : 10;
                const m = modNum(abilityScore) + (isProficient ? prof : 0);
                const mStr = m >= 0 ? `+${m}` : `${m}`;
                const attrShort = SKILL_ABILITY_SHORT[rawKey] ?? "";
                return (
                  <li key={rawKey} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2.5px 0", borderBottom: "1px solid #eeeeee" }}>
                    <ProfDot filled={isProficient} />
                    <span style={{ width: 22, fontFamily: FONT_DISPLAY, fontSize: 11, textAlign: "center", borderBottom: LIGHT_BORDER, flexShrink: 0 }}>
                      {mStr}
                    </span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 400, color: "#1c1c1c", flex: 1, lineHeight: 1.2 }}>
                      {namePl}{" "}
                      <em style={{ fontStyle: "italic", fontSize: 8, color: "#999999", fontWeight: 300 }}>({attrShort})</em>
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Bierna Percepcja */}
            <div style={{ border: STRONG_BORDER, display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginTop: 12 }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: "-1px", borderBottom: STRONG_BORDER, textAlign: "center", flexShrink: 0, minWidth: 38 }}>
                {passivePerc}
              </span>
              <span style={labelStyle}>Bierna Percepcja</span>
            </div>
          </div>

          {/* ══ COL C — Combat + HP + Attacks + Personality ══ */}
          <div style={{ padding: "20px 16px" }}>

            {/* AC | Init | Speed */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: STRONG_BORDER, marginBottom: 14 }}>
              {[
                { label: "Klasa Pancerza", value: ac, ariaLabel: "Klasa Pancerza" },
                { label: "Inicjatywa", value: initiative >= 0 ? `+${initiative}` : `${initiative}`, ariaLabel: "Inicjatywa" },
                { label: "Prędkość ruchu", value: `${Math.round(speed * 0.3)} m`, ariaLabel: "Prędkość ruchu" },
              ].map(({ label, value, ariaLabel }, idx) => (
                <div
                  key={label}
                  aria-label={ariaLabel}
                  style={{
                    textAlign: "center", padding: "8px 6px",
                    borderRight: idx < 2 ? STRONG_BORDER : "none",
                  }}
                >
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: "-1px", borderBottom: LIGHT_BORDER, textAlign: "center", marginBottom: 4 }}>
                    {value}
                  </div>
                  <span style={labelStyle}>{label}</span>
                </div>
              ))}
            </div>

            {/* Bonus biegłości — hidden but accessible */}
            <div aria-label="Bonus biegłości" style={{ display: "none" }}>+{prof}</div>

            {/* HP Block */}
            <div style={{ border: STRONG_BORDER, marginBottom: 14 }}>
              {/* Max HP row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: STRONG_BORDER }}>
                <div style={{ padding: "6px 10px", borderRight: STRONG_BORDER }}>
                  <span style={labelStyle}>Maksymalne PT</span>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: "-0.5px", borderBottom: LIGHT_BORDER, height: 30, display: "flex", alignItems: "flex-end" }}>
                    {hp}
                  </div>
                </div>
                <div style={{ padding: "6px 10px" }}>
                  <span style={labelStyle}>Tymczasowe PT</span>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: "-0.5px", borderBottom: LIGHT_BORDER, height: 30, display: "flex", alignItems: "flex-end" }}>
                    {character.tempHp ?? 0}
                  </div>
                </div>
              </div>

              {/* Current HP row */}
              <div style={{ padding: "10px 12px" }}>
                <span style={labelStyle}>Bieżące Punkty Trafienia</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <button
                    aria-label="Zmniejsz HP"
                    onClick={() => changeHp(-1)}
                    disabled={hpSaving || currentHp <= -99}
                    style={{
                      width: 32, height: 32, border: STRONG_BORDER,
                      background: "transparent", color: BLACK,
                      fontFamily: FONT_DISPLAY, fontSize: 20,
                      cursor: hpSaving || currentHp <= -99 ? "not-allowed" : "pointer",
                      opacity: currentHp <= -99 ? 0.3 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    −
                  </button>
                  <div
                    data-testid="current-hp"
                    style={{
                      fontFamily: FONT_DISPLAY, fontSize: 48, color: BLACK,
                      letterSpacing: "-2px", lineHeight: 1, flex: 1, textAlign: "center",
                      borderBottom: STRONG_BORDER,
                    }}
                  >
                    {currentHp}
                  </div>
                  <button
                    aria-label="Zwiększ HP"
                    onClick={() => changeHp(1)}
                    disabled={hpSaving || currentHp >= 999}
                    style={{
                      width: 32, height: 32, border: STRONG_BORDER,
                      background: "transparent", color: BLACK,
                      fontFamily: FONT_DISPLAY, fontSize: 20,
                      cursor: hpSaving || currentHp >= 999 ? "not-allowed" : "pointer",
                      opacity: currentHp >= 999 ? 0.3 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 9, color: MID, marginTop: 2, textAlign: "center" }}>
                  / {hp} max
                  {hpSaving && " · Zapisywanie..."}
                  {hpError && ` · ${hpError}`}
                </div>
              </div>
            </div>

            {/* Hit Dice + Death Saves */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {/* Hit Dice */}
              <div style={{ border: STRONG_BORDER, padding: "8px 10px" }}>
                <SectionTitle>Kość Trafień</SectionTitle>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, letterSpacing: "-1px", color: BLACK }}>
                    k{cls?.hitDie ?? 8}
                  </div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 8, color: MID, marginTop: 2 }}>
                    {character.level}× do dyspozycji
                  </div>
                </div>
              </div>

              {/* Death Saves */}
              <div style={{ border: STRONG_BORDER, padding: "8px 10px" }}>
                <SectionTitle>Rzuty Śmierci</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                  {(["Sukcesy", "Porażki"] as const).map((lbl) => {
                    const isSuccess = lbl === "Sukcesy";
                    const count = isSuccess ? deathSaves.successes : deathSaves.failures;
                    return (
                      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 7, letterSpacing: "1.5px", textTransform: "uppercase", width: 50 }}>
                          {lbl}
                        </span>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              style={{
                                width: 10, height: 10,
                                border: STRONG_BORDER,
                                borderRadius: isSuccess ? "50%" : 2,
                                background: i < count ? BLACK : "transparent",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attacks table */}
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Ataki i Zaklęcia</SectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: STRONG_BORDER }}>
                    {["Broń / Zaklęcie", "Premia ATK", "Obrażenia"].map((h) => (
                      <th key={h} style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 7, letterSpacing: "2px", textTransform: "uppercase", color: MID, textAlign: "left", padding: "0 0 5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attacks.length > 0 ? attacks.map((atk, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #eeeeee" }}>
                      <td style={{ padding: "3px 0", fontFamily: FONT_UI, fontSize: 11 }}>{atk.name}</td>
                      <td style={{ padding: "3px 0", fontFamily: FONT_UI, fontSize: 11 }}>{atk.bonus}</td>
                      <td style={{ padding: "3px 0", fontFamily: FONT_UI, fontSize: 11 }}>{atk.damage}</td>
                    </tr>
                  )) : (
                    // empty rows placeholder
                    [0, 1, 2].map((i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #eeeeee" }}>
                        <td style={{ padding: "6px 0", fontFamily: FONT_UI, fontSize: 11, color: "#cccccc" }}>—</td>
                        <td style={{ padding: "6px 0" }} />
                        <td style={{ padding: "6px 0" }} />
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Personality traits */}
            <div style={{ border: STRONG_BORDER, marginTop: 14 }}>
              {[
                { label: "Cechy Osobowości", items: personalityTraits },
                { label: "Ideały", items: ideals },
                { label: "Więzy", items: bonds },
                { label: "Słabości", items: flaws },
              ].map(({ label, items }, idx, arr) => (
                <div
                  key={label}
                  style={{ padding: "7px 10px", borderBottom: idx < arr.length - 1 ? STRONG_BORDER : "none" }}
                >
                  <span style={labelStyle}>{label}</span>
                  <div style={{
                    fontFamily: FONT_UI, fontSize: 11, lineHeight: "18px",
                    minHeight: 44, color: items.length > 0 ? BLACK : "#cccccc",
                  }}>
                    {items.length > 0 ? items.join(" / ") : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM: 3-column ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: STRONG_BORDER }}>

          {/* Biegłości i Języki */}
          <div style={{ padding: "16px 16px", borderRight: STRONG_BORDER }}>
            <SectionTitle>Biegłości i Języki</SectionTitle>
            <div style={{
              width: "100%", minHeight: 140,
              fontFamily: FONT_UI, fontSize: 11, color: BLACK,
              lineHeight: "22px",
              backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 21px, #d8d8d8 21px, #d8d8d8 22px)",
              backgroundAttachment: "local",
            }}>
              {languageList.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ ...labelStyle, display: "inline" }}>Języki: </span>
                  {languageList.join(", ")}
                </div>
              )}
              {cls?.armorTraining && cls.armorTraining.length > 0 && (
                <div>
                  <span style={{ ...labelStyle, display: "inline" }}>Zbroje: </span>
                  {cls.armorTraining.join(", ")}
                </div>
              )}
              {cls?.weaponProficiencies && (
                <div>
                  <span style={{ ...labelStyle, display: "inline" }}>Broń: </span>
                  {cls.weaponProficiencies}
                </div>
              )}
            </div>
          </div>

          {/* Wyposażenie */}
          <div style={{ padding: "16px 16px", borderRight: STRONG_BORDER }}>
            <SectionTitle>Wyposażenie</SectionTitle>
            <div style={{
              width: "100%", minHeight: 140,
              fontFamily: FONT_UI, fontSize: 11, color: BLACK,
              lineHeight: "22px",
              backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 21px, #d8d8d8 21px, #d8d8d8 22px)",
              backgroundAttachment: "local",
            }}>
              {equipmentList.length === 0 ? (
                <span style={{ color: "#cccccc" }}>Brak ekwipunku</span>
              ) : (
                equipmentList.map((item, i) => (
                  <div key={i}>
                    {item.name}{item.qty > 1 ? ` ×${item.qty}` : ""}
                  </div>
                ))
              )}
            </div>
            <div style={{ borderTop: LIGHT_BORDER, marginTop: 8, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={labelStyle}>Złoto (szt.)</span>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: BLACK }}>{character.gold}</span>
            </div>
          </div>

          {/* Korzyści i Zdolności */}
          <div style={{ padding: "16px 16px" }}>
            <SectionTitle>Korzyści i Zdolności</SectionTitle>
            <div style={{
              width: "100%", minHeight: 140,
              fontFamily: FONT_UI, fontSize: 11, color: BLACK,
              lineHeight: "22px",
              backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 21px, #d8d8d8 21px, #d8d8d8 22px)",
              backgroundAttachment: "local",
            }}>
              {bg?.specialFeature && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ ...labelStyle, display: "inline" }}>{bg.specialFeature.name}: </span>
                  {bg.specialFeature.description}
                </div>
              )}
              {isSpellcaster && (
                <div>
                  <span style={{ ...labelStyle, display: "inline" }}>Rzucanie czarów: </span>
                  ST {spellDC} / Atak +{spellAttack}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SPELLS SECTION (spellcasters only) ── */}
        {isSpellcaster && (
          <div style={{ borderBottom: STRONG_BORDER }}>
            {/* Spell header row */}
            <div style={{ padding: "14px 24px", borderBottom: STRONG_BORDER, display: "flex", gap: 32, alignItems: "center" }}>
              <div>
                <span style={labelStyle}>ST Czarów</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px" }}>{spellDC}</div>
              </div>
              <div>
                <span style={labelStyle}>Premia do Ataku</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px" }}>+{spellAttack}</div>
              </div>
              <div>
                <span style={labelStyle}>Sloty Poz. 1</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px" }}>{slotsForSpellLevel[0] ?? 0}</div>
              </div>
              <div>
                <span style={labelStyle}>Atrybut Czarowania</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-1px", textTransform: "uppercase" }}>
                  {cls?.spellcastingAbility?.toUpperCase() ?? "—"}
                </div>
              </div>
            </div>

            {/* Cantrips + Spells */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: STRONG_BORDER }}>
              {/* Cantrips */}
              <div style={{ padding: "14px 12px", borderRight: STRONG_BORDER }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, borderBottom: STRONG_BORDER, paddingBottom: 4, marginBottom: 5 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1, letterSpacing: "-1px" }}>0</span>
                  <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 8, letterSpacing: "2px", textTransform: "uppercase", color: MID }}>Sztuczki</span>
                </div>
                {cantripData.map((spell) => spell && (
                  <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0", borderBottom: "1px solid #eeeeee" }}>
                    <span style={{ fontFamily: FONT_UI, fontSize: 10, color: BLACK }}>{spell.namePl}</span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 8, color: MID }}>{spell.castingTime}</span>
                  </div>
                ))}
              </div>

              {/* Level 1 spells */}
              <div style={{ padding: "14px 12px", borderRight: STRONG_BORDER }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, borderBottom: STRONG_BORDER, paddingBottom: 4, marginBottom: 5 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1, letterSpacing: "-1px" }}>1</span>
                  <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 8, letterSpacing: "2px", textTransform: "uppercase", color: MID }}>Poziom</span>
                  <span style={{ marginLeft: "auto", fontFamily: FONT_UI, fontSize: 8, color: MID }}>{slotsForSpellLevel[0] ?? 0} slotów</span>
                </div>
                {spellData.map((spell) => spell && (
                  <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0", borderBottom: "1px solid #eeeeee" }}>
                    <span style={{ fontFamily: FONT_UI, fontSize: 10, color: BLACK }}>{spell.namePl}</span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 8, color: MID }}>{spell.castingTime}</span>
                  </div>
                ))}
              </div>

              {/* Empty col 3 */}
              <div style={{ padding: "14px 12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, borderBottom: STRONG_BORDER, paddingBottom: 4, marginBottom: 5 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1, letterSpacing: "-1px" }}>2</span>
                  <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 8, letterSpacing: "2px", textTransform: "uppercase", color: MID }}>Poziom</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES SECTION ── */}
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <SectionTitle>Notatki Sesji</SectionTitle>
            {notesSaved && (
              <span style={{ fontFamily: FONT_UI, fontSize: 8, color: MID, letterSpacing: "1px" }}>
                ✓ Zapisano
              </span>
            )}
          </div>
          <textarea
            aria-label="Notatki sesji"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Zapisz notatki z sesji..."
            maxLength={5000}
            rows={6}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: FONT_UI,
              fontSize: 12,
              color: BLACK,
              resize: "none",
              lineHeight: "22px",
              padding: "2px 0",
              boxSizing: "border-box",
              backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 21px, #d8d8d8 21px, #d8d8d8 22px)",
              backgroundAttachment: "local",
            }}
          />
          <div style={{ fontFamily: FONT_UI, fontSize: 8, color: "#cccccc", textAlign: "right", marginTop: 4 }}>
            {notes.length}/5000
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PAGE DIVIDER — Strona 2
        ════════════════════════════════════════════════════════════════════ */}
        <div className="page-divider" style={{ margin: "0 24px" }}>
          <span>Strona 2 — Historia</span>
        </div>

        {/* ── STRONA 2: HISTORIA ── */}
        {/* Physical appearance */}
        <div style={{ padding: "16px 24px", borderBottom: LIGHT_BORDER }}>
          <SectionTitle>Wygląd Fizyczny</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {[
              { label: "Wiek", value: character.age ? `${character.age} lat` : "—" },
              { label: "Wzrost", value: character.height ? `${character.height} cm` : "—" },
              { label: "Waga", value: weight ? `${weight} kg` : "—" },
              { label: "Kolor Oczu", value: eyeColor ?? "—" },
              { label: "Kolor Skóry", value: skinColor ?? "—" },
              { label: "Kolor Włosów", value: hairColor ?? "—" },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ padding: "10px 12px", borderRight: i % 3 < 2 ? LIGHT_BORDER : "none", borderBottom: i < 3 ? LIGHT_BORDER : "none" }}>
                <span className="label">{label}</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: BLACK }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Backstory + appearance description */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "16px 24px", gap: 24, borderBottom: LIGHT_BORDER }}>
          <div>
            <SectionTitle>Historia Postaci</SectionTitle>
            <p style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
              {character.backstory || character.description || "—"}
            </p>
          </div>
          <div>
            <SectionTitle>Sojusznicy i Organizacje</SectionTitle>
            <p style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
              {allies || "—"}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "16px 24px", gap: 24 }}>
          <div>
            <SectionTitle>Majątek</SectionTitle>
            <p style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
              {treasure || "—"}
            </p>
          </div>
          <div>
            <SectionTitle>Punkty Doświadczenia</SectionTitle>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: BLACK }}>{experience}</div>
            <span style={{ fontFamily: FONT_UI, fontSize: 7, color: MID, letterSpacing: "2px", textTransform: "uppercase" }}>PD</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PAGE DIVIDER — Strona 3 (tylko dla czarujących)
        ════════════════════════════════════════════════════════════════════ */}
        {isSpellcaster && (
          <>
            <div className="page-divider" style={{ margin: "0 24px" }}>
              <span>Strona 3 — Zaklęcia</span>
            </div>

            {/* Spell header row */}
            <div style={{ padding: "16px 24px", borderBottom: LIGHT_BORDER }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
                {[
                  { label: "Klasa Zaklęć", value: cls?.name ?? character.class },
                  { label: "Cecha Bazowa", value: spellAbilityLabel },
                  { label: "ST Czarów", value: String(spellDC) },
                  { label: "Premia Ataku", value: spellAttack >= 0 ? `+${spellAttack}` : `${spellAttack}` },
                ].map(({ label, value }, i) => (
                  <div key={label} style={{ padding: "10px 12px", borderRight: i < 3 ? LIGHT_BORDER : "none", textAlign: "center" }}>
                    <span className="label">{label}</span>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: BLACK }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cantrips (level 0) */}
            <div style={{ padding: "16px 24px", borderBottom: LIGHT_BORDER }}>
              <SectionTitle>Sztuczki (Poziom 0)</SectionTitle>
              {cantripData.length === 0 ? (
                <p style={{ fontFamily: FONT_UI, fontSize: 11, color: MID }}>Brak sztuczek</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 24px" }}>
                  {cantripData.map((spell) => spell && (
                    <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: LIGHT_BORDER, padding: "3px 0" }}>
                      <span style={{ fontFamily: FONT_UI, fontSize: 11, color: BLACK }}>{spell.namePl}</span>
                      <span style={{ fontFamily: FONT_UI, fontSize: 9, color: MID }}>{spell.castingTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spell levels 1–9 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 24px", gap: 0 }}>
              {[0, 1, 2].map((colIdx) => (
                <div key={colIdx} style={{ borderRight: colIdx < 2 ? LIGHT_BORDER : "none", paddingRight: colIdx < 2 ? 16 : 0, paddingLeft: colIdx > 0 ? 16 : 0 }}>
                  {/* Spell levels in this column: col0=1-3, col1=4-6, col2=7-9 */}
                  {[1, 2, 3].map((offset) => {
                    const spellLevel = colIdx * 3 + offset; // 1,2,3 / 4,5,6 / 7,8,9
                    const totalSlots = slotsForSpellLevel[spellLevel - 1] ?? 0;
                    const usedSlots = slotsUsed[String(spellLevel)] ?? 0;
                    const levelSpells = spellData.filter((s) => s && s.level === spellLevel);
                    return (
                      <div key={spellLevel} style={{ marginBottom: 16 }}>
                        {/* Level header */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, borderBottom: "1.5px solid #0a0a0a", paddingBottom: 4 }}>
                          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: BLACK, lineHeight: 1 }}>{spellLevel}</span>
                          <span style={{ fontFamily: FONT_UI, fontSize: 7, color: MID, letterSpacing: "2px", textTransform: "uppercase" }}>
                            poziom · Sloty: {totalSlots}
                          </span>
                        </div>
                        {/* Slot dots */}
                        {totalSlots > 0 && (
                          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                            {Array.from({ length: totalSlots }).map((_, i) => (
                              <button
                                key={i}
                                title={i < usedSlots ? "Przywróć slot" : "Użyj slotu"}
                                onClick={() => handleSlotToggle(spellLevel, i, totalSlots)}
                                style={{
                                  width: 12, height: 12,
                                  border: "1.5px solid #0a0a0a",
                                  background: i < usedSlots ? "#0a0a0a" : "transparent",
                                  cursor: "pointer",
                                  padding: 0,
                                  transition: "background 0.1s",
                                }}
                                aria-label={`Slot ${spellLevel} poz. ${i + 1}`}
                              />
                            ))}
                          </div>
                        )}
                        {/* Spells */}
                        {levelSpells.length === 0 ? (
                          <div style={{ borderBottom: LIGHT_BORDER, padding: "2px 0", minHeight: 20 }} />
                        ) : (
                          levelSpells.map((spell) => spell && (
                            <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: LIGHT_BORDER, padding: "2px 0" }}>
                              <span style={{ fontFamily: FONT_UI, fontSize: 10, color: BLACK }}>{spell.namePl}</span>
                              <span style={{ fontFamily: FONT_UI, fontSize: 8, color: MID }}>{spell.castingTime}</span>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
