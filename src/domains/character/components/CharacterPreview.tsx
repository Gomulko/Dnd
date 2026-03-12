"use client";

import { useWizardStore } from "@/domains/character/store/wizardStore";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const ALIGNMENT_LABELS: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const RACE_LABELS: Record<string, string> = {
  human: "Człowiek", dwarf: "Krasnolud", elf: "Elf", halfling: "Niziołek",
  gnome: "Gnom", dragonborn: "Drakonid", tiefling: "Tiefling",
  goliath: "Goliath", orc: "Ork", "half-elf": "Półelf", "half-orc": "Półork",
};

const CLASS_LABELS: Record<string, string> = {
  barbarian: "Barbarzyńca", bard: "Bard", cleric: "Kleryk", druid: "Druid",
  fighter: "Wojownik", monk: "Mnich", paladin: "Paladyn", ranger: "Łowca",
  rogue: "Łotrzyk", sorcerer: "Czarownik", warlock: "Warlock", wizard: "Czarodziej",
};

function initials(name: string) {
  return name.trim()
    ? name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
}

export default function CharacterPreview() {
  const { step1, step2, step3 } = useWizardStore();

  const hasName = step1.name.trim().length > 0;
  const raceLabel = RACE_LABELS[step2.race] ?? step2.race;
  const classLabel = CLASS_LABELS[step3.class] ?? step3.class;

  return (
    <aside
      style={{
        width: 200,
        flexShrink: 0,
        position: "sticky",
        top: 140,
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          background: WHITE,
          border: `1.5px solid ${BLACK}`,
        }}
      >
        <div style={{ padding: 20 }}>
          <div style={{
            fontFamily: FONT_UI,
            fontSize: 10,
            color: MID,
            textTransform: "uppercase",
            letterSpacing: "2.5px",
            marginBottom: 16,
            borderBottom: `1px solid ${LIGHT}`,
            paddingBottom: 8,
          }}>
            Podgląd postaci
          </div>

          {/* Inicjały */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                border: `1.5px solid ${BLACK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_DISPLAY,
                fontSize: 22,
                fontStyle: "italic",
                color: BLACK,
              }}
            >
              {initials(step1.name)}
            </div>
          </div>

          {/* Imię */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 17,
              fontWeight: 400,
              fontStyle: "italic",
              color: hasName ? BLACK : LIGHT,
              textAlign: "center",
              marginBottom: 4,
              minHeight: 20,
            }}
          >
            {hasName ? step1.name : "Imię postaci"}
          </div>

          {/* Rasa · Klasa */}
          <div style={{
            fontFamily: FONT_UI,
            fontSize: 12,
            color: MID,
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            {raceLabel && classLabel
              ? `${raceLabel} · ${classLabel}`
              : raceLabel || classLabel || <span style={{ color: LIGHT }}>Rasa · Klasa</span>}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <StatRow label="Poziom" value="1" />
            <StatRow
              label="Alignment"
              value={step1.alignment ? ALIGNMENT_LABELS[step1.alignment]?.split(" ")[0] ?? step1.alignment : "—"}
            />
            <StatRow label="Płeć" value={
              step1.gender === "kobieta" ? "Kobieta"
              : step1.gender === "mezczyzna" ? "Mężczyzna"
              : "Inne"
            } />
            {step1.age && <StatRow label="Wiek" value={`${step1.age} lat`} />}
            {step1.height && <StatRow label="Wzrost" value={`${step1.height} cm`} />}
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
      <span style={{ fontFamily: FONT_UI, fontSize: 14, color: BLACK }}>{value}</span>
    </div>
  );
}
