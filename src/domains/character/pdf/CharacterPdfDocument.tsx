import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CharacterFull } from "@/domains/character/actions/getCharacter";

// ── Helpers ────────────────────────────────────────────────────────────────

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function maxHp(hitDie: number, level: number, conMod: number): number {
  return Math.max(1, hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod));
}

function safeJson<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ── Label maps ─────────────────────────────────────────────────────────────

const CLASS_HIT_DIE: Record<string, number> = {
  barbarian: 12, fighter: 10, paladin: 10, ranger: 10,
  bard: 8, cleric: 8, druid: 8, monk: 8, rogue: 8, warlock: 8,
  sorcerer: 6, wizard: 6,
};

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
};

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const STAT_LABELS = [
  { key: "strength" as const, label: "Siła", short: "SIŁ" },
  { key: "dexterity" as const, label: "Zręczność", short: "ZRR" },
  { key: "constitution" as const, label: "Kondycja", short: "KON" },
  { key: "intelligence" as const, label: "Intelekt", short: "INT" },
  { key: "wisdom" as const, label: "Mądrość", short: "MĄD" },
  { key: "charisma" as const, label: "Charyzma", short: "CHA" },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    backgroundColor: "#0f0e17",
    padding: 32,
    fontFamily: "Helvetica",
    color: "#f0ece4",
    fontSize: 10,
  },
  // Header
  header: {
    borderBottom: "2 solid #c9a84c",
    paddingBottom: 12,
    marginBottom: 20,
  },
  characterName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#c9a84c",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#8b8699",
  },
  // Quick stats row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1a1825",
    border: "1 solid #2e2b3d",
    borderRadius: 6,
    padding: "8 6",
    alignItems: "center",
  },
  statBoxValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#f0ece4",
  },
  statBoxLabel: {
    fontSize: 8,
    color: "#4a4759",
    textTransform: "uppercase",
    marginTop: 2,
  },
  // Two-column layout
  columns: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  // Section
  section: {
    backgroundColor: "#1a1825",
    border: "1 solid #2e2b3d",
    borderRadius: 6,
    padding: "10 12",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#c9a84c",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1 solid #2e2b3d",
    paddingBottom: 4,
    marginBottom: 8,
  },
  // Ability score grid
  abilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  abilityBox: {
    width: "30%",
    backgroundColor: "#0f0e17",
    border: "1 solid #2e2b3d",
    borderRadius: 4,
    padding: "6 4",
    alignItems: "center",
    marginBottom: 4,
  },
  abilityShort: {
    fontSize: 7,
    color: "#4a4759",
    textTransform: "uppercase",
  },
  abilityScore: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#f0ece4",
    marginTop: 2,
  },
  abilityMod: {
    fontSize: 9,
    color: "#c9a84c",
  },
  // Row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowLabel: {
    color: "#4a4759",
    fontSize: 9,
  },
  rowValue: {
    color: "#8b8699",
    fontSize: 9,
    textAlign: "right",
    maxWidth: "65%",
  },
  // HP section
  hpValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#52c97a",
    textAlign: "center",
    marginBottom: 4,
  },
  hpLabel: {
    fontSize: 8,
    color: "#4a4759",
    textAlign: "center",
  },
  // Badges
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  badge: {
    backgroundColor: "#232136",
    border: "1 solid #2e2b3d",
    borderRadius: 4,
    padding: "2 6",
    fontSize: 8,
    color: "#8b8699",
  },
  badgeGold: {
    backgroundColor: "#c9a84c22",
    border: "1 solid #c9a84c44",
    borderRadius: 4,
    padding: "2 6",
    fontSize: 8,
    color: "#c9a84c",
  },
  // Footer
  footer: {
    marginTop: 20,
    borderTop: "1 solid #2e2b3d",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#4a4759",
  },
  // Spell list
  spellItem: {
    fontSize: 9,
    color: "#8b8699",
    marginBottom: 2,
  },
  // Notes
  notesText: {
    fontSize: 9,
    color: "#8b8699",
    lineHeight: 1.5,
  },
});

