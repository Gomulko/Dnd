"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CLASSES } from "@/data/dnd/classes";
import type { ClassData, ClassRole, SkillKey } from "@/data/dnd/classes";
import { useWizardStore } from "@/domains/character/store/wizardStore";

// ── Stałe ─────────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<ClassRole, string> = {
  DAMAGE: "Damage", TANK: "Tank", SUPPORT: "Support",
  KONTROLA: "Kontrola", HYBRID: "Hybrid",
};

const ROLE_COLORS: Record<ClassRole, string> = {
  DAMAGE: "#e05252", TANK: "#5c9be8", SUPPORT: "#52c97a",
  KONTROLA: "#7c5cbf", HYBRID: "#c9a84c",
};

const STAT_LABELS: Record<string, string> = {
  str: "SIŁ", dex: "ZRR", con: "KON", int: "INT", wis: "MĄD", cha: "CHA",
};

const SKILL_LABELS: Record<SkillKey, string> = {
  acrobatics: "Akrobatyka", arcana: "Arkana", athletics: "Atletyka",
  deception: "Podstęp", history: "Historia", insight: "Wnikliwość",
  intimidation: "Zastraszanie", investigation: "Poszukiwanie", medicine: "Medycyna",
  nature: "Natura", perception: "Percepcja", performance: "Występy",
  persuasion: "Perswazja", religion: "Religia", sleightOfHand: "Zręczność rąk",
  stealth: "Ukrywanie", survival: "Przetrwanie", animalHandling: "Obsługa zwierząt",
};

const FILTERS: { label: string; value: ClassRole | "ALL" }[] = [
  { label: "Wszystkie", value: "ALL" },
  { label: "Damage", value: "DAMAGE" },
  { label: "Tank", value: "TANK" },
  { label: "Support", value: "SUPPORT" },
  { label: "Kontrola", value: "KONTROLA" },
  { label: "Hybrid", value: "HYBRID" },
];

// ── Komponent ─────────────────────────────────────────────────────────────────

