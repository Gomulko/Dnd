"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RACES } from "@/data/dnd/races";
import type { Race, Subrace, StatKey } from "@/data/dnd/races";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import Tooltip from "@/shared/ui/Tooltip";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const STAT_LABELS: Record<StatKey, string> = {
  str: "SIŁ", dex: "ZRR", con: "KON", int: "INT", wis: "MĄD", cha: "CHA",
};

const PHB_TOOLTIP     = "Player's Handbook — oficjalna, podstawowa rasa z podręcznika D&D 5e (System Reference Document 5.2.1 CC-BY-4.0).";
const SPEED_TOOLTIP   = "Ile stóp możesz przejść w jednej turze walki (1 stopa ≈ 30 cm). Większość ras ma 30 stóp (≈ 9 m na turę).";
const SIZE_SMALL_TOOLTIP  = "Małe rasy mają trudności z ciężką bronią — broń przeznaczona dla Średnich wymaga dwóch rąk.";
const SIZE_MEDIUM_TOOLTIP = "Rasy Średniego rozmiaru mogą używać każdej broni bez ograniczeń.";
const STAT_BONUS_TOOLTIP  = "Stały bonus dodawany do cechy — niezależnie od twoich wyborów. Kumuluje się z wartością z kroku Cechy.";
const SUBRACE_TOOLTIP     = "Specjalizacja rasy — daje dodatkowe cechy, bonusy i czasem zaklęcia. Wybierana raz, na stałe.";

function statBonusesText(bonuses: Partial<Record<StatKey, number>>): string {
  return Object.entries(bonuses)
    .map(([k, v]) => `+${v} ${STAT_LABELS[k as StatKey]}`)
    .join(", ");
}

type Props = { basePath?: string };

export default function RasaForm({ basePath = "/kreator" }: Props) {
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
    <div className="wizard-card" style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 2 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Wybierz Rasę
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>
          Rasa określa cechy rasowe, bonusy do statystyk i dostępne języki.
        </p>
      </div>

      <div className="rasa-layout" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

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
              fontSize: 17,
              padding: "10px 0",
              outline: "none",
              marginBottom: 20,
              boxSizing: "border-box",
            }}
          />

          {/* Grid ras */}
          <div className="rasa-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
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
                      fontFamily: FONT_UI, fontSize: 16, color: WHITE,
                    }}>✓</span>
                  )}
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{race.icon}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, color: active ? WHITE : BLACK, marginBottom: 3 }}>
                    {race.name}
                  </div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, color: active ? LIGHT : MID }}>{race.roleplayHint}</div>
                  {race.source === "PHB" && (
                    <Tooltip content={PHB_TOOLTIP} position="top">
                      <div style={{
                        marginTop: 6, fontFamily: FONT_UI, fontSize: 16, color: active ? LIGHT : MID,
                        border: `1px solid ${active ? LIGHT : LIGHT}`,
                        padding: "1px 5px", display: "inline-block", cursor: "help",
                      }}>PHB</div>
                    </Tooltip>
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
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: "0 0 4px" }}>
                {selectedRace.name}
              </h3>
              <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginBottom: 16 }}>{selectedRace.description}</p>

              {/* Podstawowe info */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <Tooltip content={SPEED_TOOLTIP} position="top"><Pill label={`Prędkość: ${selectedRace.speed} stóp`} hoverable /></Tooltip>
                <Tooltip content={selectedRace.size === "Small" ? SIZE_SMALL_TOOLTIP : SIZE_MEDIUM_TOOLTIP} position="top">
                  <Pill label={selectedRace.size === "Small" ? "Mały" : "Średni"} hoverable />
                </Tooltip>
                {selectedRace.source === "PHB" && (
                  <Tooltip content={PHB_TOOLTIP} position="top"><Pill label={selectedRace.source} hoverable /></Tooltip>
                )}
              </div>

              {/* Bonusy statystyk */}
              {Object.keys(selectedRace.statBonuses).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle>Bonusy statystyk</SectionTitle>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.entries(selectedRace.statBonuses).map(([k, v]) => (
                      <Tooltip key={k} content={STAT_BONUS_TOOLTIP} position="top">
                        <span style={{
                          border: `1px solid ${BLACK}`,
                          padding: "2px 8px", fontFamily: FONT_UI, fontSize: 16, color: BLACK, fontWeight: 600,
                          cursor: "help",
                        }}>
                          +{v} {STAT_LABELS[k as StatKey]}
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

              {/* Podrasy */}
              {selectedRace.subraces.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle tooltip={SUBRACE_TOOLTIP}>Podrasa</SectionTitle>
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
                          <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, color: active ? WHITE : BLACK }}>
                            {sub.name}
                          </div>
                          {Object.keys(sub.statBonuses).length > 0 && (
                            <div style={{ fontFamily: FONT_UI, fontSize: 16, color: active ? LIGHT : MID, marginTop: 2 }}>
                              {statBonusesText(sub.statBonuses)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Box z opisem wybranej podrasy */}
                  {selectedSubrace && selectedSubrace.traits.length > 0 && (
                    <div style={{
                      marginTop: 10,
                      border: `1px solid ${LIGHT}`,
                      padding: "10px 12px",
                      background: "#fafafa",
                    }}>
                      {selectedSubrace.traits.map((trait) => (
                        <div key={trait.nameEn} style={{ marginBottom: 6, lineHeight: 1.5 }}>
                          <span style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, color: BLACK, textTransform: "uppercase", letterSpacing: "1px" }}>
                            {trait.name}
                          </span>
                          <span style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, marginLeft: 6 }}>
                            {trait.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, color: BLACK }}>{trait.name}</div>
                      <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginTop: 2, lineHeight: 1.5 }}>{trait.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Języki */}
              <div>
                <SectionTitle>Języki</SectionTitle>
                <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{selectedRace.languages.join(", ")}</p>
              </div>
            </div>
          ) : (
            <div style={{
              background: WHITE, border: `1.5px dashed ${LIGHT}`,
              padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
              <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>Wybierz rasę, aby zobaczyć szczegóły</p>
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
          onClick={() => router.push(`${basePath}/koncept`)}
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
          onClick={() => router.push(`${basePath}/klasa`)}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Klasa →
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <div style={{
      fontFamily: FONT_UI, fontSize: 16, color: MID,
      textTransform: "uppercase", letterSpacing: "2px",
      borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4, marginBottom: 8,
    }}>
      {tooltip ? (
        <Tooltip content={tooltip} position="left">
          <span style={{ borderBottom: `1px dashed ${LIGHT}`, cursor: "help" }}>{children}</span>
        </Tooltip>
      ) : children}
    </div>
  );
}

function Pill({ label, hoverable = false }: { label: string; hoverable?: boolean }) {
  return (
    <span style={{
      fontFamily: FONT_UI, fontSize: 16, padding: "2px 8px",
      border: `1px solid ${LIGHT}`, color: MID,
      cursor: hoverable ? "help" : undefined,
    }}>
      {label}
    </span>
  );
}
