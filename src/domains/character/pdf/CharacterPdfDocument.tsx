import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CharacterFull } from "@/domains/character/actions/getCharacter";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { CLASSES } from "@/data/dnd/classes";
import { allSpells } from "@/data/dnd/spells";
import { modNum, profBonus, maxHp } from "@/shared/lib/dnd-mechanics";

function safeJson<T>(raw: string | null | undefined, fallback: T): T {
  try { return JSON.parse(raw ?? "null") as T; } catch { return fallback; }
}

function modStr(score: number): string {
  const m = modNum(score);
  return m >= 0 ? `+${m}` : `${m}`;
}

// ── Label maps ─────────────────────────────────────────────────────────────

const CLASS_LABELS: Record<string, string> = {
  barbarian: "Barbarzyńca", bard: "Bard", cleric: "Kleryk",
  druid: "Druid", fighter: "Wojownik", monk: "Mnich",
  paladin: "Paladyn", ranger: "Łowca", rogue: "Łotrzyk",
  sorcerer: "Czarownik", warlock: "Warlock", wizard: "Czarodziej",
};

const RACE_LABELS: Record<string, string> = {
  human: "Człowiek", dwarf: "Krasnolud", elf: "Elf",
  halfling: "Niziołek", gnome: "Gnom", dragonborn: "Drakonid",
  tiefling: "Tiefling", goliath: "Goliath", orc: "Ork",
  "half-elf": "Półelf", "half-orc": "Półork",
  "high-elf": "Elf", "wood-elf": "Elf", "dark-elf": "Elf",
};

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const STAT_LABELS = [
  { key: "strength"     as const, label: "Siła",       short: "SIŁ",  saveKey: "str" },
  { key: "dexterity"    as const, label: "Zręczność",   short: "ZRR",  saveKey: "dex" },
  { key: "constitution" as const, label: "Kondycja",    short: "KON",  saveKey: "con" },
  { key: "intelligence" as const, label: "Intelekt",    short: "INT",  saveKey: "int" },
  { key: "wisdom"       as const, label: "Mądrość",     short: "MĄD",  saveKey: "wis" },
  { key: "charisma"     as const, label: "Charyzma",    short: "CHA",  saveKey: "cha" },
];

const SKILL_LIST: { key: string; label: string; ability: string; short: string }[] = [
  { key: "acrobatics",     label: "Akrobatyka",       ability: "dexterity",    short: "ZRR" },
  { key: "animalHandling", label: "Obchodzenie się z Zw.", ability: "wisdom", short: "MĄD" },
  { key: "arcana",         label: "Tajemna Wiedza",   ability: "intelligence", short: "INT" },
  { key: "athletics",      label: "Atletyka",         ability: "strength",     short: "SIŁ" },
  { key: "deception",      label: "Podstęp",          ability: "charisma",     short: "CHA" },
  { key: "history",        label: "Historia",         ability: "intelligence", short: "INT" },
  { key: "insight",        label: "Dociekliwość",     ability: "wisdom",       short: "MĄD" },
  { key: "intimidation",   label: "Zastraszanie",     ability: "charisma",     short: "CHA" },
  { key: "investigation",  label: "Śledztwo",         ability: "intelligence", short: "INT" },
  { key: "medicine",       label: "Medycyna",         ability: "wisdom",       short: "MĄD" },
  { key: "nature",         label: "Przyroda",         ability: "intelligence", short: "INT" },
  { key: "perception",     label: "Percepcja",        ability: "wisdom",       short: "MĄD" },
  { key: "performance",    label: "Sztuka",           ability: "charisma",     short: "CHA" },
  { key: "persuasion",     label: "Przekonywanie",    ability: "charisma",     short: "CHA" },
  { key: "religion",       label: "Religia",          ability: "intelligence", short: "INT" },
  { key: "sleightOfHand",  label: "Zręczne Dłonie",   ability: "dexterity",    short: "ZRR" },
  { key: "stealth",        label: "Skradanie",        ability: "dexterity",    short: "ZRR" },
  { key: "survival",       label: "Przetrwanie",      ability: "wisdom",       short: "MĄD" },
];

