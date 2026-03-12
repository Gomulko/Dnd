"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardStep4 } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import type { StatKey } from "@/data/dnd/races";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

// ── Stałe SRD ─────────────────────────────────────────────────────────────────

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
const POINT_BUY_BUDGET = 27;

const STATS: { key: keyof Omit<WizardStep4, "method">; label: string; acc: string; short: string }[] = [
  { key: "strength", label: "Siła", acc: "Siłę", short: "SIŁ" },
  { key: "dexterity", label: "Zręczność", acc: "Zręczność", short: "ZRR" },
  { key: "constitution", label: "Kondycja", acc: "Kondycję", short: "KON" },
  { key: "intelligence", label: "Intelekt", acc: "Intelekt", short: "INT" },
  { key: "wisdom", label: "Mądrość", acc: "Mądrość", short: "MĄD" },
  { key: "charisma", label: "Charyzma", acc: "Charyzmę", short: "CHA" },
];

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function racialBonus(raceId: string, statKey: keyof Omit<WizardStep4, "method">): number {
  const statMap: Record<string, StatKey> = {
    strength: "str", dexterity: "dex", constitution: "con",
    intelligence: "int", wisdom: "wis", charisma: "cha",
  };
  const race = RACES.find((r) => r.id === raceId);
  return race?.statBonuses[statMap[statKey]] ?? 0;
}

function pointBuySpent(step4: WizardStep4): number {
  return STATS.reduce((sum, { key }) => sum + (POINT_BUY_COSTS[step4[key]] ?? 0), 0);
}

function rollStat(): number {
  const rolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
  rolls.sort((a, b) => b - a);
  return rolls.slice(0, 3).reduce((s, n) => s + n, 0);
}

// ── Główny komponent ───────────────────────────────────────────────────────────

