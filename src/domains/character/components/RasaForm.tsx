"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RACES } from "@/data/dnd/races";
import type { Race, Subrace, StatKey } from "@/data/dnd/races";
import { useWizardStore } from "@/domains/character/store/wizardStore";

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
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 2 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Wybierz Rasę
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Rasa określa cechy rasowe, bonusy do statystyk i dostępne języki.
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Lewa: grid + search */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Wyszukiwarka */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj rasy..."
            style={{
              width: "100%",
              height: 40,
              background: "#0f0e17",
              border: "1px solid #2e2b3d",
              borderRadius: 8,
              color: "#f0ece4",
              fontSize: 13,
              padding: "0 14px",
              outline: "none",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#c9a84c"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#2e2b3d"; }}
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
                    borderRadius: 10,
                    border: active ? "2px solid #c9a84c" : "1px solid #2e2b3d",
                    background: active ? "rgba(201,168,76,0.08)" : "#1a1825",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    transition: "all 0.15s",
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#c9a84c", color: "#0f0e17",
                      fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✓</span>
                  )}
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{race.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#c9a84c" : "#f0ece4", marginBottom: 3 }}>
                    {race.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#4a4759" }}>{race.roleplayHint}</div>
                  {race.source === "PHB" && (
                    <div style={{
                      marginTop: 6, fontSize: 9, color: "#7c5cbf",
                      border: "1px solid #7c5cbf44", borderRadius: 3,
                      padding: "1px 5px", display: "inline-block",
                    }}>PHB</div>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", color: "#4a4759", textAlign: "center", padding: 32 }}>
                Brak wyników dla &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Prawy panel szczegółów */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {selectedRace ? (
            <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{selectedRace.icon}</div>
                <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 16, color: "#f0ece4", margin: "0 0 4px" }}>
                  {selectedRace.name}
                </h3>
                <p style={{ fontSize: 12, color: "#8b8699", marginBottom: 16 }}>{selectedRace.description}</p>

                {/* Podstawowe info */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <Pill label={`Prędkość: ${selectedRace.speed} stóp`} />
                  <Pill label={selectedRace.size === "Small" ? "Mały" : "Średni"} />
                  <Pill label={selectedRace.source} color="#7c5cbf" />
                </div>

                {/* Bonusy statystyk */}
                {Object.keys(selectedRace.statBonuses).length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <SectionTitle>Bonusy statystyk</SectionTitle>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {Object.entries(selectedRace.statBonuses).map(([k, v]) => (
                        <span key={k} style={{
                          background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
                          borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#c9a84c", fontWeight: 600,
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
                              borderRadius: 7,
                              border: active ? "1px solid #c9a84c" : "1px solid #2e2b3d",
                              background: active ? "rgba(201,168,76,0.08)" : "#0f0e17",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.15s",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, color: active ? "#c9a84c" : "#f0ece4" }}>
                              {sub.name}
                            </div>
                            {Object.keys(sub.statBonuses).length > 0 && (
                              <div style={{ fontSize: 10, color: "#8b8699", marginTop: 2 }}>
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
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#f0ece4" }}>{trait.name}</div>
                        <div style={{ fontSize: 10, color: "#8b8699", marginTop: 2, lineHeight: 1.5 }}>{trait.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Języki */}
                <div>
                  <SectionTitle>Języki</SectionTitle>
                  <p style={{ fontSize: 11, color: "#8b8699" }}>{selectedRace.languages.join(", ")}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#1a1825", border: "1px dashed #2e2b3d",
              borderRadius: 12, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
              <p style={{ fontSize: 12, color: "#4a4759" }}>Wybierz rasę, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 40,
        paddingTop: 24, borderTop: "1px solid #2e2b3d",
      }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/koncept")}
          style={{
            padding: "12px 24px", borderRadius: 8,
            border: "1px solid #2e2b3d", background: "transparent",
            color: "#8b8699", fontSize: 14, cursor: "pointer",
          }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/klasa")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: canProceed ? "linear-gradient(135deg, #c9a84c, #b8943c)" : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14, fontWeight: 700,
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
      fontSize: 9, fontWeight: 700, color: "#4a4759",
      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function Pill({ label, color = "#8b8699" }: { label: string; color?: string }) {
  return (
    <span style={{
      fontSize: 10, padding: "2px 8px", borderRadius: 4,
      background: "#232136", color, border: "1px solid #2e2b3d",
    }}>
      {label}
    </span>
  );
}
