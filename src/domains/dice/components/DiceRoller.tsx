"use client";

import { useState } from "react";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

type RollEntry = {
  id: number;
  die: DieType;
  count: number;
  results: number[];
  total: number;
  timestamp: Date;
};

const DICE: DieType[] = [4, 6, 8, 10, 12, 20, 100];

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}

// Krytyczne trafienie / błąd tylko na k20
function resultColor(die: DieType, total: number): string {
  if (die === 20) {
    if (total === 20) return "#1a7a3a"; // ciemna zieleń
    if (total === 1)  return "#a02020"; // ciemna czerwień
  }
  return BLACK;
}

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState(1);
  const [lastRoll, setLastRoll] = useState<RollEntry | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [rolling, setRolling] = useState(false);

  function handleRoll(die: DieType) {
    setRolling(true);
    setTimeout(() => {
      const results = Array.from({ length: diceCount }, () => rollDie(die));
      const total = results.reduce((a, b) => a + b, 0);
      const entry: RollEntry = { id: Date.now(), die, count: diceCount, results, total, timestamp: new Date() };
      setLastRoll(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 20));
      setRolling(false);
    }, 150);
  }

  function clearHistory() {
    setHistory([]);
    setLastRoll(null);
  }

  const isCrit  = lastRoll?.die === 20 && lastRoll.total === 20;
  const isFumble = lastRoll?.die === 20 && lastRoll.total === 1;

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>

      {/* ── Lewa kolumna — rzucanie ── */}
      <div style={{ flex: "1 1 340px", minWidth: 280 }}>

        {/* Wynik */}
        <div
          style={{
            background: WHITE,
            border: `1.5px solid ${BLACK}`,
            padding: "40px 32px",
            textAlign: "center",
            marginBottom: 16,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {lastRoll ? (
            <>
              <div
                data-testid="roll-total"
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 120,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: rolling ? LIGHT : resultColor(lastRoll.die, lastRoll.total),
                  lineHeight: 1,
                }}
              >
                {rolling ? "…" : lastRoll.total}
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: 14, color: MID, marginTop: 8, letterSpacing: "1px" }}>
                {lastRoll.count}k{lastRoll.die}
                {lastRoll.count > 1 && (
                  <span style={{ color: LIGHT, marginLeft: 8 }}>
                    [{lastRoll.results.join(" + ")}]
                  </span>
                )}
              </div>
              {!rolling && isCrit && (
                <div style={{ marginTop: 12, fontFamily: FONT_UI, fontSize: 11, fontWeight: 900, color: "#1a7a3a", letterSpacing: "3px", textTransform: "uppercase" }}>
                  Krytyczne trafienie!
                </div>
              )}
              {!rolling && isFumble && (
                <div style={{ marginTop: 12, fontFamily: FONT_UI, fontSize: 11, fontWeight: 900, color: "#a02020", letterSpacing: "3px", textTransform: "uppercase" }}>
                  Krytyczny błąd!
                </div>
              )}
            </>
          ) : (
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontStyle: "italic", color: LIGHT }}>
              Wybierz kość i rzuć
            </div>
          )}
        </div>

        {/* Liczba kości */}
        <div
          style={{
            background: WHITE,
            border: `1.5px solid ${BLACK}`,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "1.5px", flexShrink: 0 }}>
            Liczba kości
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <button
              onClick={() => setDiceCount((n) => Math.max(1, n - 1))}
              data-testid="dice-count-minus"
              style={{
                width: 32, height: 32,
                border: `1.5px solid ${BLACK}`,
                background: "transparent",
                color: BLACK, fontSize: 18,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_UI,
              }}
            >
              −
            </button>
            <span
              data-testid="dice-count"
              style={{ width: 32, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: "italic", color: BLACK }}
            >
              {diceCount}
            </span>
            <button
              onClick={() => setDiceCount((n) => Math.min(20, n + 1))}
              data-testid="dice-count-plus"
              style={{
                width: 32, height: 32,
                border: `1.5px solid ${BLACK}`,
                background: "transparent",
                color: BLACK, fontSize: 18,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_UI,
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Przyciski kości */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {DICE.map((die) => {
            const isLast = lastRoll?.die === die;
            return (
              <button
                key={die}
                onClick={() => handleRoll(die)}
                data-testid={`die-${die}`}
                disabled={rolling}
                style={{
                  padding: "18px 8px",
                  border: `1.5px solid ${isLast ? BLACK : LIGHT}`,
                  background: isLast ? BLACK : WHITE,
                  color: isLast ? WHITE : BLACK,
                  fontFamily: FONT_UI,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: rolling ? "not-allowed" : "pointer",
                  opacity: rolling ? 0.5 : 1,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: "italic", marginBottom: 2 }}>k{die}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Prawa kolumna — historia ── */}
      <div style={{ flex: "1 1 260px", minWidth: 220 }}>
        <div style={{ background: WHITE, border: `1.5px solid ${BLACK}` }}>

          {/* Nagłówek historii */}
          <div style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${LIGHT}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase", letterSpacing: "2.5px" }}>
              Historia rzutów
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                data-testid="clear-history"
                style={{
                  background: "transparent", border: "none",
                  fontFamily: FONT_UI, fontSize: 11, color: MID,
                  cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px",
                  textDecoration: "underline",
                }}
              >
                Wyczyść
              </button>
            )}
          </div>

          <div data-testid="roll-history" style={{ maxHeight: 460, overflowY: "auto" }}>
            {history.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 16, color: LIGHT }}>
                Brak rzutów w tej sesji
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "10px 20px",
                    borderBottom: `1px solid ${LIGHT}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, fontWeight: 700, minWidth: 40 }}>
                      {entry.count}k{entry.die}
                    </span>
                    {entry.count > 1 && (
                      <span style={{ fontFamily: FONT_UI, fontSize: 11, color: LIGHT }}>
                        [{entry.results.join("+")}]
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 20,
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: resultColor(entry.die, entry.total),
                    }}
                  >
                    {entry.total}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
