"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import type { WizardStep1 } from "@/domains/character/store/wizardStore";
import Tooltip from "@/shared/ui/Tooltip";

const ALIGNMENTS: { code: WizardStep1["alignment"]; label: string; desc: string; tooltip: string }[] = [
  { code: "LG", label: "Praworządny Dobry",    desc: "Honorowy obrońca",     tooltip: "Żyje według kodeksu honoru i czyni dobro w ramach prawa. Np. Rycerz Świętego Zakonu." },
  { code: "NG", label: "Neutralny Dobry",       desc: "Czyni dobro",          tooltip: "Czyni dobro jak może, bez przywiązania do reguł ani chaosu. Np. Wędrowny Uzdrowiciel." },
  { code: "CG", label: "Chaotyczny Dobry",      desc: "Wolny duch",           tooltip: "Idzie za sercem, niezależnie od zasad. Dobry, ale nieprzewidywalny. Np. Robin Hood." },
  { code: "LN", label: "Praworządny Neutralny", desc: "Żyje według zasad",    tooltip: "Przestrzega prawa i porządku ponad wszystko. Dobro i zło są drugorzędne. Np. Sędzia." },
  { code: "TN", label: "Prawdziwa Neutralność", desc: "Balans we wszystkim",  tooltip: "Stara się zachować balans między skrajnościami. Unika angażowania się po stronach. Np. Druid Koła Ziemi." },
  { code: "CN", label: "Chaotyczny Neutralny",  desc: "Nieprzewidywalny",     tooltip: "Kieruje się własnym impulsem. Nie zły, ale trudny do współpracy. Np. Kłopotliwy Łotrzyk." },
  { code: "LE", label: "Praworządny Zły",       desc: "Metodyczny despota",   tooltip: "Używa prawa i struktury do własnych celów. Tyran z systemem. Np. Skorumpowany Inkwizytor." },
  { code: "NE", label: "Neutralny Zły",         desc: "Bez skrupułów",        tooltip: "Robi co chce dla własnego zysku, bez zasad ani lojalności. Np. Najemnik gotowy na wszystko." },
  { code: "CE", label: "Chaotyczny Zły",        desc: "Destrukcja i chaos",   tooltip: "Niszczy i sieje chaos dla samego chaosu. Najtrudniejsza postawa do gry w drużynie. Np. Demon." },
];

const GENDERS: { value: WizardStep1["gender"]; label: string }[] = [
  { value: "kobieta", label: "Kobieta" },
  { value: "mezczyzna", label: "Mężczyzna" },
  { value: "inne", label: "Inne" },
];

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontFamily: FONT_UI,
  fontSize: 16,
  color: MID,
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  marginBottom: 6,
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: `1.5px solid ${BLACK}`,
  color: BLACK,
  fontFamily: FONT_UI,
  fontSize: 17,
  padding: "10px 0",
  outline: "none",
  boxSizing: "border-box",
};

export default function KonceptForm() {
  const router = useRouter();
  const { step1, setStep1 } = useWizardStore();

  const canProceed = step1.name.trim().length >= 2;

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1.5px solid ${BLACK}`,
        padding: "40px 48px",
      }}
    >
      {/* Nagłówek */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: FONT_UI,
          fontSize: 16,
          color: MID,
          textTransform: "uppercase",
          letterSpacing: "4px",
          marginBottom: 10,
        }}>
          Krok 1 z 8
        </div>
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 36,
          fontWeight: 400,
          color: BLACK,
          margin: 0,
          fontStyle: "italic",
        }}>
          Koncept Postaci
        </h1>
        <div style={{ height: "1.5px", background: BLACK, marginTop: 12, width: 60 }} />
        <p style={{
          fontFamily: FONT_UI,
          color: MID,
          fontSize: 16,
          marginTop: 12,
          letterSpacing: "0.3px",
        }}>
          Nadaj swojej postaci imię, osobowość i poglądy na świat.
        </p>
      </div>

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
            placeholder="Np. Aldric Świetlisty"
            maxLength={60}
          />
          {step1.name.trim().length > 0 && step1.name.trim().length < 2 && (
            <p style={{ fontFamily: FONT_UI, fontSize: 16, color: "#e05252", marginTop: 4 }}>Minimum 2 znaki</p>
          )}
        </div>

        {/* Płeć */}
        <div>
          <label style={LABEL_STYLE}>Płeć</label>
          <div style={{ display: "flex", gap: 8 }}>
            {GENDERS.map(({ value, label }) => {
              const active = step1.gender === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStep1({ gender: value })}
                  style={{
                    flex: 1,
                    height: 40,
                    border: `1.5px solid ${BLACK}`,
                    background: active ? BLACK : "transparent",
                    color: active ? "#ffffff" : BLACK,
                    fontFamily: FONT_UI,
                    fontSize: 16,
                    fontWeight: active ? 700 : 400,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wiek + Wzrost */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
              placeholder="np. 175"
            />
          </div>
        </div>

        {/* Opis */}
        <div>
          <label style={{ ...LABEL_STYLE, display: "flex", justifyContent: "space-between" }}>
            <span>Opis postaci (opcjonalnie)</span>
            <span style={{ color: LIGHT, letterSpacing: 0 }}>{step1.description.length}/500</span>
          </label>
          <textarea
            style={{
              ...INPUT_STYLE,
              height: 100,
              padding: "10px 0",
              resize: "vertical",
              lineHeight: 1.6,
            }}
            value={step1.description}
            onChange={(e) => setStep1({ description: e.target.value })}
            placeholder="Opisz wygląd, osobowość lub historię postaci..."
            maxLength={500}
          />
        </div>

        {/* Alignment */}
        <div>
          <label style={LABEL_STYLE}>Postawa moralna</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
            }}
          >
            {ALIGNMENTS.map(({ code, label: _label, desc, tooltip }) => {
              const active = step1.alignment === code;
              return (
                <Tooltip key={code} content={tooltip} position="top">
                  <button
                    type="button"
                    onClick={() => setStep1({ alignment: code })}
                    style={{
                      padding: "8px 10px",
                      border: `1.5px solid ${active ? BLACK : LIGHT}`,
                      background: active ? BLACK : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div style={{
                      fontFamily: FONT_UI,
                      fontSize: 16,
                      fontWeight: 700,
                      color: active ? "#ffffff" : BLACK,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: 2,
                    }}>
                      {code}
                    </div>
                    <div style={{
                      fontFamily: FONT_UI,
                      fontSize: 16,
                      color: active ? "#cccccc" : MID,
                    }}>
                      {desc}
                    </div>
                  </button>
                </Tooltip>
              );
            })}
          </div>
          {step1.alignment && (
            <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginTop: 8 }}>
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
          borderTop: `1px solid ${LIGHT}`,
        }}
      >
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/rasa")}
          style={{
            padding: "10px 28px",
            border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? "#ffffff" : MID,
            fontFamily: FONT_UI,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Rasa →
        </button>
      </div>
    </div>
  );
}
