"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardStep1 } from "@/domains/character/store/wizardStore";

const ALIGNMENTS: { code: WizardStep1["alignment"]; label: string; desc: string }[] = [
  { code: "LG", label: "Praworządny Dobry",      desc: "Honorowy obrońca" },
  { code: "NG", label: "Neutralny Dobry",         desc: "Czyni dobro" },
  { code: "CG", label: "Chaotyczny Dobry",        desc: "Wolny duch" },
  { code: "LN", label: "Praworządny Neutralny",   desc: "Żyje według zasad" },
  { code: "TN", label: "Prawdziwa Neutralność",   desc: "Balans we wszystkim" },
  { code: "CN", label: "Chaotyczny Neutralny",    desc: "Nieprzewidywalny" },
  { code: "LE", label: "Praworządny Zły",         desc: "Metodyczny despota" },
  { code: "NE", label: "Neutralny Zły",           desc: "Bez skrupułów" },
  { code: "CE", label: "Chaotyczny Zły",          desc: "Destrukcja i chaos" },
];

const GENDERS: { value: WizardStep1["gender"]; label: string; icon: string }[] = [
  { value: "kobieta",    label: "Kobieta",    icon: "♀" },
  { value: "mezczyzna",  label: "Mężczyzna",  icon: "♂" },
  { value: "inne",       label: "Inne",        icon: "◆" },
];

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  height: 45,
  background: "#0f0e17",
  border: "1px solid #2e2b3d",
  borderRadius: 8,
  color: "#f0ece4",
  fontSize: 14,
  padding: "0 14px",
  outline: "none",
  boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#8b8699",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

export default function KonceptForm() {
  const router = useRouter();
  const { step1, setStep1 } = useWizardStore();

  const canProceed = step1.name.trim().length >= 2;

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "#c9a84c";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "#2e2b3d";
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 1 z 8
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#f0ece4",
            margin: 0,
          }}
        >
          Koncept Postaci
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Nadaj swojej postaci imię, osobowość i poglądy na świat.
        </p>
      </div>

      {/* Złota linia */}
      <div
        style={{
          height: 2,
          background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)",
          marginBottom: 32,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Imię */}
        <div>
          <label style={LABEL_STYLE}>
            Imię postaci <span style={{ color: "#e05252" }}>*</span>
          </label>
          <input
            style={INPUT_STYLE}
            value={step1.name}
            onChange={(e) => setStep1({ name: e.target.value })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Np. Aldric Świetlisty"
            maxLength={60}
          />
          {step1.name.trim().length > 0 && step1.name.trim().length < 2 && (
            <p style={{ fontSize: 11, color: "#e05252", marginTop: 4 }}>Minimum 2 znaki</p>
          )}
        </div>

        {/* Płeć */}
        <div>
          <label style={LABEL_STYLE}>Płeć</label>
          <div style={{ display: "flex", gap: 10 }}>
            {GENDERS.map(({ value, label, icon }) => {
              const active = step1.gender === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStep1({ gender: value })}
                  style={{
                    flex: 1,
                    height: 45,
                    borderRadius: 8,
                    border: active ? "1px solid #c9a84c" : "1px solid #2e2b3d",
                    background: active ? "rgba(201,168,76,0.1)" : "#0f0e17",
                    color: active ? "#c9a84c" : "#8b8699",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wiek + Wzrost */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Wiek (opcjonalnie)</label>
            <input
              style={INPUT_STYLE}
              type="number"
              min={1}
              max={999}
              value={step1.age ?? ""}
              onChange={(e) =>
                setStep1({ age: e.target.value ? Number(e.target.value) : null })
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="np. 25"
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Wzrost w cm (opcjonalnie)</label>
            <input
              style={INPUT_STYLE}
              type="number"
              min={50}
              max={300}
              value={step1.height ?? ""}
              onChange={(e) =>
                setStep1({ height: e.target.value ? Number(e.target.value) : null })
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="np. 175"
            />
          </div>
        </div>

        {/* Opis */}
        <div>
          <label style={{ ...LABEL_STYLE, display: "flex", justifyContent: "space-between" }}>
            <span>Opis postaci (opcjonalnie)</span>
            <span style={{ color: "#4a4759", fontWeight: 400 }}>{step1.description.length}/500</span>
          </label>
          <textarea
            style={{
              ...INPUT_STYLE,
              height: 110,
              padding: "12px 14px",
              resize: "vertical",
              lineHeight: 1.6,
            }}
            value={step1.description}
            onChange={(e) => setStep1({ description: e.target.value })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Opisz wygląd, osobowość lub historię postaci..."
            maxLength={500}
          />
        </div>

        {/* Alignment */}
        <div>
          <label style={LABEL_STYLE}>Alignment — postawa moralna</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {ALIGNMENTS.map(({ code, label, desc }) => {
              const active = step1.alignment === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setStep1({ alignment: code })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: active ? "1px solid #c9a84c" : "1px solid #2e2b3d",
                    background: active ? "rgba(201,168,76,0.1)" : "#0f0e17",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: active ? "#c9a84c" : "#f0ece4",
                      marginBottom: 2,
                    }}
                  >
                    {code}
                  </div>
                  <div style={{ fontSize: 10, color: active ? "#c9a84c" : "#8b8699" }}>
                    {desc}
                  </div>
                </button>
              );
            })}
          </div>
          {step1.alignment && (
            <p style={{ fontSize: 12, color: "#8b8699", marginTop: 8 }}>
              {ALIGNMENTS.find((a) => a.code === step1.alignment)?.label}
            </p>
          )}
        </div>

      </div>

      {/* Nawigacja */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid #2e2b3d",
        }}
      >
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/rasa")}
          style={{
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: canProceed
              ? "linear-gradient(135deg, #c9a84c, #b8943c)"
              : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14,
            fontWeight: 700,
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          Dalej — Rasa →
        </button>
      </div>
    </div>
  );
}