// ── Component ──────────────────────────────────────────────────────────────

type Props = { character: CharacterFull };

export function CharacterPdfDocument({ character: c }: Props) {
  const hitDie = CLASS_HIT_DIE[c.class] ?? 8;
  const conMod = Math.floor((c.constitution - 10) / 2);
  const dexMod = Math.floor((c.dexterity - 10) / 2);
  const hp = c.currentHp ?? maxHp(hitDie, c.level, conMod);
  const hpMax = maxHp(hitDie, c.level, conMod);
  const ac = 10 + dexMod;
  const initiative = dexMod;
  const prof = Math.ceil(c.level / 4) + 1;

  const equipment = safeJson<{ name: string; qty: number }[]>(c.equipment, []);
  const cantrips = safeJson<string[]>(c.cantrips, []);
  const spells = safeJson<string[]>(c.spells, []);
  const personalityTraits = safeJson<string[]>(c.personalityTraits, []);
  const ideals = safeJson<string[]>(c.ideals, []);
  const bonds = safeJson<string[]>(c.bonds, []);
  const flaws = safeJson<string[]>(c.flaws, []);

  const clsLabel = CLASS_LABELS[c.class] ?? c.class;
  const raceLabel = RACE_LABELS[c.race] ?? c.race;

  return (
    <Document
      title={`Karta Postaci — ${c.name}`}
      author="Kroniki Przygód"
      subject="D&D 5e — Karta Postaci"
    >
      <Page size="A4" style={S.page}>

        {/* ── Nagłówek ── */}
        <View style={S.header}>
          <Text style={S.characterName}>{c.name}</Text>
          <Text style={S.subtitle}>
            {raceLabel} · {clsLabel} · Poziom {c.level}
            {c.alignment ? `  ·  ${ALIGNMENT_PL[c.alignment] ?? c.alignment}` : ""}
          </Text>
          <View style={S.badgesRow}>
            <Text style={S.badgeGold}>{clsLabel.toUpperCase()}</Text>
            <Text style={S.badge}>{raceLabel.toUpperCase()}</Text>
            {c.alignment && <Text style={S.badge}>{c.alignment}</Text>}
            {c.background && <Text style={S.badge}>{c.background.toUpperCase()}</Text>}
          </View>
        </View>

        {/* ── Szybkie statsy ── */}
        <View style={S.statsRow}>
          <View style={S.statBox}>
            <Text style={S.statBoxValue}>{hp}</Text>
            <Text style={S.statBoxLabel}>HP ({hpMax} max)</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statBoxValue}>{ac}</Text>
            <Text style={S.statBoxLabel}>Klasa Pancerza</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statBoxValue}>{initiative >= 0 ? `+${initiative}` : `${initiative}`}</Text>
            <Text style={S.statBoxLabel}>Inicjatywa</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statBoxValue}>+{prof}</Text>
            <Text style={S.statBoxLabel}>Bon. Biegłości</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statBoxValue}>{hitDie}</Text>
            <Text style={S.statBoxLabel}>Kość Życia</Text>
          </View>
        </View>

        {/* ── Dwie kolumny ── */}
        <View style={S.columns}>

          {/* Lewa kolumna */}
          <View style={S.col}>

            {/* Wartości Cech */}
            <View style={S.section}>
              <Text style={S.sectionTitle}>Wartości Cech</Text>
              <View style={S.abilityGrid}>
                {STAT_LABELS.map(({ key, short }) => (
                  <View key={key} style={S.abilityBox}>
                    <Text style={S.abilityShort}>{short}</Text>
                    <Text style={S.abilityScore}>{c[key]}</Text>
                    <Text style={S.abilityMod}>{mod(c[key])}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Osobowość */}
            {(personalityTraits.length > 0 || ideals.length > 0 || bonds.length > 0 || flaws.length > 0) && (
              <View style={S.section}>
                <Text style={S.sectionTitle}>Osobowość</Text>
                {personalityTraits.map((t, i) => (
                  <View key={i} style={S.row}>
                    <Text style={S.rowLabel}>Cecha</Text>
                    <Text style={S.rowValue}>{t}</Text>
                  </View>
                ))}
                {ideals.map((t, i) => (
                  <View key={i} style={S.row}>
                    <Text style={S.rowLabel}>Ideał</Text>
                    <Text style={S.rowValue}>{t}</Text>
                  </View>
                ))}
                {bonds.map((t, i) => (
                  <View key={i} style={S.row}>
                    <Text style={S.rowLabel}>Więź</Text>
                    <Text style={S.rowValue}>{t}</Text>
                  </View>
                ))}
                {flaws.map((t, i) => (
                  <View key={i} style={S.row}>
                    <Text style={S.rowLabel}>Wada</Text>
                    <Text style={S.rowValue}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Historia */}
            {c.description && (
              <View style={S.section}>
                <Text style={S.sectionTitle}>Historia Postaci</Text>
                <Text style={S.notesText}>{c.description}</Text>
              </View>
            )}

          </View>

          {/* Prawa kolumna */}
          <View style={S.col}>

            {/* Info ogólne */}
            <View style={S.section}>
              <Text style={S.sectionTitle}>Informacje</Text>
              {c.age && <View style={S.row}><Text style={S.rowLabel}>Wiek</Text><Text style={S.rowValue}>{c.age} lat</Text></View>}
              {c.height && <View style={S.row}><Text style={S.rowLabel}>Wzrost</Text><Text style={S.rowValue}>{c.height} cm</Text></View>}
              {c.gender && <View style={S.row}><Text style={S.rowLabel}>Płeć</Text><Text style={S.rowValue}>{c.gender}</Text></View>}
              <View style={S.row}><Text style={S.rowLabel}>Złoto</Text><Text style={S.rowValue}>{c.gold} sz.</Text></View>
            </View>

            {/* Ekwipunek */}
            {equipment.length > 0 && (
              <View style={S.section}>
                <Text style={S.sectionTitle}>Ekwipunek</Text>
                {equipment.map((item, i) => (
                  <View key={i} style={S.row}>
                    <Text style={S.rowValue}>{item.name}</Text>
                    <Text style={S.rowLabel}>×{item.qty}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Magia */}
            {(cantrips.length > 0 || spells.length > 0) && (
              <View style={S.section}>
                <Text style={S.sectionTitle}>Zaklęcia</Text>
                {cantrips.length > 0 && (
                  <>
                    <Text style={[S.rowLabel, { marginBottom: 4 }]}>Cantripy:</Text>
                    {cantrips.map((id, i) => (
                      <Text key={i} style={S.spellItem}>• {id}</Text>
                    ))}
                  </>
                )}
                {spells.length > 0 && (
                  <>
                    <Text style={[S.rowLabel, { marginTop: 6, marginBottom: 4 }]}>Zaklęcia poz. 1:</Text>
                    {spells.map((id, i) => (
                      <Text key={i} style={S.spellItem}>• {id}</Text>
                    ))}
                  </>
                )}
              </View>
            )}

            {/* Notatki sesji */}
            {c.sessionNotes && (
              <View style={S.section}>
                <Text style={S.sectionTitle}>Notatki z Sesji</Text>
                <Text style={S.notesText}>{c.sessionNotes}</Text>
              </View>
            )}

          </View>
        </View>

        {/* ── Stopka ── */}
        <View style={S.footer}>
          <Text style={S.footerText}>Kroniki Przygód — Karta Postaci</Text>
          <Text style={S.footerText}>D&D 5e SRD 5.2.1 · CC-BY-4.0</Text>
          <Text style={S.footerText}>{new Date().toLocaleDateString("pl-PL")}</Text>
        </View>

      </Page>
    </Document>
  );
}
