"use client";

const STEPS = [
  "Koncept",
  "Rasa",
  "Klasa",
  "Cechy",
  "Tło",
  "Ekwipunek",
  "Magia",
  "Gotowe",
];

const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";
const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";

type Props = {
  currentStep: number; // 1-based
};

export default function Stepper({ currentStep }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "0 32px",
        overflowX: "auto",
      }}
    >
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;

        return (
          <div
            key={step}
            style={{ display: "flex", alignItems: "center", flex: step < STEPS.length ? 1 : "none" }}
          >
            {/* Step bubble + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: done ? 15 : 14,
                  fontWeight: 700,
                  fontFamily: FONT_UI,
                  flexShrink: 0,
                  background: done || active ? BLACK : "transparent",
                  border: `1.5px solid ${done || active ? BLACK : LIGHT}`,
                  color: done || active ? "#ffffff" : MID,
                }}
              >
                {done ? "✓" : step}
              </div>
              <span
                className="stepper-label"
                style={{
                  fontSize: 16,
                  fontWeight: active ? 900 : 400,
                  fontFamily: FONT_UI,
                  color: done || active ? BLACK : MID,
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {step < STEPS.length && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  marginBottom: 22,
                  background: done ? BLACK : LIGHT,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
