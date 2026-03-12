"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CLASSES } from "@/data/dnd/classes";
import type { ClassData, ClassRole, SkillKey } from "@/data/dnd/classes";
import { useWizardStore } from "@/domains/character/store/wizardStore";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

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
    <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 3 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Wybierz Klasę
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, margin: 0 }}>
          Klasa definiuje umiejętności bojowe, magiczne i styl gry twojej postaci.
        </p>
      </div>

      {/* Filtry */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              style={{
                padding: "6px 14px", fontFamily: FONT_UI, fontSize: 16,
                border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                background: active ? BLACK : "transparent",
                color: active ? WHITE : MID, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "1px",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* Grid klas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {filtered.map((cls) => {
              const active = step3.class === cls.id;
              const hasSynergy = cls.synergies.includes(synergyRace);
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => selectClass(cls)}
                  style={{
                    padding: "14px 12px", textAlign: "left", cursor: "pointer",
                    border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                    background: active ? BLACK : "transparent",
                    position: "relative",
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      fontFamily: FONT_UI, fontSize: 13, color: WHITE,
                    }}>✓</span>
                  )}
                  {hasSynergy && !active && (
                    <span style={{ position: "absolute", top: 8, right: 8, fontFamily: FONT_UI, fontSize: 13, color: MID }}>★</span>
                  )}

                  <div style={{ fontSize: 24, marginBottom: 6 }}>{cls.icon}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, color: active ? WHITE : BLACK, marginBottom: 4 }}>
                    {cls.name}
                  </div>

                  {/* Rola */}
                  <span style={{
                    fontFamily: FONT_UI, fontSize: 16, padding: "1px 6px",
                    border: `1px solid ${active ? LIGHT : LIGHT}`,
                    color: active ? LIGHT : MID,
                    display: "inline-block", marginBottom: 6,
                  }}>
                    {ROLE_LABELS[cls.role]}
                  </span>

                  {/* Trudność + Hit Die */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3].map((d) => (
                        <div key={d} style={{
                          width: 5, height: 5,
                          background: d <= cls.difficulty ? (active ? WHITE : BLACK) : LIGHT,
                        }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: FONT_UI, fontSize: 16, color: active ? LIGHT : MID }}>k{cls.hitDie}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ fontFamily: FONT_UI, color: MID, textAlign: "center", padding: 40 }}>Brak klas dla tego filtra</div>
          )}
        </div>

        {/* Panel szczegółów */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {selectedClass ? (
            <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{selectedClass.icon}</div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: "0 0 4px" }}>
                {selectedClass.name}
              </h3>
              <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginBottom: 16 }}>{selectedClass.description}</p>

              {/* Statsy */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <Pill label={`k${selectedClass.hitDie} HD`} />
                <Pill label={ROLE_LABELS[selectedClass.role]} />
                {selectedClass.spellcasting && <Pill label="Magia" />}
              </div>

              {/* Saving throws */}
              <Section title="Rzuty Obronne">
                <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>
                  {selectedClass.savingThrows.map((s) => STAT_LABELS[s]).join(", ")}
                </p>
              </Section>

              {/* Zbroja */}
              <Section title="Zbroja">
                <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{selectedClass.armorTraining.join(", ")}</p>
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
                            padding: "8px 10px", textAlign: "left", cursor: "pointer",
                            border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                            background: active ? BLACK : "transparent",
                          }}
                        >
                          <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, color: active ? WHITE : BLACK }}>
                            {sub.name}
                          </div>
                          <div style={{ fontFamily: FONT_UI, fontSize: 13, color: active ? LIGHT : MID, marginTop: 2 }}>{sub.description}</div>
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
                          padding: "5px 10px", textAlign: "left", cursor: maxed ? "not-allowed" : "pointer",
                          border: chosen ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                          background: chosen ? BLACK : "transparent",
                          fontFamily: FONT_UI, fontSize: 16,
                          color: chosen ? WHITE : maxed ? LIGHT : MID,
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        {/* Custom checkbox */}
                        <span style={{
                          width: 14, height: 14, flexShrink: 0, display: "inline-flex",
                          alignItems: "center", justifyContent: "center",
                          border: chosen ? "1.5px solid #ffffff" : `1.5px solid ${LIGHT}`,
                          background: chosen ? WHITE : "transparent",
                          fontSize: 16, color: BLACK,
                        }}>
                          {chosen ? "✓" : ""}
                        </span>
                        {SKILL_LABELS[skill]}
                      </button>
                    );
                  })}
                </div>
              </Section>
            </div>
          ) : (
            <div style={{ background: WHITE, border: `1.5px dashed ${LIGHT}`, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚔</div>
              <p style={{ fontFamily: FONT_UI, fontSize: 15, color: MID }}>Wybierz klasę, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/rasa")}
          style={{
            padding: "10px 28px",
            border: "1.5px solid #0a0a0a", background: "transparent",
            color: BLACK, fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/cechy")}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
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
      <div style={{
        fontFamily: FONT_UI, fontSize: 16, color: MID,
        textTransform: "uppercase", letterSpacing: "2px",
        borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4, marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: FONT_UI, fontSize: 13, padding: "2px 8px", border: `1px solid ${LIGHT}`, color: MID }}>
      {label}
    </span>
  );
}

// Keep ROLE_COLORS in scope (used for reference but styling is now editorial)
void ROLE_COLORS;
