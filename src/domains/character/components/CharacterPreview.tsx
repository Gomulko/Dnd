"use client";

import { useWizardStore } from "@/domains/character/store/wizardStore";

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

const CLASS_COLORS: Record<string, string> = {
  barbarian: "#e05252", bard: "#7c5cbf", cleric: "#e8c97a", druid: "#52c97a",
  fighter: "#e05252", monk: "#52c97a", paladin: "#e8c97a", ranger: "#52c97a",
  rogue: "#8b8699", sorcerer: "#7c5cbf", warlock: "#7c5cbf", wizard: "#5c9be8",
};

function initials(name: string) {
  return name.trim()
    ? name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
}

export default function CharacterPreview() {
  const { step1, step2, step3 } = useWizardStore();

  const accentColor = CLASS_COLORS[step3.class] ?? "#c9a84c";
  const hasName = step1.name.trim().length > 0;
  const raceLabel = RACE_LABELS[step2.race] ?? step2.race;
  const classLabel = CLASS_LABELS[step3.class] ?? step3.class;

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        position: "sticky",
        top: 140,
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          background: "#1a1825",
          border: "1px solid #2e2b3d",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 10, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Podgląd postaci
          </div>

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                border: `2px solid ${accentColor}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 20,
                fontWeight: 700,
                color: accentColor,
              }}
            >
              {initials(step1.name)}
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 14,
              fontWeight: 700,
              color: hasName ? "#f0ece4" : "#4a4759",
              textAlign: "center",
              marginBottom: 4,
              minHeight: 20,
            }}
          >
            {hasName ? step1.name : "Imię postaci"}
          </div>

          {/* Race / Class */}
          <div style={{ fontSize: 11, color: "#8b8699", textAlign: "center", marginBottom: 16 }}>
            {raceLabel && classLabel
              ? `${raceLabel} · ${classLabel}`
              : raceLabel || classLabel || <span style={{ color: "#4a4759" }}>Rasa · Klasa</span>}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#2e2b3d", marginBottom: 14 }} />

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
      <span style={{ fontSize: 11, color: "#4a4759" }}>{label}</span>
      <span style={{ fontSize: 11, color: "#8b8699", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