export default function CechyForm() {
  const router = useRouter();
  const { step2, step3, step4, setStep4 } = useWizardStore();

  const cls = CLASSES.find((c) => c.id === step3.class);
  const method = step4.method;

  // Walidacja — Standard Array: wszystkie wartości muszą być przypisane (różne)
  const standardValues = STATS.map(({ key }) => step4[key]);
  const isStandardComplete = method !== "standard" || new Set(standardValues).size === 6;
  const canProceed = isStandardComplete;

  // Punkty w Point Buy
  const spent = pointBuySpent(step4);
  const remaining = POINT_BUY_BUDGET - spent;

  // ── Podsumowanie ──
  const conMod = Math.floor((step4.constitution - 10) / 2);
  const dexMod = Math.floor((step4.dexterity - 10) / 2);
  const hitDie = cls?.hitDie ?? 8;
  const maxHp = hitDie + conMod;
  const ac = 10 + dexMod;

  return (
    <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 4 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Wartości Cech
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>
          Przypisz wartości sześciu cech swojej postaci.
        </p>
      </div>

      {/* Zakładki metod */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {(["standard", "pointbuy", "roll"] as const).map((m) => {
          const labels = { standard: "Standardowy Zestaw", pointbuy: "Zakup Punktów", roll: "Rzut Kośćmi" };
          const active = method === m;
          const RESET_STATS = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
          const resetFor = m === "pointbuy"
            ? { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 }
            : m === "roll"
              ? { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 }
              : RESET_STATS;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setStep4({ method: m, ...resetFor })}
              style={{
                flex: 1, padding: "8px 4px",
                fontFamily: FONT_UI, fontSize: 16,
                border: active ? "1.5px solid #0a0a0a" : `1.5px solid ${LIGHT}`,
                background: active ? BLACK : "transparent",
                color: active ? WHITE : MID,
                cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "1px",
              }}
            >
              {labels[m]}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── Standard Array ──────────────────────────────────────── */}
          {method === "standard" && (
            <StandardArray step2race={step2.race} step4={step4} setStep4={setStep4} />
          )}

          {/* ── Point Buy ───────────────────────────────────────────── */}
          {method === "pointbuy" && (
            <PointBuy step2race={step2.race} step4={step4} setStep4={setStep4} remaining={remaining} spent={spent} />
          )}

          {/* ── Roll ────────────────────────────────────────────────── */}
          {method === "roll" && (
            <RollMethod step2race={step2.race} step4={step4} setStep4={setStep4} />
          )}

        </div>

        {/* Panel podsumowania */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: WHITE, border: "1.5px solid #0a0a0a", padding: 16 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14, borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4 }}>
              Podsumowanie
            </div>
            <StatSummaryRow label="Max HP (poz. 1)" value={`${Math.max(1, maxHp)}`} highlight />
            <StatSummaryRow label="Klasa Pancerza" value={`${ac}`} />
            <StatSummaryRow label="Inicjatywa" value={mod(step4.dexterity)} />
            <StatSummaryRow label="Prędkość" value={`${RACES.find((r) => r.id === step2.race)?.speed ?? 30} stóp`} />
            <StatSummaryRow label="Bonus Biegłości" value="+2" />
            {cls?.spellcasting && cls.spellcastingAbility && (
              <StatSummaryRow
                label="DC Zaklęć"
                value={`${8 + 2 + Math.floor((step4[abilityKeyMap[cls.spellcastingAbility]] - 10) / 2)}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/klasa")}
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
          onClick={() => router.push("/kreator/tlo")}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Tło →
        </button>
      </div>
    </div>
  );
}

// ── Mapa ability key → step4 key ──────────────────────────────────────────────

const abilityKeyMap: Record<string, keyof Omit<WizardStep4, "method">> = {
  str: "strength", dex: "dexterity", con: "constitution",
  int: "intelligence", wis: "wisdom", cha: "charisma",
};

// ── Standard Array ─────────────────────────────────────────────────────────────

function StandardArray({ step2race, step4, setStep4 }: {
  step2race: string;
  step4: WizardStep4;
  setStep4: (d: Partial<WizardStep4>) => void;
}) {
  const usedValues = STATS.map(({ key }) => step4[key]).filter((v) => STANDARD_ARRAY.includes(v));

  return (
    <div>
      <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginBottom: 20 }}>
        Przypisz każdą z wartości <strong style={{ color: BLACK }}>15, 14, 13, 12, 10, 8</strong> do jednej cechy. Każda wartość może być użyta tylko raz.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STATS.map(({ key, label, short }) => {
          const bonus = racialBonus(step2race, key);
          const base = step4[key];
          const total = base + bonus;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${LIGHT}` }}>
              <div style={{ width: 36, fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{short}</div>

              <select
                aria-label={label}
                value={base}
                onChange={(e) => setStep4({ [key]: Number(e.target.value) } as Partial<WizardStep4>)}
                style={{
                  flex: 1, height: 36, background: "transparent",
                  border: "none", borderBottom: "1.5px solid #0a0a0a",
                  color: BLACK, fontFamily: FONT_UI, fontSize: 17, outline: "none", cursor: "pointer",
                }}
              >
                <option value={0}>— wybierz —</option>
                {STANDARD_ARRAY.map((v) => {
                  const takenBy = STATS.find((s) => s.key !== key && step4[s.key] === v);
                  return (
                    <option key={v} value={v} disabled={!!takenBy}>
                      {v}{takenBy ? ` (${takenBy.short})` : ""}
                    </option>
                  );
                })}
              </select>

              {bonus !== 0 && (
                <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, width: 44, textAlign: "center" }}>
                  +{bonus} rasa
                </span>
              )}

              <div style={{
                width: 52, height: 48,
                border: "1.5px solid #0a0a0a", background: "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: base ? BLACK : LIGHT }}>{base ? total : "—"}</div>
                {base > 0 && <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{mod(total)}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {usedValues.length < 6 && (
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: "#e05252", marginTop: 12 }}>
          Przypisz wszystkie 6 wartości, aby przejść dalej.
        </p>
      )}
    </div>
  );
}

// ── Point Buy ─────────────────────────────────────────────────────────────────

function PointBuy({ step2race, step4, setStep4, remaining }: {
  step2race: string;
  step4: WizardStep4;
  setStep4: (d: Partial<WizardStep4>) => void;
  remaining: number;
  spent: number;
}) {
  function change(key: keyof Omit<WizardStep4, "method">, delta: number) {
    // eslint-disable-next-line no-unused-vars
    const cur = step4[key];
    const next = cur + delta;
    if (next < 8 || next > 15) return;
    const cost = (POINT_BUY_COSTS[next] ?? 0) - (POINT_BUY_COSTS[cur] ?? 0);
    if (remaining - cost < 0) return;
    setStep4({ [key]: next } as Partial<WizardStep4>);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>
          Masz <strong style={{ color: BLACK }}>27 punktów</strong> do wydania. Wartości od 8 do 15.
        </p>
        <div style={{
          padding: "4px 14px",
          border: `1.5px solid ${remaining === 0 ? BLACK : LIGHT}`,
          fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: remaining === 0 ? BLACK : MID,
        }}>
          {remaining} pkt
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STATS.map(({ key, label, acc, short }) => {
          const bonus = racialBonus(step2race, key);
          const base = step4[key];
          const total = base + bonus;
          const canInc = base < 15 && remaining >= ((POINT_BUY_COSTS[base + 1] ?? 0) - (POINT_BUY_COSTS[base] ?? 0));
          const canDec = base > 8;

          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${LIGHT}` }}>
              <div style={{ width: 36, fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{short}</div>
              <div style={{ width: 60, fontFamily: FONT_UI, fontSize: 16, color: MID }}>{label}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <button
                  type="button"
                  aria-label={`Zmniejsz ${acc}`}
                  disabled={!canDec}
                  onClick={() => change(key, -1)}
                  style={{
                    width: 28, height: 28, border: "1.5px solid #0a0a0a",
                    background: "transparent",
                    color: canDec ? BLACK : LIGHT, fontSize: 16,
                    cursor: canDec ? "pointer" : "not-allowed",
                    opacity: canDec ? 1 : 0.3,
                    fontFamily: FONT_UI,
                  }}
                >−</button>

                <div style={{ textAlign: "center", minWidth: 24 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: BLACK }}>{base}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>koszt {POINT_BUY_COSTS[base]}</div>
                </div>

                <button
                  type="button"
                  aria-label={`Zwiększ ${acc}`}
                  disabled={!canInc}
                  onClick={() => change(key, +1)}
                  style={{
                    width: 28, height: 28, border: "1.5px solid #0a0a0a",
                    background: "transparent",
                    color: canInc ? BLACK : LIGHT, fontSize: 16,
                    cursor: canInc ? "pointer" : "not-allowed",
                    opacity: canInc ? 1 : 0.3,
                    fontFamily: FONT_UI,
                  }}
                >+</button>
              </div>

              {bonus !== 0 && (
                <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, width: 36, textAlign: "center" }}>+{bonus}</span>
              )}

              <div style={{
                width: 52, height: 48,
                border: "1.5px solid #0a0a0a", background: "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: BLACK }}>{total}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{mod(total)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Roll ──────────────────────────────────────────────────────────────────────

function RollMethod({ step2race, step4, setStep4 }: {
  step2race: string;
  step4: WizardStep4;
  setStep4: (d: Partial<WizardStep4>) => void;
}) {
  function rollAll() {
    setStep4({
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat(),
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>
          Rzuć 4k6, odrzuć najniższy wynik — powtórz 6 razy.
        </p>
        <button
          type="button"
          onClick={rollAll}
          style={{
            padding: "8px 18px",
            border: "1.5px solid #0a0a0a", background: "transparent",
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "1px",
            color: BLACK, cursor: "pointer",
          }}
        >
          🎲 Rzuć wszystkie
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STATS.map(({ key, label, acc, short }) => {
          const bonus = racialBonus(step2race, key);
          const base = step4[key];
          const total = base + bonus;

          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${LIGHT}` }}>
              <div style={{ width: 36, fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{short}</div>
              <div style={{ width: 60, fontFamily: FONT_UI, fontSize: 16, color: MID }}>{label}</div>

              <button
                type="button"
                aria-label={`Rzuć ${acc}`}
                onClick={() => setStep4({ [key]: rollStat() } as Partial<WizardStep4>)}
                style={{
                  padding: "4px 12px", border: "1.5px solid #0a0a0a",
                  background: "transparent", color: BLACK,
                  fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                🎲 Rzuć
              </button>

              {bonus !== 0 && (
                <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginLeft: "auto" }}>+{bonus} rasa</span>
              )}

              <div style={{
                width: 52, height: 48, marginLeft: bonus === 0 ? "auto" : 0,
                border: "1.5px solid #0a0a0a", background: "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: BLACK }}>{total}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{mod(total)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Pomocnicze ────────────────────────────────────────────────────────────────

function StatSummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: highlight ? BLACK : BLACK }}>{value}</span>
    </div>
  );
}
