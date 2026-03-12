"use client";

import Link from "next/link";

const STEPS: { label: string; path: string }[] = [
  { label: "Koncept",   path: "/kreator/koncept" },
  { label: "Rasa",      path: "/kreator/rasa" },
  { label: "Klasa",     path: "/kreator/klasa" },
  { label: "Cechy",     path: "/kreator/cechy" },
  { label: "Tło",       path: "/kreator/tlo" },
  { label: "Ekwipunek", path: "/kreator/ekwipunek" },
  { label: "Magia",     path: "/kreator/magia" },
  { label: "Gotowe",    path: "/kreator/gotowe" },
];

const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";
const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";

type Props = {
  currentStep: number;     // 1-based, current route
  maxReachedStep: number;  // highest step user has legitimately reached
};

export default function Stepper({ currentStep, maxReachedStep }: Props) {
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
      {STEPS.map(({ label, path }, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        const reachable = step <= maxReachedStep && !active;

        const bubble = (
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
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            {done ? "✓" : step}
          </div>
        );

        const labelEl = (
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
        );

        const inner = (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {bubble}
            {labelEl}
          </div>
        );

        return (
          <div
            key={step}
            style={{ display: "flex", alignItems: "center", flex: step < STEPS.length ? 1 : "none" }}
          >
            {reachable ? (
              <Link
                href={path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                  cursor: "pointer",
                  opacity: 1,
                }}
                title={`Przejdź do: ${label}`}
              >
                {bubble}
                {labelEl}
              </Link>
            ) : (
              inner
            )}

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
