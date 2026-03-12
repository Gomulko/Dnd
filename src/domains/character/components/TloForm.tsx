"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import Tooltip from "@/shared/ui/Tooltip";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { SKILL_NAMES_PL } from "@/data/dnd/classes";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const PERSONALITY_TOOLTIPS: Record<string, string> = {
  "CECHY CHARAKTERU": "Krótkie zdania opisujące zachowanie twojej postaci. Bez mechanicznego efektu — budują klimat i pomagają odgrywać postać przy stole.",
  "IDEAŁ":            "Wartość lub przekonanie wyznawane przez postać. Może wpływać na interakcje z frakcjami i organizacjami w świecie gry.",
  "WIĘŹ":             "Osoba, miejsce lub przedmiot wyjątkowo ważny dla postaci. Mistrz Gry może to wpleść w fabułę.",
  "WADA":             "Słabość lub mroczna cecha charakteru. Dobra wada czyni postać ludzką i ciekawszą do odgrywania — nie bój się jej!",
};

const SPECIAL_FEATURE_TOOLTIP = "Unikalna umiejętność fabularna tła — np. Żołnierz ma stopień wojskowy, Przestępca zna półświatek. Mistrz Gry decyduje jak to działa w grze.";
const SKILL_PROFICIENCY_TOOLTIP = "Umiejętności z tła dają automatyczną biegłość — dodajesz premię do biegłości (+2) do rzutów tymi umiejętnościami.";

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontFamily: FONT_UI,
  fontSize: 16,
  color: MID,
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  marginBottom: 6,
};

// ── Główny komponent ───────────────────────────────────────────────────────────

