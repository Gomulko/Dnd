"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CharacterFull } from "@/domains/character/actions/getCharacter";
import { updateCharacterHp } from "@/domains/character/actions/updateCharacterHp";
import { updateSessionNotes } from "@/domains/character/actions/updateSessionNotes";
import { CLASSES, SKILL_NAMES_PL } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { allSpells } from "@/data/dnd/spells";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardData } from "@/domains/character/store/wizardStore";

// ── Helpers ────────────────────────────────────────────────────────────────

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function modNum(score: number): number {
  return Math.floor((score - 10) / 2);
}

function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function maxHp(hitDie: number, level: number, conMod: number): number {
  const first = hitDie + conMod;
  const subsequent = (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
  return Math.max(1, first + subsequent);
}

// Normalize skill key from hyphenated or camelCase to SKILL_NAMES_PL key
function normalizeSkillKey(raw: string): string {
  return raw.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
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

const STAT_LABELS: { key: "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma"; short: string; label: string; saveKey: string }[] = [
  { key: "strength", short: "SIŁ", label: "Siła", saveKey: "str" },
  { key: "dexterity", short: "ZRR", label: "Zręczność", saveKey: "dex" },
  { key: "constitution", short: "KON", label: "Kondycja", saveKey: "con" },
  { key: "intelligence", short: "INT", label: "Intelekt", saveKey: "int" },
  { key: "wisdom", short: "MĄD", label: "Mądrość", saveKey: "wis" },
  { key: "charisma", short: "CHA", label: "Charyzma", saveKey: "cha" },
];

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwie Neutralny", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

// D&D 5e level 1–3 spell slots by class
const SPELL_SLOTS: Record<string, number[]> = {
  bard:     [2, 3, 4],
  cleric:   [2, 3, 4],
  druid:    [2, 3, 4],
  paladin:  [0, 2, 3],
  ranger:   [0, 2, 3],
  sorcerer: [2, 3, 4],
  warlock:  [1, 2, 0],
  wizard:   [2, 3, 4],
};

// ── Sub-components ─────────────────────────────────────────────────────────

type DivProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ children, style, ...props }: DivProps) {
  return (
    <div
      style={{
        background: "#1a1825",
        borderRadius: 12,
        border: "1px solid #2e2b3d",
        padding: "20px 24px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontFamily: "Cinzel, serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#c9a84c", textTransform: "uppercase" }}>
        {children}
      </span>
      <div style={{ height: 1, marginTop: 6, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.15) 100%)" }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

type Props = { character: CharacterFull };

export default function CharacterSheet({ character }: Props) {
  const router = useRouter();
  const { loadCharacter } = useWizardStore();

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
  const strMod = modNum(character.strength);

  const hp = maxHp(cls?.hitDie ?? 8, character.level, conMod);
  const ac = 10 + dexMod;
  const speed = race?.speed ?? 30;
  const initiative = dexMod;

  // Parsed JSON fields
  const proficientSkills: string[] = (() => {
    try { return JSON.parse(character.skills) as string[]; } catch { return []; }
  })();
  const savingThrowProficiencies: string[] = cls?.savingThrows ?? [];
  const personalityTraits: string[] = (() => {
    try { return JSON.parse(character.personalityTraits) as string[]; } catch { return []; }
  })();
  const ideals: string[] = (() => {
    try { return JSON.parse(character.ideals) as string[]; } catch { return []; }
  })();
  const bonds: string[] = (() => {
    try { return JSON.parse(character.bonds) as string[]; } catch { return []; }
  })();
  const flaws: string[] = (() => {
    try { return JSON.parse(character.flaws) as string[]; } catch { return []; }
  })();
  const equipmentList: { name: string; qty: number; weight: number }[] = (() => {
    try { return JSON.parse(character.equipment) as { name: string; qty: number; weight: number }[]; } catch { return []; }
  })();
  const cantripIds: string[] = (() => {
    try { return JSON.parse(character.cantrips) as string[]; } catch { return []; }
  })();
  const spellIds: string[] = (() => {
    try { return JSON.parse(character.spells) as string[]; } catch { return []; }
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
      setCurrentHp(currentHp); // revert
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
  const hpPercent = Math.max(0, Math.min(100, (currentHp / hp) * 100));
  const hpColor = hpPercent > 50 ? "#52c97a" : hpPercent > 25 ? "#c9a84c" : "#e05252";

  // Spell slots
  const slotsLevel1 = isSpellcaster ? (SPELL_SLOTS[character.class]?.[character.level - 1] ?? 0) : 0;

  return (
    <div>
      {/* ── Topbar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
        <Link
          href="/dashboard"
          data-testid="back-to-dashboard"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "#8b8699", fontSize: 13, textDecoration: "none",
            padding: "6px 12px", borderRadius: 6,
            border: "1px solid #2e2b3d", background: "#1a1825",
          }}
        >
          ← Moje Postacie
        </Link>
        <button
          data-testid="edit-character-btn"
          onClick={handleEdit}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 16px", borderRadius: 6,
            border: "1px solid #c9a84c44", background: "transparent",
            color: "#c9a84c", fontSize: 13, cursor: "pointer",
          }}
        >
          Edytuj Postać
        </button>
      </div>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        {/* Avatar */}
        <div
          style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c 0%, #b8943c 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Cinzel, serif", fontSize: 26, fontWeight: 700, color: "#1a1408",
            flexShrink: 0, boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
          }}
          aria-label="Avatar postaci"
        >
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: 28, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
            {character.name}
          </h1>
          <p style={{ color: "#8b8699", fontSize: 15, margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>
            {race?.name ?? character.race} · {cls?.name ?? character.class}
            {subclass ? ` — ${subclass.name}` : ""}
            {" "}· Poziom {character.level}
          </p>
          <p style={{ color: "#4a4759", fontSize: 13, margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
            {ALIGNMENT_PL[character.alignment] ?? character.alignment}
            {bg ? ` · Tło: ${bg.name}` : ""}
          </p>
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          {[
            { label: "KP", value: ac, ariaLabel: "Klasa Pancerza" },
            { label: "Init", value: initiative >= 0 ? `+${initiative}` : `${initiative}`, ariaLabel: "Inicjatywa" },
            { label: "Prędkość", value: `${Math.round(speed * 0.3)} m`, ariaLabel: "Prędkość ruchu" },
            { label: "PB", value: `+${prof}`, ariaLabel: "Bonus biegłości" },
          ].map(({ label, value, ariaLabel }) => (
            <div
              key={label}
              aria-label={ariaLabel}
              style={{
                textAlign: "center", background: "#1a1825",
                border: "1px solid #2e2b3d", borderRadius: 10,
                padding: "8px 14px",
              }}
            >
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 18, fontWeight: 700, color: "#c9a84c" }}>
                {value}
              </div>
              <div style={{ fontSize: 10, color: "#4a4759", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 320px", gap: 20, alignItems: "start" }}>

        {/* ══ LEFT COLUMN ══════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Ability Scores */}
          <Card>
            <SectionTitle>Cechy</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {STAT_LABELS.map(({ key, short, label }) => {
                const score = character[key];
                const m = modNum(score);
                return (
                  <div
                    key={key}
                    aria-label={`${label}: ${score}`}
                    style={{
                      background: "#0f0e17", borderRadius: 8,
                      border: "1px solid #2e2b3d", padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "#4a4759", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                      {short}
                    </div>
                    <div style={{ fontFamily: "Cinzel, serif", fontSize: 22, fontWeight: 700, color: "#f0ece4", lineHeight: 1 }}>
                      {score}
                    </div>
                    <div style={{ fontSize: 13, color: "#c9a84c", fontFamily: "Inter, sans-serif", fontWeight: 600, marginTop: 3 }}>
                      {m >= 0 ? `+${m}` : `${m}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Saving Throws */}
          <Card>
            <SectionTitle>Rzuty Obronne</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {STAT_LABELS.map(({ key, label, saveKey }) => {
                const isProficient = savingThrowProficiencies.includes(saveKey);
                const m = modNum(character[key]) + (isProficient ? prof : 0);
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: isProficient ? "#c9a84c" : "transparent",
                        border: `2px solid ${isProficient ? "#c9a84c" : "#4a4759"}`,
                        flexShrink: 0,
                      }}
                      aria-label={isProficient ? "Biegłość" : undefined}
                    />
                    <span style={{ flex: 1, fontSize: 13, color: "#8b8699", fontFamily: "Inter, sans-serif" }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isProficient ? "#c9a84c" : "#f0ece4", fontFamily: "Inter, sans-serif" }}>
                      {m >= 0 ? `+${m}` : `${m}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <SectionTitle>Umiejętności</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {Object.entries(SKILL_NAMES_PL).map(([rawKey, namePl]) => {
                const normalizedInput = proficientSkills.map(normalizeSkillKey);
                const isProficient = normalizedInput.includes(rawKey);
                const abilityKey = SKILL_ABILITY[rawKey];
                const abilityScore = abilityKey ? character[abilityKey] : 10;
                const m = modNum(abilityScore) + (isProficient ? prof : 0);
                return (
                  <div key={rawKey} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: isProficient ? "#c9a84c" : "transparent",
                        border: `2px solid ${isProficient ? "#c9a84c" : "#2e2b3d"}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 12, color: isProficient ? "#f0ece4" : "#8b8699", fontFamily: "Inter, sans-serif" }}>
                      {namePl}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isProficient ? "#c9a84c" : "#8b8699", fontFamily: "Inter, sans-serif" }}>
                      {m >= 0 ? `+${m}` : `${m}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ══ MIDDLE COLUMN ════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* HP */}
          <Card>
            <SectionTitle>Punkty Trafienia</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Decrease button */}
              <button
                aria-label="Zmniejsz HP"
                onClick={() => changeHp(-1)}
                disabled={hpSaving || currentHp <= -99}
                style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "transparent", border: "1px solid #e05252",
                  color: "#e05252", fontSize: 20, fontWeight: 700,
                  cursor: hpSaving || currentHp <= -99 ? "not-allowed" : "pointer",
                  opacity: currentHp <= -99 ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                −
              </button>

              {/* HP display */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div data-testid="current-hp" style={{ fontFamily: "Cinzel, serif", fontSize: 48, fontWeight: 700, color: hpColor, lineHeight: 1 }}>
                  {currentHp}
                </div>
                <div style={{ fontSize: 13, color: "#4a4759", fontFamily: "Inter, sans-serif", marginTop: 2 }}>
                  / {hp} max
                </div>
                {/* HP bar */}
                <div style={{ height: 4, background: "#0f0e17", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 2,
                      width: `${hpPercent}%`,
                      background: hpColor,
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                </div>
                {hpSaving && (
                  <div style={{ fontSize: 11, color: "#4a4759", marginTop: 4, fontFamily: "Inter, sans-serif" }}>
                    Zapisywanie...
                  </div>
                )}
                {hpError && (
                  <div style={{ fontSize: 11, color: "#e05252", marginTop: 4, fontFamily: "Inter, sans-serif" }}>
                    {hpError}
                  </div>
                )}
              </div>

              {/* Increase button */}
              <button
                aria-label="Zwiększ HP"
                onClick={() => changeHp(1)}
                disabled={hpSaving || currentHp >= 999}
                style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "transparent", border: "1px solid #52c97a",
                  color: "#52c97a", fontSize: 20, fontWeight: 700,
                  cursor: hpSaving || currentHp >= 999 ? "not-allowed" : "pointer",
                  opacity: currentHp >= 999 ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                +
              </button>
            </div>

            {/* Temp HP */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "8px 12px", background: "#0f0e17", borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>Tymczasowe PT</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#8b8699", fontFamily: "Inter, sans-serif" }}>
                {character.tempHp ?? 0}
              </span>
            </div>
          </Card>

          {/* Hit Dice + Death Saves */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Kość Trafień</SectionTitle>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Cinzel, serif", fontSize: 32, fontWeight: 700, color: "#c9a84c" }}>
                  k{cls?.hitDie ?? 8}
                </div>
                <div style={{ fontSize: 12, color: "#4a4759", fontFamily: "Inter, sans-serif", marginTop: 2 }}>
                  {character.level}×
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle>Rzuty Śmierci</SectionTitle>
              {(["Sukcesy", "Porażki"] as const).map((label) => {
                const isSuccess = label === "Sukcesy";
                const count = (() => {
                  try {
                    const ds = JSON.parse(character.deathSaves) as { successes: number; failures: number };
                    return isSuccess ? ds.successes : ds.failures;
                  } catch { return 0; }
                })();
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#4a4759", fontFamily: "Inter, sans-serif", width: 52 }}>{label}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: i < count ? (isSuccess ? "#52c97a" : "#e05252") : "transparent",
                            border: `2px solid ${i < count ? (isSuccess ? "#52c97a" : "#e05252") : "#2e2b3d"}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Equipment */}
          <Card>
            <SectionTitle>Ekwipunek</SectionTitle>
            {equipmentList.length === 0 ? (
              <p style={{ fontSize: 13, color: "#4a4759", fontFamily: "Inter, sans-serif", margin: 0 }}>Brak ekwipunku</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {equipmentList.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#f0ece4", fontFamily: "Inter, sans-serif" }}>
                      {item.name}
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      {item.qty > 1 && (
                        <span style={{ fontSize: 12, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>×{item.qty}</span>
                      )}
                      {item.weight > 0 && (
                        <span style={{ fontSize: 11, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>{item.weight} kg</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Gold */}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #2e2b3d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>Złoto</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c", fontFamily: "Cinzel, serif" }}>
                {character.gold} sz. złota
              </span>
            </div>
          </Card>
        </div>

        {/* ══ RIGHT COLUMN ═════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Personality */}
          {(personalityTraits.length > 0 || ideals.length > 0 || bonds.length > 0 || flaws.length > 0) && (
            <Card>
              <SectionTitle>Osobowość</SectionTitle>
              {personalityTraits.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Cechy Osobowości
                  </div>
                  {personalityTraits.map((t, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: "0 0 3px", lineHeight: 1.5 }}>
                      "{t}"
                    </p>
                  ))}
                </div>
              )}
              {ideals.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Ideały
                  </div>
                  {ideals.map((t, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: "0 0 3px", lineHeight: 1.5 }}>
                      "{t}"
                    </p>
                  ))}
                </div>
              )}
              {bonds.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Więzy
                  </div>
                  {bonds.map((t, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: "0 0 3px", lineHeight: 1.5 }}>
                      "{t}"
                    </p>
                  ))}
                </div>
              )}
              {flaws.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    Wady
                  </div>
                  {flaws.map((t, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: "0 0 3px", lineHeight: 1.5 }}>
                      "{t}"
                    </p>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Background feature */}
          {bg?.specialFeature && (
            <Card>
              <SectionTitle>Cecha Tła</SectionTitle>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#c9a84c", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                ✦ {bg.specialFeature.name}
              </div>
              <p style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: 1.5 }}>
                {bg.specialFeature.description}
              </p>
            </Card>
          )}

          {/* Spells */}
          {isSpellcaster && (
            <Card>
              <SectionTitle>Magia</SectionTitle>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "ST Czarów", value: spellDC },
                  { label: "Atak", value: spellAttack >= 0 ? `+${spellAttack}` : `${spellAttack}` },
                  { label: "Sloty poz.1", value: slotsLevel1 },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: "center", background: "#0f0e17", borderRadius: 8, padding: "8px 4px" }}>
                    <div style={{ fontFamily: "Cinzel, serif", fontSize: 16, fontWeight: 700, color: "#7c5cbf" }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 9, color: "#4a4759", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cantrips */}
              {cantripData.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#7c5cbf", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                    Sztuczki (k0)
                  </div>
                  {cantripData.map((spell) => spell && (
                    <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#f0ece4", fontFamily: "Inter, sans-serif" }}>{spell.namePl}</span>
                      <span style={{ fontSize: 10, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>{spell.castingTime}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Level 1 Spells */}
              {spellData.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: "#7c5cbf", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                    Zaklęcia poz.1
                  </div>
                  {spellData.map((spell) => spell && (
                    <div key={spell.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#f0ece4", fontFamily: "Inter, sans-serif" }}>{spell.namePl}</span>
                      <span style={{ fontSize: 10, color: "#4a4759", fontFamily: "Inter, sans-serif" }}>{spell.castingTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Backstory */}
          {character.description && (
            <Card>
              <SectionTitle>Historia</SectionTitle>
              <p style={{ fontSize: 12, color: "#8b8699", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: 1.6 }}>
                {character.description}
              </p>
            </Card>
          )}

          {/* Session Notes */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#c9a84c", textTransform: "uppercase" }}>
                Notatki Sesji
              </span>
              {notesSaved && (
                <span style={{ fontSize: 10, color: "#52c97a", fontFamily: "Inter, sans-serif" }}>
                  ✓ Zapisano
                </span>
              )}
            </div>
            <div style={{ height: 1, marginBottom: 12, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.15) 100%)" }} />
            <textarea
              aria-label="Notatki sesji"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Zapisz notatki z sesji..."
              maxLength={5000}
              style={{
                width: "100%", minHeight: 120,
                background: "#0f0e17", border: "1px solid #2e2b3d",
                borderRadius: 8, color: "#f0ece4",
                fontFamily: "Inter, sans-serif", fontSize: 12,
                padding: "10px 12px", resize: "vertical",
                boxSizing: "border-box", outline: "none",
                transition: "border-color 0.15s",
                lineHeight: 1.6,
              }}
              onFocus={(e) => { e.target.style.borderColor = "#c9a84c"; }}
              onBlur={(e) => { e.target.style.borderColor = "#2e2b3d"; }}
            />
            <div style={{ fontSize: 10, color: "#2e2b3d", fontFamily: "Inter, sans-serif", marginTop: 4, textAlign: "right" }}>
              {notes.length}/5000
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
