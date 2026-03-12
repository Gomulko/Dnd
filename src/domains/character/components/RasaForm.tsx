"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RACES } from "@/data/dnd/races";
import type { Race, Subrace, StatKey } from "@/data/dnd/races";
import { useWizardStore } from "@/domains/character/store/wizardStore";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const STAT_LABELS: Record<StatKey, string> = {
  str: "SIŁ", dex: "ZRR", con: "KON", int: "INT", wis: "MĄD", cha: "CHA",
};

function statBonusesText(bonuses: Partial<Record<StatKey, number>>): string {
  return Object.entries(bonuses)
    .map(([k, v]) => `+${v} ${STAT_LABELS[k as StatKey]}`)
    .join(", ");
}

export default function RasaForm() {
  const router = useRouter();
  const { step2, setStep2 } = useWizardStore();
  const [search, setSearch] = useState("");

  const selectedRace = RACES.find((r) => r.id === step2.race) ?? null;
  const selectedSubrace = selectedRace?.subraces.find((s) => s.id === step2.subrace) ?? null;

  const filtered = search.trim()
    ? RACES.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.roleplayHint.toLowerCase().includes(search.toLowerCase())
      )
    : RACES;

  function selectRace(race: Race) {
    setStep2({ race: race.id, subrace: race.subraces[0]?.id ?? null });
  }

  function selectSubrace(sub: Subrace) {
    setStep2({ subrace: sub.id });
  }

  const canProceed = !!step2.race;

  return (
    <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 7, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 2 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Wybierz Rasę
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, margin: 0 }}>
          Rasa określa cechy rasowe, bonusy do statystyk i dostępne języki.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* Lewa: grid + search */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Wyszukiwarka */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj rasy..."
            style={{
              width: "100%",
              height: 36,
              background: "transparent",
              border: "none",
              borderBottom: "1.5px solid #0a0a0a",
              color: BLACK,
              fontFamily: FONT_UI,
              fontSize: 14,
              padding: "10px 0",
              outline: "none",
              marginBottom: 20,
              boxSizing: "border-box",
            }}
          />

          {/* Grid ras */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {filtered.map((race) => {
              const active = step2.race === race.id;
              return (
                <button
                  key={race.id}
                  type="button"
                  onClick={() => selectRace(race)}
                  style={{
                    padding: "14px 12px",
                    border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                    background: active ? BLACK : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      fontFamily: FONT_UI, fontSize: 10, color: WHITE,
                    }}>✓</span>
                  )}
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{race.icon}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 600, color: active ? WHITE : BLACK, marginBottom: 3 }}>
                    {race.name}
                  </div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 10, color: active ? LIGHT : MID }}>{race.roleplayHint}</div>
                  {race.source === "PHB" && (
                    <div style={{
                      marginTop: 6, fontFamily: FONT_UI, fontSize: 9, color: active ? LIGHT : MID,
                      border: `1px solid ${active ? LIGHT : LIGHT}`,
                      padding: "1px 5px", display: "inline-block",
                    }}>PHB</div>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", fontFamily: FONT_UI, color: MID, textAlign: "center", padding: 32 }}>
                Brak wyników dla &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Prawy panel szczegółów */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {selectedRace ? (
            <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{selectedRace.icon}</div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: "0 0 4px" }}>
                {selectedRace.name}
              </h3>
              <p style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, marginBottom: 16 }}>{selectedRace.description}</p>

              {/* Podstawowe info */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <Pill label={`Prędkość: ${selectedRace.speed} stóp`} />
                <Pill label={selectedRace.size === "Small" ? "Mały" : "Średni"} />
                <Pill label={selectedRace.source} />
              </div>

              {/* Bonusy statystyk */}
              {Object.keys(selectedRace.statBonuses).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle>Bonusy statystyk</SectionTitle>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.entries(selectedRace.statBonuses).map(([k, v]) => (
                      <span key={k} style={{
                        border: `1px solid ${BLACK}`,
                        padding: "2px 8px", fontFamily: FONT_UI, fontSize: 11, color: BLACK, fontWeight: 600,
                      }}>
                        +{v} {STAT_LABELS[k as StatKey]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Podrasy */}
              {selectedRace.subraces.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle>Podrasa</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedRace.subraces.map((sub) => {
                      const active = step2.subrace === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => selectSubrace(sub)}
                          style={{
                            padding: "8px 12px",
                            border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                            background: active ? BLACK : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 600, color: active ? WHITE : BLACK }}>
                            {sub.name}
                          </div>
                          {Object.keys(sub.statBonuses).length > 0 && (
                            <div style={{ fontFamily: FONT_UI, fontSize: 10, color: active ? LIGHT : MID, marginTop: 2 }}>
                              {statBonusesText(sub.statBonuses)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cechy rasowe */}
              <div style={{ marginBottom: 16 }}>
                <SectionTitle>Cechy rasowe</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ...selectedRace.traits,
                    ...(selectedSubrace?.traits ?? []),
                  ].map((trait) => (
                    <div key={trait.nameEn}>
                      <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 600, color: BLACK }}>{trait.name}</div>
                      <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, marginTop: 2, lineHeight: 1.5 }}>{trait.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Języki */}
              <div>
                <SectionTitle>Języki</SectionTitle>
                <p style={{ fontFamily: FONT_UI, fontSize: 11, color: MID }}>{selectedRace.languages.join(", ")}</p>
              </div>
            </div>
          ) : (
            <div style={{
              background: WHITE, border: `1.5px dashed ${LIGHT}`,
              padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
              <p style={{ fontFamily: FONT_UI, fontSize: 12, color: MID }}>Wybierz rasę, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 40,
        paddingTop: 24, borderTop: `1px solid ${LIGHT}`,
      }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/koncept")}
          style={{
            padding: "10px 28px",
            border: "1.5px solid #0a0a0a", background: "transparent",
            color: BLACK, fontFamily: FONT_UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/klasa")}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Klasa →
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_UI, fontSize: 7, color: MID,
      textTransform: "uppercase", letterSpacing: "2px",
      borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: FONT_UI, fontSize: 10, padding: "2px 8px",
      border: `1px solid ${LIGHT}`, color: MID,
    }}>
      {label}
    </span>
  );
}
