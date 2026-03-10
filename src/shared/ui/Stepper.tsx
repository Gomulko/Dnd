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
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: done ? 14 : 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.2s",
                  background: done
                    ? "#52c97a"
                    : active
                    ? "#c9a84c"
                    : "#232136",
                  border: done
                    ? "2px solid #52c97a"
                    : active
                    ? "2px solid #c9a84c"
                    : "2px solid #2e2b3d",
                  color: done
                    ? "#0f0e17"
                    : active
                    ? "#0f0e17"
                    : "#4a4759",
                }}
              >
                {done ? "✓" : step}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: done ? "#52c97a" : active ? "#c9a84c" : "#4a4759",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
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
                  height: 2,
                  marginBottom: 22,
                  background: done ? "#52c97a" : "#2e2b3d",
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