// ── Design tokens ───────────────────────────────────────────────────────────

const BLACK  = "#0a0a0a";
const MID    = "#555555";
const RULE   = "#999999";
const LIGHT  = "#cccccc";
const WHITE  = "#ffffff";

// ── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    paddingHorizontal: 28,
    paddingVertical: 24,
    fontFamily: "Helvetica",
    color: BLACK,
    fontSize: 8,
  },
  // ── Header ──
  headerGrid: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottom: `1.5 solid ${BLACK}`,
    paddingBottom: 10,
  },
  titleBlock: {
    marginRight: 16,
    minWidth: 100,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    lineHeight: 1,
    letterSpacing: -0.5,
  },
  systemTag: {
    fontSize: 6,
    color: MID,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  fieldsGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fieldCell: {
    width: "33.3%",
    padding: "4 6",
    borderRight: `1 solid ${LIGHT}`,
    borderBottom: `1 solid ${LIGHT}`,
  },
  fieldLabel: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: MID,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    color: BLACK,
    fontFamily: "Helvetica",
  },
  // ── 3-column grid ──
  threeCol: {
    flexDirection: "row",
    borderTop: `1.5 solid ${BLACK}`,
  },
  colA: {
    width: 90,
    borderRight: `1 solid ${LIGHT}`,
    padding: "8 6",
  },
  colB: {
    width: 110,
    borderRight: `1 solid ${LIGHT}`,
    padding: "8 6",
  },
  colC: {
    flex: 1,
    padding: "8 6",
  },
  // ── Section title ──
  sectionTitle: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    textTransform: "uppercase",
    letterSpacing: 2,
    borderBottom: `1.5 solid ${BLACK}`,
    paddingBottom: 2,
    marginBottom: 5,
  },
  // ── Ability score ──
  abilityBox: {
    border: `1.5 solid ${BLACK}`,
    padding: "4 3",
    marginBottom: 4,
    alignItems: "center",
  },
  abilityShort: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: MID,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  abilityScore: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    borderBottom: `1 solid ${BLACK}`,
    width: "100%",
    textAlign: "center",
    paddingBottom: 1,
    marginBottom: 1,
  },
  abilityMod: {
    fontSize: 10,
    color: BLACK,
    fontFamily: "Helvetica-Bold",
  },
  abilityModLabel: {
    fontSize: 5,
    color: MID,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // ── Dot row (saves / skills) ──
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  dot: {
    width: 7,
    height: 7,
    border: `1.5 solid ${BLACK}`,
    marginRight: 4,
    flexShrink: 0,
  },
  dotFilled: {
    width: 7,
    height: 7,
    backgroundColor: BLACK,
    marginRight: 4,
    flexShrink: 0,
  },
  dotRowValue: {
    fontSize: 7,
    color: BLACK,
    fontFamily: "Helvetica-Bold",
    marginRight: 4,
    width: 16,
    textAlign: "right",
    flexShrink: 0,
  },
  dotRowLabel: {
    fontSize: 6,
    color: BLACK,
    flex: 1,
  },
  dotRowAttr: {
    fontSize: 5,
    color: MID,
    fontFamily: "Helvetica-Oblique",
  },
  // ── Combat cells ──
  combatRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  combatCell: {
    flex: 1,
    border: `1.5 solid ${BLACK}`,
    padding: "4 3",
    alignItems: "center",
    marginRight: 3,
  },
  combatValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },
  combatLabel: {
    fontSize: 5,
    color: MID,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 1,
  },
  // ── HP ──
  hpBlock: {
    border: `1.5 solid ${BLACK}`,
    padding: "5 6",
    marginBottom: 4,
  },
  hpLabel: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: MID,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  hpValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    lineHeight: 1,
  },
  hpMax: {
    fontSize: 7,
    color: MID,
  },
  // ── Attacks table ──
  attacksHeader: {
    flexDirection: "row",
    borderBottom: `1 solid ${BLACK}`,
    paddingBottom: 2,
    marginBottom: 2,
  },
  attacksRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${LIGHT}`,
    paddingBottom: 2,
    marginBottom: 2,
  },
  atkName: { flex: 3, fontSize: 7, color: BLACK },
  atkBonus: { flex: 1, fontSize: 7, color: BLACK, textAlign: "center" },
  atkDmg: { flex: 2, fontSize: 7, color: BLACK },
  atkHeaderText: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: MID,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // ── Personality ──
  personalityBox: {
    border: `1 solid ${LIGHT}`,
    padding: "3 4",
    marginBottom: 3,
    minHeight: 24,
  },
  personalityLabel: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: MID,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  personalityText: {
    fontSize: 7,
    color: BLACK,
    lineHeight: 1.4,
  },
  // ── Bottom 3 cols ──
  bottomRow: {
    flexDirection: "row",
    borderTop: `1.5 solid ${BLACK}`,
  },
  bottomCol: {
    flex: 1,
    padding: "6 6",
    borderRight: `1 solid ${LIGHT}`,
  },
  bottomColLast: {
    flex: 1,
    padding: "6 6",
  },
  bottomText: {
    fontSize: 7,
    color: BLACK,
    lineHeight: 1.5,
  },
  linedArea: {
    minHeight: 40,
    borderBottom: `1 solid ${LIGHT}`,
    marginBottom: 2,
  },
  // ── Death saves ──
  deathRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  deathLabel: {
    fontSize: 5,
    color: MID,
    textTransform: "uppercase",
    letterSpacing: 1,
    width: 36,
  },
  deathDots: {
    flexDirection: "row",
    gap: 3,
  },
  // ── Footer ──
  footer: {
    marginTop: 8,
    borderTop: `1 solid ${LIGHT}`,
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 5,
    color: RULE,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  // ── Page 2/3 ──
  p2Header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
    borderBottom: `1.5 solid ${BLACK}`,
    paddingBottom: 5,
  },
  p2Title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },
  p2Subtitle: {
    fontSize: 6,
    color: MID,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  spellLevelNum: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    lineHeight: 1,
  },
  spellSlotDot: {
    width: 8,
    height: 8,
    border: `1.5 solid ${BLACK}`,
    marginRight: 2,
  },
  spellSlotDotUsed: {
    width: 8,
    height: 8,
    backgroundColor: BLACK,
    marginRight: 2,
  },
  spellRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: `1 solid ${LIGHT}`,
    paddingBottom: 2,
    marginBottom: 2,
  },
  spellName: {
    fontSize: 7,
    color: BLACK,
  },
  spellTime: {
    fontSize: 6,
    color: MID,
  },
});

// ── Component ──────────────────────────────────────────────────────────────

type Props = { character: CharacterFull };

export function CharacterPdfDocument({ character: c }: Props) {
  const charExt = c as Record<string, unknown>;
  const cls = CLASSES.find((cl) => cl.id === c.class);
  const hitDie = cls?.hitDie ?? 8;
  const conMod = modNum(c.constitution);
  const dexMod = modNum(c.dexterity);
  const wisMod = modNum(c.wisdom);
  const intMod = modNum(c.intelligence);
  const chaMod = modNum(c.charisma);
  const hpMax = maxHp(hitDie, c.level, conMod);
  const hp = c.currentHp ?? hpMax;
  const ac = 10 + dexMod;
  const initiative = dexMod;
  const prof = profBonus(c.level);

  const isSpellcaster = cls?.spellcasting ?? false;
  const spellAbilityMod = isSpellcaster
    ? cls?.spellcastingAbility === "wis" ? wisMod
      : cls?.spellcastingAbility === "int" ? intMod
      : chaMod
    : 0;
  const spellDC = 8 + prof + spellAbilityMod;
  const spellAttack = prof + spellAbilityMod;
  const spellAbilityLabel = cls?.spellcastingAbility === "wis" ? "Mądrość"
    : cls?.spellcastingAbility === "int" ? "Intelekt" : "Charyzma";

  const equipment = safeJson<{ name: string; qty: number; weight?: number }[]>(c.equipment, []);
  const cantripIds = safeJson<string[]>(c.cantrips, []);
  const spellIds = safeJson<string[]>(c.spells, []);
  const proficientSkillsRaw = safeJson<string[]>(c.skills, []);
  const proficientSkills = proficientSkillsRaw.map((s) =>
    s.replace(/-([a-z])/g, (_: string, ch: string) => ch.toUpperCase())
  );
  const languageList = safeJson<string[]>(c.languages ?? "[]", []);
  const deathSaves = safeJson<{ successes: number; failures: number }>(
    c.deathSaves, { successes: 0, failures: 0 }
  );
  const attacksList = safeJson<{ name: string; atkBonus: string; damage: string }[]>(
    (charExt.attacks as string) ?? "[]", []
  );
  const slotsUsed = safeJson<Record<string, number>>(
    (charExt.spellSlotsUsed as string) ?? "{}", {}
  );
  const experience = Number(charExt.experience ?? 0);
  const weight = charExt.weight ? `${String(charExt.weight)} kg` : null;
  const eyeColor = (charExt.eyeColor as string | null) ?? null;
  const skinColor = (charExt.skinColor as string | null) ?? null;
  const hairColor = (charExt.hairColor as string | null) ?? null;
  const allies = (charExt.allies as string | null) ?? null;
  const treasure = (charExt.treasure as string | null) ?? null;

  const bg = BACKGROUNDS.find((b) => b.id === c.background);
  const savingThrowProficiencies: string[] = cls?.savingThrows ?? [];

  const resolveIds = (raw: string, field: "personalityTraits" | "ideals" | "bonds" | "flaws"): string[] => {
    const ids = safeJson<string[]>(raw, []);
    return ids.map((id) => bg?.[field].find((o) => o.id === id)?.text ?? id);
  };
  const personalityTraits = resolveIds(c.personalityTraits, "personalityTraits");
  const ideals = resolveIds(c.ideals, "ideals");
  const bonds = resolveIds(c.bonds, "bonds");
  const flaws = resolveIds(c.flaws, "flaws");

  const cantripData = cantripIds.map((id) => allSpells.find((s) => s.id === id)).filter(Boolean);
  const spellData = spellIds.map((id) => allSpells.find((s) => s.id === id)).filter(Boolean);

  const clsLabel = CLASS_LABELS[c.class] ?? c.class;
  const raceLabel = RACE_LABELS[c.race] ?? c.race;

  // SRD level-1 slots
  const SLOTS_LVL1: Record<string, number[]> = {
    bard: [2,0,0,0,0,0,0,0,0], cleric: [2,0,0,0,0,0,0,0,0],
    druid: [2,0,0,0,0,0,0,0,0], sorcerer: [2,0,0,0,0,0,0,0,0],
    warlock: [1,0,0,0,0,0,0,0,0], wizard: [2,0,0,0,0,0,0,0,0],
    paladin: [0,0,0,0,0,0,0,0,0], ranger: [0,0,0,0,0,0,0,0,0],
  };
  const slotsForLevel = SLOTS_LVL1[c.class] ?? [0,0,0,0,0,0,0,0,0];

  const passivePerception = 10 + modNum(c.wisdom) + (proficientSkills.includes("perception") ? prof : 0);

  return (
    <Document
      title={`Karta Postaci — ${c.name}`}
      author="Kroniki Przygód"
      subject="D&D 5e — Karta Postaci"
    >
      {/* ════════════════════════════════ STRONA 1 ════════════════════════════════ */}
      <Page size="A4" style={S.page}>

        {/* Header */}
        <View style={S.headerGrid}>
          <View style={S.titleBlock}>
            <Text style={S.systemTag}>Dungeons &amp; Dragons · 5e</Text>
            <Text style={S.pageTitle}>Karta{"\n"}Postaci</Text>
          </View>
          <View style={S.fieldsGrid}>
            {[
              { label: "Imię Postaci",    value: c.name },
              { label: "Klasa i Poziom",  value: `${clsLabel} ${c.level}` },
              { label: "Rasa",            value: raceLabel },
              { label: "Charakter",       value: ALIGNMENT_PL[c.alignment] ?? c.alignment },
              { label: "Tło",             value: bg?.name ?? c.background ?? "—" },
              { label: "PD",              value: String(experience) },
            ].map(({ label, value }) => (
              <View key={label} style={S.fieldCell}>
                <Text style={S.fieldLabel}>{label}</Text>
                <Text style={S.fieldValue}>{value ?? "—"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3-column main */}
        <View style={S.threeCol}>

          {/* ── Column A: Ability Scores ── */}
          <View style={S.colA}>
            {STAT_LABELS.map(({ key, short, label }) => {
              const score = c[key];
              const m = modNum(score);
              return (
                <View key={key} style={S.abilityBox}>
                  <Text style={S.abilityShort}>{label.toUpperCase()}</Text>
                  <Text style={S.abilityScore}>{score}</Text>
                  <Text style={S.abilityMod}>{m >= 0 ? `+${m}` : `${m}`}</Text>
                  <Text style={S.abilityModLabel}>mod</Text>
                </View>
              );
            })}
          </View>

          {/* ── Column B: Inspiration / PB / Saves / Skills / Passive Perc ── */}
          <View style={S.colB}>
            {/* Inspiration + PB */}
            <View style={{ flexDirection: "row", marginBottom: 6, gap: 4 }}>
              <View style={{ flex: 1, border: `1.5 solid ${BLACK}`, padding: "4 4", alignItems: "center" }}>
                <Text style={{ fontSize: 5, color: MID, textTransform: "uppercase", letterSpacing: 1 }}>Inspiracja</Text>
                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: BLACK }}>
                  {(charExt.inspiration as boolean) ? "✓" : "○"}
                </Text>
              </View>
              <View style={{ flex: 1, border: `1.5 solid ${BLACK}`, padding: "4 4", alignItems: "center" }}>
                <Text style={{ fontSize: 5, color: MID, textTransform: "uppercase", letterSpacing: 1 }}>Premia Biegłości</Text>
                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: BLACK }}>+{prof}</Text>
              </View>
            </View>

            {/* Saving Throws */}
            <Text style={S.sectionTitle}>Rzuty Obronne</Text>
            {STAT_LABELS.map(({ key, label, saveKey }) => {
              const isProficient = savingThrowProficiencies.includes(saveKey);
              const val = modNum(c[key]) + (isProficient ? prof : 0);
              return (
                <View key={key} style={S.dotRow}>
                  <View style={isProficient ? S.dotFilled : S.dot} />
                  <Text style={S.dotRowValue}>{val >= 0 ? `+${val}` : `${val}`}</Text>
                  <Text style={S.dotRowLabel}>{label}</Text>
                </View>
              );
            })}

            <View style={{ marginTop: 4 }} />

            {/* Skills */}
            <Text style={S.sectionTitle}>Umiejętności</Text>
            {SKILL_LIST.map(({ key, label, ability, short }) => {
              const isProficient = proficientSkills.includes(key);
              const abilityScore = c[ability as keyof typeof c] as number ?? 10;
              const val = modNum(abilityScore) + (isProficient ? prof : 0);
              return (
                <View key={key} style={S.dotRow}>
                  <View style={isProficient ? S.dotFilled : S.dot} />
                  <Text style={S.dotRowValue}>{val >= 0 ? `+${val}` : `${val}`}</Text>
                  <Text style={[S.dotRowLabel, { flex: 1 }]}>{label} </Text>
                  <Text style={S.dotRowAttr}>({short})</Text>
                </View>
              );
            })}

            {/* Passive Perception */}
            <View style={{ marginTop: 4, border: `1.5 solid ${BLACK}`, padding: "3 5", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 5, color: MID, textTransform: "uppercase", letterSpacing: 1 }}>Bierna Percepcja</Text>
              <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: BLACK }}>{passivePerception}</Text>
            </View>
          </View>

          {/* ── Column C: Combat + HP + Attacks + Personality ── */}
          <View style={S.colC}>
            {/* AC / Init / Speed */}
            <View style={S.combatRow}>
              {[
                { label: "Klasa Pancerza", value: String(ac) },
                { label: "Inicjatywa",     value: initiative >= 0 ? `+${initiative}` : `${initiative}` },
                { label: "Prędkość",       value: "9 m" },
              ].map(({ label, value }, i) => (
                <View key={label} style={[S.combatCell, i === 2 ? { marginRight: 0 } : {}]}>
                  <Text style={S.combatValue}>{value}</Text>
                  <Text style={S.combatLabel}>{label}</Text>
                </View>
              ))}
            </View>

            {/* HP block */}
            <View style={S.hpBlock}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, borderRight: `1 solid ${LIGHT}`, paddingRight: 6 }}>
                  <Text style={S.hpLabel}>Maximum HP</Text>
                  <Text style={{ fontSize: 10, color: MID, fontFamily: "Helvetica-Bold" }}>{hpMax}</Text>
                </View>
                <View style={{ flex: 2, paddingLeft: 6 }}>
                  <Text style={S.hpLabel}>Aktualne HP</Text>
                  <Text style={S.hpValue}>{hp}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", borderTop: `1 solid ${LIGHT}`, marginTop: 4, paddingTop: 4 }}>
                <View style={{ flex: 1, borderRight: `1 solid ${LIGHT}`, paddingRight: 6 }}>
                  <Text style={S.hpLabel}>Tymczasowe HP</Text>
                  <Text style={{ fontSize: 10, color: BLACK }}>{c.tempHp ?? 0}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 6 }}>
                  <Text style={S.hpLabel}>Kość Trafień</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: BLACK }}>
                    {c.level}× k{hitDie}
                  </Text>
                </View>
              </View>
            </View>

            {/* Death saves */}
            <View style={{ border: `1.5 solid ${BLACK}`, padding: "4 5", marginBottom: 5 }}>
              <Text style={S.sectionTitle}>Rzuty Śmierci</Text>
              {[
                { label: "Sukcesy",  count: deathSaves.successes },
                { label: "Porażki", count: deathSaves.failures },
              ].map(({ label, count }) => (
                <View key={label} style={S.deathRow}>
                  <Text style={S.deathLabel}>{label}</Text>
                  <View style={S.deathDots}>
                    {[0,1,2].map((i) => (
                      <View key={i} style={i < count ? S.dotFilled : S.dot} />
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Attacks table */}
            <Text style={S.sectionTitle}>Ataki i Czary</Text>
            <View style={S.attacksHeader}>
              <Text style={[S.atkHeaderText, { flex: 3 }]}>Broń</Text>
              <Text style={[S.atkHeaderText, { flex: 1, textAlign: "center" }]}>Atak</Text>
              <Text style={[S.atkHeaderText, { flex: 2 }]}>Obrażenia</Text>
            </View>
            {attacksList.length > 0 ? attacksList.map((atk, i) => (
              <View key={i} style={S.attacksRow}>
                <Text style={S.atkName}>{atk.name}</Text>
                <Text style={S.atkBonus}>{atk.atkBonus}</Text>
                <Text style={S.atkDmg}>{atk.damage}</Text>
              </View>
            )) : (
              [0,1,2].map((i) => (
                <View key={i} style={S.attacksRow}>
                  <Text style={S.atkName}> </Text>
                  <Text style={S.atkBonus}> </Text>
                  <Text style={S.atkDmg}> </Text>
                </View>
              ))
            )}

            {/* Personality */}
            <View style={{ marginTop: 5 }}>
              <Text style={S.sectionTitle}>Osobowość</Text>
              {[
                { label: "Cechy Osobowości", texts: personalityTraits },
                { label: "Ideały",            texts: ideals },
                { label: "Więzy",             texts: bonds },
                { label: "Słabości",          texts: flaws },
              ].map(({ label, texts }) => (
                <View key={label} style={S.personalityBox}>
                  <Text style={S.personalityLabel}>{label}</Text>
                  <Text style={S.personalityText}>{texts.join(" ") || " "}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom 3-column */}
        <View style={S.bottomRow}>
          <View style={S.bottomCol}>
            <Text style={S.sectionTitle}>Biegłości i Języki</Text>
            {languageList.length > 0 && (
              <Text style={S.bottomText}>{languageList.join(", ")}</Text>
            )}
            {bg?.toolProficiency && (
              <Text style={[S.bottomText, { marginTop: 3 }]}>{bg.toolProficiency}</Text>
            )}
          </View>
          <View style={S.bottomCol}>
            <Text style={S.sectionTitle}>Wyposażenie</Text>
            {equipment.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", borderBottom: `1 solid ${LIGHT}`, paddingBottom: 1, marginBottom: 1 }}>
                <Text style={S.bottomText}>{item.name}</Text>
                <Text style={[S.bottomText, { color: MID }]}>×{item.qty}</Text>
              </View>
            ))}
            <View style={{ marginTop: 4, borderTop: `1 solid ${BLACK}`, paddingTop: 3, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 6, color: MID, textTransform: "uppercase", letterSpacing: 1 }}>Złoto</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: BLACK }}>{c.gold} sz.</Text>
            </View>
          </View>
          <View style={S.bottomColLast}>
            <Text style={S.sectionTitle}>Korzyści i Zdolności</Text>
            {bg?.specialFeature && (
              <>
                <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold", color: BLACK, marginBottom: 1 }}>
                  {bg.specialFeature.name}
                </Text>
                <Text style={[S.bottomText, { color: MID }]}>{bg.specialFeature.description}</Text>
              </>
            )}
            {isSpellcaster && (
              <View style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 6, color: MID }}>
                  ST Czarów: {spellDC} · Atak: {spellAttack >= 0 ? `+${spellAttack}` : spellAttack}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={S.footer}>
          <Text style={S.footerText}>Kroniki Przygód</Text>
          <Text style={S.footerText}>D&amp;D 5e SRD 5.2.1 · CC-BY-4.0</Text>
          <Text style={S.footerText}>{new Date().toLocaleDateString("pl-PL")}</Text>
        </View>

      </Page>

      {/* ════════════════════════════════ STRONA 2 — HISTORIA ════════════════════ */}
      <Page size="A4" style={S.page}>
        <View style={S.p2Header}>
          <Text style={S.p2Title}>{c.name}</Text>
          <Text style={S.p2Subtitle}>Historia · Strona 2</Text>
        </View>

        {/* Physical appearance grid */}
        <View style={{ marginBottom: 10 }}>
          <Text style={S.sectionTitle}>Wygląd Fizyczny</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {[
              { label: "Wiek",           value: c.age ? `${c.age} lat` : "—" },
              { label: "Wzrost",         value: c.height ? `${c.height} cm` : "—" },
              { label: "Waga",           value: weight ?? "—" },
              { label: "Kolor Oczu",     value: eyeColor ?? "—" },
              { label: "Kolor Skóry",    value: skinColor ?? "—" },
              { label: "Kolor Włosów",   value: hairColor ?? "—" },
            ].map(({ label, value }) => (
              <View key={label} style={[S.fieldCell, { width: "33.3%" }]}>
                <Text style={S.fieldLabel}>{label}</Text>
                <Text style={S.fieldValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History 2-col */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={S.sectionTitle}>Historia Postaci</Text>
            <Text style={[S.bottomText, { lineHeight: 1.6 }]}>
              {c.backstory || c.description || "—"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.sectionTitle}>Sojusznicy i Organizacje</Text>
            <Text style={[S.bottomText, { lineHeight: 1.6 }]}>
              {allies ?? "—"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={S.sectionTitle}>Majątek</Text>
            <Text style={[S.bottomText, { lineHeight: 1.6 }]}>
              {treasure ?? "—"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.sectionTitle}>Notatki Sesji</Text>
            <Text style={[S.bottomText, { lineHeight: 1.6 }]}>
              {c.sessionNotes ?? "—"}
            </Text>
          </View>
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>Kroniki Przygód</Text>
          <Text style={S.footerText}>D&amp;D 5e SRD 5.2.1</Text>
          <Text style={S.footerText}>{new Date().toLocaleDateString("pl-PL")}</Text>
        </View>
      </Page>

      {/* ════════════════════════════════ STRONA 3 — ZAKLĘCIA ════════════════════ */}
      {isSpellcaster && (
        <Page size="A4" style={S.page}>
          <View style={S.p2Header}>
            <Text style={S.p2Title}>{c.name}</Text>
            <Text style={S.p2Subtitle}>Zaklęcia · Strona 3</Text>
          </View>

          {/* Spell stats */}
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {[
              { label: "Klasa Zaklęć",   value: clsLabel },
              { label: "Cecha Bazowa",   value: spellAbilityLabel },
              { label: "ST Czarów",      value: String(spellDC) },
              { label: "Premia Ataku",   value: spellAttack >= 0 ? `+${spellAttack}` : `${spellAttack}` },
            ].map(({ label, value }, i) => (
              <View key={label} style={[S.fieldCell, { flex: 1, borderRight: i < 3 ? `1 solid ${LIGHT}` : "none" }]}>
                <Text style={S.fieldLabel}>{label}</Text>
                <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: BLACK }}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Cantrips */}
          <View style={{ marginBottom: 10 }}>
            <Text style={S.sectionTitle}>Sztuczki (Poziom 0)</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {cantripData.length === 0
                ? <Text style={{ fontSize: 7, color: MID }}>Brak sztuczek</Text>
                : cantripData.map((spell) => spell && (
                  <View key={spell.id} style={S.spellRow}>
                    <Text style={S.spellName}>{spell.namePl}</Text>
                    <Text style={S.spellTime}>{spell.castingTime}</Text>
                  </View>
                ))
              }
            </View>
          </View>

          {/* Spell levels 1-9 in 3 columns */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[0,1,2].map((colIdx) => (
              <View key={colIdx} style={{ flex: 1 }}>
                {[1,2,3].map((offset) => {
                  const spellLevel = colIdx * 3 + offset;
                  const totalSlots = slotsForLevel[spellLevel - 1] ?? 0;
                  const usedSlots = slotsUsed[String(spellLevel)] ?? 0;
                  const levelSpells = spellData.filter((s) => s && s.level === spellLevel);
                  return (
                    <View key={spellLevel} style={{ marginBottom: 10 }}>
                      {/* Level header */}
                      <View style={{ flexDirection: "row", alignItems: "baseline", borderBottom: `1.5 solid ${BLACK}`, paddingBottom: 2, marginBottom: 3 }}>
                        <Text style={S.spellLevelNum}>{spellLevel}</Text>
                        <Text style={{ fontSize: 6, color: MID, letterSpacing: 2, textTransform: "uppercase", marginLeft: 4 }}>
                          poz. · {totalSlots} slotów
                        </Text>
                      </View>
                      {/* Slot dots */}
                      {totalSlots > 0 && (
                        <View style={{ flexDirection: "row", marginBottom: 3 }}>
                          {Array.from({ length: totalSlots }).map((_, i) => (
                            <View key={i} style={i < usedSlots ? S.spellSlotDotUsed : S.spellSlotDot} />
                          ))}
                        </View>
                      )}
                      {/* Spells */}
                      {levelSpells.length === 0
                        ? <View style={{ borderBottom: `1 solid ${LIGHT}`, height: 16 }} />
                        : levelSpells.map((spell) => spell && (
                          <View key={spell.id} style={S.spellRow}>
                            <Text style={S.spellName}>{spell.namePl}</Text>
                            <Text style={S.spellTime}>{spell.castingTime}</Text>
                          </View>
                        ))
                      }
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={S.footer}>
            <Text style={S.footerText}>Kroniki Przygód</Text>
            <Text style={S.footerText}>D&amp;D 5e SRD 5.2.1</Text>
            <Text style={S.footerText}>{new Date().toLocaleDateString("pl-PL")}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