export default function KlasaForm() {
  const router = useRouter();
  const { step2, step3, setStep3 } = useWizardStore();
  const [filter, setFilter] = useState<ClassRole | "ALL">("ALL");

  const selectedClass = CLASSES.find((c) => c.id === step3.class) ?? null;
  const filtered = filter === "ALL" ? CLASSES : CLASSES.filter((c) => c.role === filter);
  const canProceed = !!step3.class && !!step3.subclass && step3.skills.length === (selectedClass?.skillCount ?? 0);

  function selectClass(cls: ClassData) {
    setStep3({
      class: cls.id,
      subclass: cls.subclasses[0]?.id ?? null,
      skills: [],
    });
  }

  function toggleSkill(skill: SkillKey) {
    const already = step3.skills.includes(skill);
    const max = selectedClass?.skillCount ?? 0;
    if (already) {
      setStep3({ skills: step3.skills.filter((s) => s !== skill) });
    } else if (step3.skills.length < max) {
      setStep3({ skills: [...step3.skills, skill] });
    }
  }

  const synergyRace = step2.race;

  return (
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 3 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Wybierz Klasę
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Klasa definiuje umiejętności bojowe, magiczne i styl gry twojej postaci.
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      {/* Filtry */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          const color = value === "ALL" ? "#c9a84c" : ROLE_COLORS[value as ClassRole];
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400,
                border: active ? `1px solid ${color}` : "1px solid #2e2b3d",
                background: active ? `${color}18` : "transparent",
                color: active ? color : "#8b8699", cursor: "pointer",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Grid klas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {filtered.map((cls) => {
              const active = step3.class === cls.id;
              const roleColor = ROLE_COLORS[cls.role];
              const hasSynergy = cls.synergies.includes(synergyRace);
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => selectClass(cls)}
                  style={{
                    padding: "14px 12px", borderRadius: 10, textAlign: "left", cursor: "pointer",
                    border: active ? `2px solid #c9a84c` : "1px solid #2e2b3d",
                    background: active ? "rgba(201,168,76,0.08)" : "#1a1825",
                    position: "relative", transition: "all 0.15s",
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 8, right: 8, width: 18, height: 18,
                      borderRadius: "50%", background: "#c9a84c", color: "#0f0e17",
                      fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✓</span>
                  )}
                  {hasSynergy && !active && (
                    <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, color: "#52c97a" }}>★</span>
                  )}

                  <div style={{ fontSize: 22, marginBottom: 6 }}>{cls.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#c9a84c" : "#f0ece4", marginBottom: 4 }}>
                    {cls.name}
                  </div>

                  {/* Rola */}
                  <span style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 3,
                    background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}30`,
                    display: "inline-block", marginBottom: 6,
                  }}>
                    {ROLE_LABELS[cls.role]}
                  </span>

                  {/* Trudność + Hit Die */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3].map((d) => (
                        <div key={d} style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: d <= cls.difficulty ? "#c9a84c" : "#2e2b3d",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 9, color: "#4a4759" }}>k{cls.hitDie}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ color: "#4a4759", textAlign: "center", padding: 40 }}>Brak klas dla tego filtra</div>
          )}
        </div>

        {/* Panel szczegółów */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {selectedClass ? (
            <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${ROLE_COLORS[selectedClass.role]}, transparent)` }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{selectedClass.icon}</div>
                <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 15, color: "#f0ece4", margin: "0 0 4px" }}>
                  {selectedClass.name}
                </h3>
                <p style={{ fontSize: 11, color: "#8b8699", marginBottom: 16 }}>{selectedClass.description}</p>

                {/* Statsy */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <Pill label={`k${selectedClass.hitDie} HD`} />
                  <Pill label={ROLE_LABELS[selectedClass.role]} color={ROLE_COLORS[selectedClass.role]} />
                  {selectedClass.spellcasting && <Pill label="Magia" color="#7c5cbf" />}
                </div>

                {/* Saving throws */}
                <Section title="Rzuty Obronne">
                  <p style={{ fontSize: 11, color: "#8b8699" }}>
                    {selectedClass.savingThrows.map((s) => STAT_LABELS[s]).join(", ")}
                  </p>
                </Section>

                {/* Zbroja */}
                <Section title="Zbroja">
                  <p style={{ fontSize: 11, color: "#8b8699" }}>{selectedClass.armorTraining.join(", ")}</p>
                </Section>

                {/* Subklasa */}
                {selectedClass.subclasses.length > 0 && (
                  <Section title="Subklasa">
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {selectedClass.subclasses.map((sub) => {
                        const active = step3.subclass === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setStep3({ subclass: sub.id })}
                            style={{
                              padding: "8px 10px", borderRadius: 7, textAlign: "left", cursor: "pointer",
                              border: active ? "1px solid #c9a84c" : "1px solid #2e2b3d",
                              background: active ? "rgba(201,168,76,0.08)" : "#0f0e17",
                            }}
                          >
                            <div style={{ fontSize: 11, fontWeight: 600, color: active ? "#c9a84c" : "#f0ece4" }}>
                              {sub.name}
                            </div>
                            <div style={{ fontSize: 10, color: "#4a4759", marginTop: 2 }}>{sub.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </Section>
                )}

                {/* Umiejętności */}
                <Section title={`Umiejętności (${step3.skills.length}/${selectedClass.skillCount})`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {selectedClass.skillChoices.map((skill) => {
                      const chosen = step3.skills.includes(skill);
                      const maxed = step3.skills.length >= selectedClass.skillCount && !chosen;
                      return (
                        <button
                          key={skill}
                          type="button"
                          disabled={maxed}
                          onClick={() => toggleSkill(skill)}
                          style={{
                            padding: "5px 10px", borderRadius: 5, textAlign: "left", cursor: maxed ? "not-allowed" : "pointer",
                            border: chosen ? "1px solid #c9a84c" : "1px solid #2e2b3d",
                            background: chosen ? "rgba(201,168,76,0.08)" : "transparent",
                            fontSize: 11, color: chosen ? "#c9a84c" : maxed ? "#4a4759" : "#8b8699",
                          }}
                        >
                          {chosen ? "✓ " : ""}{SKILL_LABELS[skill]}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              </div>
            </div>
          ) : (
            <div style={{ background: "#1a1825", border: "1px dashed #2e2b3d", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚔</div>
              <p style={{ fontSize: 12, color: "#4a4759" }}>Wybierz klasę, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/rasa")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/cechy")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: canProceed ? "linear-gradient(135deg, #c9a84c, #b8943c)" : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Cechy →
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Pill({ label, color = "#8b8699" }: { label: string; color?: string }) {
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#232136", color, border: "1px solid #2e2b3d" }}>
      {label}
    </span>
  );
}