export default function TloForm() {
  const router = useRouter();
  const { step5, setStep5 } = useWizardStore();
  const [search, setSearch] = useState("");

  const selectedBg = BACKGROUNDS.find((b) => b.id === step5.background) ?? null;

  const filtered = BACKGROUNDS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const canProceed =
    !!step5.background &&
    step5.personalityTraits.length >= 2 &&
    step5.ideals.length >= 1 &&
    step5.bonds.length >= 1 &&
    step5.flaws.length >= 1;

  function selectBackground(id: string) {
    setStep5({
      background: id,
      personalityTraits: [],
      ideals: [],
      bonds: [],
      flaws: [],
    });
  }

  function toggleTrait(id: string) {
    const current = step5.personalityTraits;
    if (current.includes(id)) {
      setStep5({ personalityTraits: current.filter((t) => t !== id) });
    } else if (current.length < 2) {
      setStep5({ personalityTraits: [...current, id] });
    }
  }

  function toggleSingle(field: "ideals" | "bonds" | "flaws", id: string) {
    const current = step5[field];
    if (current.includes(id)) {
      setStep5({ [field]: [] });
    } else {
      setStep5({ [field]: [id] });
    }
  }

  return (
    <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 5 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Tło Postaci
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>
          Wybierz historię swojej postaci przed przygodami.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Lewa kolumna — grid teł */}
        <div style={{ flex: "0 0 320px" }}>
          {/* Wyszukiwarka */}
          <input
            type="text"
            placeholder="Szukaj tła..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              background: "transparent",
              border: "none",
              borderBottom: `1.5px solid ${BLACK}`,
              color: BLACK,
              fontFamily: FONT_UI,
              fontSize: 17,
              padding: "10px 0",
              outline: "none",
              marginBottom: 20,
              boxSizing: "border-box",
            }}
          />

          {/* Grid teł */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {filtered.map((bg) => {
              const active = step5.background === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => selectBackground(bg.id)}
                  style={{
                    position: "relative", textAlign: "left",
                    padding: "12px 14px", cursor: "pointer",
                    background: active ? BLACK : "transparent",
                    border: `1.5px solid ${active ? BLACK : LIGHT}`,
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 6, right: 8,
                      fontFamily: FONT_UI, fontSize: 16, color: WHITE,
                    }}>✓</span>
                  )}
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{bg.icon}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: active ? WHITE : BLACK, lineHeight: 1.2 }}>
                    {bg.name}
                  </div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, color: active ? LIGHT : MID, marginTop: 4 }}>
                    {bg.skillProficiencies.slice(0, 2).map((s) => SKILL_NAMES_PL[s]).join(", ")}
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p style={{ fontFamily: FONT_UI, color: MID, fontSize: 16, marginTop: 12 }}>
              Brak wyników dla &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        {/* Prawa kolumna — panel szczegółów */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedBg ? (
            <div style={{ border: `1.5px dashed ${LIGHT}`, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📜</div>
              <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>Wybierz tło, aby zobaczyć szczegóły</p>
            </div>
          ) : (
            <div>
              {/* Nagłówek tła */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{selectedBg.icon}</span>
                  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
                    {selectedBg.name}
                  </h2>
                  <span style={{
                    fontFamily: FONT_UI, fontSize: 16, padding: "2px 8px",
                    border: `1px solid ${BLACK}`, color: BLACK,
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>{selectedBg.source}</span>
                </div>
                <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>{selectedBg.description}</p>
              </div>

              {/* Info — biegłości i języki */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <InfoBox label="Biegłości" tooltip={SKILL_PROFICIENCY_TOOLTIP}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {selectedBg.skillProficiencies.map((s) => (
                      <span key={s} style={{ fontFamily: FONT_UI, fontSize: 16, padding: "2px 8px", border: `1px solid ${BLACK}`, color: BLACK }}>
                        {SKILL_NAMES_PL[s]}
                      </span>
                    ))}
                  </div>
                </InfoBox>
                {selectedBg.languages > 0 && (
                  <InfoBox label="Języki">
                    <span style={{ fontFamily: FONT_UI, fontSize: 16, color: BLACK }}>+{selectedBg.languages} do wyboru</span>
                  </InfoBox>
                )}
                <InfoBox label="Narzędzia">
                  <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID }}>{selectedBg.toolProficiency}</span>
                </InfoBox>
              </div>

              {/* Cecha Specjalna */}
              <div style={{ border: `1.5px solid ${BLACK}`, padding: "14px 16px", marginBottom: 20 }}>
                <Tooltip content={SPECIAL_FEATURE_TOOLTIP} position="top">
                  <div style={{ ...LABEL_STYLE, cursor: "help", display: "inline-flex", alignItems: "center", gap: 4 }}>✦ {selectedBg.specialFeature.name}</div>
                </Tooltip>
                <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0, lineHeight: 1.6 }}>
                  {selectedBg.specialFeature.description}
                </p>
              </div>

              <div style={{ height: 1, background: LIGHT, marginBottom: 20 }} />

              {/* Cechy Charakteru */}
              <PersonalitySection
                title={`CECHY CHARAKTERU (${step5.personalityTraits.length}/2)`}
                titleTooltip={PERSONALITY_TOOLTIPS["CECHY CHARAKTERU"]}
                options={selectedBg.personalityTraits}
                selected={step5.personalityTraits}
                maxSelect={2}
                onToggle={toggleTrait}
              />

              {/* Ideał */}
              <PersonalitySection
                title={`IDEAŁ (${step5.ideals.length}/1)`}
                titleTooltip={PERSONALITY_TOOLTIPS["IDEAŁ"]}
                options={selectedBg.ideals}
                selected={step5.ideals}
                maxSelect={1}
                onToggle={(id) => toggleSingle("ideals", id)}
              />

              {/* Więź */}
              <PersonalitySection
                title={`WIĘŹ (${step5.bonds.length}/1)`}
                titleTooltip={PERSONALITY_TOOLTIPS["WIĘŹ"]}
                options={selectedBg.bonds}
                selected={step5.bonds}
                maxSelect={1}
                onToggle={(id) => toggleSingle("bonds", id)}
              />

              {/* Wada */}
              <PersonalitySection
                title={`WADA (${step5.flaws.length}/1)`}
                titleTooltip={PERSONALITY_TOOLTIPS["WADA"]}
                options={selectedBg.flaws}
                selected={step5.flaws}
                maxSelect={1}
                onToggle={(id) => toggleSingle("flaws", id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Historia + Sojusznicy */}
      {step5.background && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
          <div style={{ height: 1, background: LIGHT }} />
          <div>
            <label style={LABEL_STYLE}>Historia postaci (opcjonalnie)</label>
            <textarea
              style={{ width: "100%", minHeight: 80, fontFamily: FONT_UI, fontSize: 14, color: BLACK, border: `1px solid ${LIGHT}`, background: "transparent", padding: "10px 12px", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
              value={step5.backstory}
              onChange={(e) => setStep5({ backstory: e.target.value })}
              placeholder="Opisz skąd pochodzi twoja postać, co ją ukształtowało..."
              maxLength={2000}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Sojusznicy i organizacje (opcjonalnie)</label>
            <textarea
              style={{ width: "100%", minHeight: 60, fontFamily: FONT_UI, fontSize: 14, color: BLACK, border: `1px solid ${LIGHT}`, background: "transparent", padding: "10px 12px", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
              value={step5.allies}
              onChange={(e) => setStep5({ allies: e.target.value })}
              placeholder="Frakcje, gildie, rodzina, przyjaciele..."
              maxLength={500}
            />
          </div>
        </div>
      )}

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/cechy")}
          style={{
            padding: "10px 28px",
            border: `1.5px solid ${BLACK}`, background: "transparent",
            color: BLACK, fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/ekwipunek")}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Ekwipunek →
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function InfoBox({ label, children, tooltip }: { label: string; children: React.ReactNode; tooltip?: string }) {
  return (
    <div style={{ border: `1px solid ${LIGHT}`, padding: "10px 14px" }}>
      <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 6 }}>
        {tooltip ? (
          <Tooltip content={tooltip} position="top">
            <span style={{ borderBottom: `1px dashed ${LIGHT}`, cursor: "help" }}>{label}</span>
          </Tooltip>
        ) : label}
      </div>
      {children}
    </div>
  );
}

function PersonalitySection({
  title,
  titleTooltip,
  options,
  selected,
  maxSelect,
  onToggle,
}: {
  title: string;
  titleTooltip?: string;
  options: { id: string; text: string }[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>
        {titleTooltip ? (
          <Tooltip content={titleTooltip} position="right">
            <span style={{ borderBottom: `1px dashed ${LIGHT}`, cursor: "help" }}>{title}</span>
          </Tooltip>
        ) : title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isDisabled = !isSelected && selected.length >= maxSelect;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggle(opt.id)}
              style={{
                textAlign: "left", padding: "10px 14px", cursor: isDisabled ? "not-allowed" : "pointer",
                background: isSelected ? BLACK : "transparent",
                border: `1.5px solid ${isSelected ? BLACK : LIGHT}`,
                color: isDisabled ? LIGHT : isSelected ? WHITE : MID,
                fontFamily: FONT_UI, fontSize: 16, lineHeight: 1.5,
              }}
            >
              {isSelected && <span style={{ marginRight: 6 }}>✓</span>}
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
