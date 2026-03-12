"use client";

import { useState } from "react";

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
      const entry: RollEntry = {
        id: Date.now(),
        die,
        count: diceCount,
        results,
        total,
        timestamp: new Date(),
      };
      setLastRoll(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 20));
      setRolling(false);
    }, 150);
  }

  function clearHistory() {
    setHistory([]);
    setLastRoll(null);
  }

  const totalColor =
    lastRoll && lastRoll.die === 20
      ? lastRoll.total === 20
        ? "#52c97a"
        : lastRoll.total === 1
          ? "#e05252"
          : "#c9a84c"
      : "#c9a84c";

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
      {/* Lewa kolumna — rzucanie */}
      <div style={{ flex: "1 1 340px", minWidth: 280 }}>
        {/* Wynik */}
        <div
          style={{
            background: "#1a1825",
            border: "1px solid #2e2b3d",
            borderRadius: 12,
            padding: "40px 32px",
            textAlign: "center",
            marginBottom: 24,
            minHeight: 180,
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
                  fontSize: 160,
                  fontWeight: 900,
                  fontFamily: "Cinzel, serif",
                  color: totalColor,
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}
              >
                {rolling ? "..." : lastRoll.total}
              </div>
              <div style={{ color: "#8b8699", fontSize: 16, marginTop: 8 }}>
                {lastRoll.count}k{lastRoll.die}
                {lastRoll.count > 1 && (
                  <span style={{ color: "#4a4759", marginLeft: 8 }}>
                    [{lastRoll.results.join(" + ")}]
                  </span>
                )}
              </div>
              {lastRoll.die === 20 && lastRoll.total === 20 && !rolling && (
                <div
                  style={{
                    marginTop: 12,
                    color: "#52c97a",
                    fontFamily: "Cinzel, serif",
                    fontSize: 13,
                    letterSpacing: 2,
                    fontWeight: 700,
                  }}
                >
                  KRYTYCZNE TRAFIENIE!
                </div>
              )}
              {lastRoll.die === 20 && lastRoll.total === 1 && !rolling && (
                <div
                  style={{
                    marginTop: 12,
                    color: "#e05252",
                    fontFamily: "Cinzel, serif",
                    fontSize: 13,
                    letterSpacing: 2,
                    fontWeight: 700,
                  }}
                >
                  KRYTYCZNY BŁĄD!
                </div>
              )}
            </>
          ) : (
            <div style={{ color: "#4a4759", fontSize: 16, fontFamily: "Cinzel, serif" }}>
              Wybierz kość i rzuć
            </div>
          )}
        </div>

        {/* Liczba kości */}
        <div
          style={{
            background: "#1a1825",
            border: "1px solid #2e2b3d",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ color: "#8b8699", fontSize: 16, flexShrink: 0 }}>Liczba kości:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setDiceCount((n) => Math.max(1, n - 1))}
              data-testid="dice-count-minus"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "#232136",
                border: "1px solid #2e2b3d",
                color: "#f0ece4",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              −
            </button>
            <span
              data-testid="dice-count"
              style={{
                width: 36,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#c9a84c",
              }}
            >
              {diceCount}
            </span>
            <button
              onClick={() => setDiceCount((n) => Math.min(20, n + 1))}
              data-testid="dice-count-plus"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "#232136",
                border: "1px solid #2e2b3d",
                color: "#f0ece4",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Kości */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {DICE.map((die) => (
            <button
              key={die}
              onClick={() => handleRoll(die)}
              data-testid={`die-${die}`}
              disabled={rolling}
              style={{
                padding: "16px 8px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #232136 0%, #1a1825 100%)",
                border: `1px solid ${lastRoll?.die === die ? "#c9a84c" : "#2e2b3d"}`,
                color: lastRoll?.die === die ? "#c9a84c" : "#f0ece4",
                fontSize: 13,
                fontFamily: "Cinzel, serif",
                fontWeight: 700,
                cursor: rolling ? "not-allowed" : "pointer",
                opacity: rolling ? 0.7 : 1,
                transition: "all 0.15s",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 2 }}>🎲</div>
              k{die}
            </button>
          ))}
        </div>
      </div>

      {/* Prawa kolumna — historia */}
      <div style={{ flex: "1 1 280px", minWidth: 240 }}>
        <div
          style={{
            background: "#1a1825",
            border: "1px solid #2e2b3d",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #2e2b3d",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontFamily: "Cinzel, serif",
                color: "#f0ece4",
                fontWeight: 600,
              }}
            >
              Historia rzutów
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                data-testid="clear-history"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4a4759",
                  fontSize: 16,
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                Wyczyść
              </button>
            )}
          </div>

          <div
            data-testid="roll-history"
            style={{ maxHeight: 420, overflowY: "auto" }}
          >
            {history.length === 0 ? (
              <div
                style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  color: "#4a4759",
                  fontSize: 13,
                }}
              >
                Brak rzutów w tej sesji
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid #2e2b3d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontSize: 16,
                        color: "#8b8699",
                        fontFamily: "Cinzel, serif",
                        minWidth: 36,
                      }}
                    >
                      {entry.count}k{entry.die}
                    </span>
                    {entry.count > 1 && (
                      <span style={{ fontSize: 16, color: "#4a4759" }}>
                        [{entry.results.join("+")}]
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color:
                        entry.die === 20 && entry.total === 20
                          ? "#52c97a"
                          : entry.die === 20 && entry.total === 1
                            ? "#e05252"
                            : "#c9a84c",
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
