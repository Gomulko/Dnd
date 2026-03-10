"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardStep4 } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { RACES } from "@/data/dnd/races";
import type { StatKey } from "@/data/dnd/races";

// ── Stałe SRD ─────────────────────────────────────────────────────────────────

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
const POINT_BUY_BUDGET = 27;

const STATS: { key: keyof Omit<WizardStep4, "method">; label: string; acc: string; short: string }[] = [
  { key: "strength",     label: "Siła",         acc: "Siłę",      short: "SIŁ" },
  { key: "dexterity",    label: "Zręczność",     acc: "Zręczność", short: "ZRR" },
  { key: "constitution", label: "Kondycja",      acc: "Kondycję",  short: "KON" },
  { key: "intelligence", label: "Intelekt",      acc: "Intelekt",  short: "INT" },
  { key: "wisdom",       label: "Mądrość",       acc: "Mądrość",   short: "MĄD" },
  { key: "charisma",     label: "Charyzma",      acc: "Charyzmę",  short: "CHA" },
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
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 4 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Wartości Cech
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Przypisz wartości sześciu cech swojej postaci.
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      {/* Zakładki metod */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#0f0e17", borderRadius: 8, padding: 4 }}>
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
                flex: 1, padding: "8px 4px", borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400,
                border: "none", cursor: "pointer",
                background: active ? "#1a1825" : "transparent",
                color: active ? "#c9a84c" : "#4a4759",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {labels[m]}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
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
          <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
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
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/klasa")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/tlo")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: canProceed ? "linear-gradient(135deg, #c9a84c, #b8943c)" : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed",
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
      <p style={{ fontSize: 12, color: "#8b8699", marginBottom: 20 }}>
        Przypisz każdą z wartości <strong style={{ color: "#c9a84c" }}>15, 14, 13, 12, 10, 8</strong> do jednej cechy. Każda wartość może być użyta tylko raz.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STATS.map(({ key, label, short }) => {
          const bonus = racialBonus(step2race, key);
          const base = step4[key];
          const total = base + bonus;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a1825", borderRadius: 10, padding: "12px 16px", border: "1px solid #2e2b3d" }}>
              <div style={{ width: 36, fontSize: 10, fontWeight: 700, color: "#8b8699", textTransform: "uppercase" }}>{short}</div>

              <select
                aria-label={label}
                value={base}
                onChange={(e) => setStep4({ [key]: Number(e.target.value) } as Partial<WizardStep4>)}
                style={{
                  flex: 1, height: 36, background: "#0f0e17", border: "1px solid #2e2b3d",
                  borderRadius: 6, color: "#f0ece4", fontSize: 13, padding: "0 8px", cursor: "pointer",
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
                <span style={{ fontSize: 11, color: "#52c97a", width: 36, textAlign: "center" }}>
                  +{bonus} rasa
                </span>
              )}

              <div style={{
                width: 52, height: 40, borderRadius: 8,
                background: base ? "rgba(201,168,76,0.1)" : "#0f0e17",
                border: `1px solid ${base ? "#c9a84c44" : "#2e2b3d"}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: base ? "#f0ece4" : "#4a4759" }}>{base ? total : "—"}</div>
                {base > 0 && <div style={{ fontSize: 9, color: "#8b8699" }}>{mod(total)}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {usedValues.length < 6 && (
        <p style={{ fontSize: 11, color: "#e05252", marginTop: 12 }}>
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
        <p style={{ fontSize: 12, color: "#8b8699" }}>
          Masz <strong style={{ color: "#c9a84c" }}>27 punktów</strong> do wydania. Wartości od 8 do 15.
        </p>
        <div style={{
          padding: "4px 14px", borderRadius: 20,
          background: remaining === 0 ? "rgba(82,201,122,0.1)" : "rgba(201,168,76,0.1)",
          border: `1px solid ${remaining === 0 ? "#52c97a44" : "#c9a84c44"}`,
          fontSize: 13, fontWeight: 700, color: remaining === 0 ? "#52c97a" : "#c9a84c",
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
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a1825", borderRadius: 10, padding: "10px 16px", border: "1px solid #2e2b3d" }}>
              <div style={{ width: 36, fontSize: 10, fontWeight: 700, color: "#8b8699", textTransform: "uppercase" }}>{short}</div>
              <div style={{ width: 60, fontSize: 12, color: "#4a4759" }}>{label}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <button
                  type="button"
                  aria-label={`Zmniejsz ${acc}`}
                  disabled={!canDec}
                  onClick={() => change(key, -1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid #2e2b3d",
                    background: canDec ? "#232136" : "#0f0e17",
                    color: canDec ? "#f0ece4" : "#4a4759", fontSize: 16, cursor: canDec ? "pointer" : "not-allowed",
                  }}
                >−</button>

                <div style={{ textAlign: "center", minWidth: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f0ece4" }}>{base}</div>
                  <div style={{ fontSize: 9, color: "#4a4759" }}>koszt {POINT_BUY_COSTS[base]}</div>
                </div>

                <button
                  type="button"
                  aria-label={`Zwiększ ${acc}`}
                  disabled={!canInc}
                  onClick={() => change(key, +1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid #2e2b3d",
                    background: canInc ? "#232136" : "#0f0e17",
                    color: canInc ? "#f0ece4" : "#4a4759", fontSize: 16, cursor: canInc ? "pointer" : "not-allowed",
                  }}
                >+</button>
              </div>

              {bonus !== 0 && (
                <span style={{ fontSize: 11, color: "#52c97a", width: 36, textAlign: "center" }}>+{bonus}</span>
              )}

              <div style={{
                width: 52, height: 40, borderRadius: 8,
                background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c44",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0ece4" }}>{total}</div>
                <div style={{ fontSize: 9, color: "#8b8699" }}>{mod(total)}</div>
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
        <p style={{ fontSize: 12, color: "#8b8699" }}>
          Rzuć 4k6, odrzuć najniższy wynik — powtórz 6 razy.
        </p>
        <button
          type="button"
          onClick={rollAll}
          style={{
            padding: "8px 18px", borderRadius: 8,
            background: "linear-gradient(135deg, #c9a84c, #b8943c)",
            border: "none", color: "#0f0e17", fontSize: 13, fontWeight: 700, cursor: "pointer",
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
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a1825", borderRadius: 10, padding: "10px 16px", border: "1px solid #2e2b3d" }}>
              <div style={{ width: 36, fontSize: 10, fontWeight: 700, color: "#8b8699", textTransform: "uppercase" }}>{short}</div>
              <div style={{ width: 60, fontSize: 12, color: "#4a4759" }}>{label}</div>

              <button
                type="button"
                aria-label={`Rzuć ${acc}`}
                onClick={() => setStep4({ [key]: rollStat() } as Partial<WizardStep4>)}
                style={{
                  padding: "4px 12px", borderRadius: 6, border: "1px solid #2e2b3d",
                  background: "#232136", color: "#8b8699", fontSize: 12, cursor: "pointer",
                }}
              >
                🎲 Rzuć
              </button>

              {bonus !== 0 && (
                <span style={{ fontSize: 11, color: "#52c97a", marginLeft: "auto" }}>+{bonus} rasa</span>
              )}

              <div style={{
                width: 52, height: 40, borderRadius: 8, marginLeft: bonus === 0 ? "auto" : 0,
                background: base !== 10 ? "rgba(201,168,76,0.1)" : "#0f0e17",
                border: `1px solid ${base !== 10 ? "#c9a84c44" : "#2e2b3d"}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0ece4" }}>{total}</div>
                <div style={{ fontSize: 9, color: "#8b8699" }}>{mod(total)}</div>
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
      <span style={{ fontSize: 11, color: "#4a4759" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? "#c9a84c" : "#f0ece4" }}>{value}</span>
    </div>
  );
}
