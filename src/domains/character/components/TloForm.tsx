"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { SKILL_NAMES_PL } from "@/data/dnd/classes";

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
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 5 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Tło Postaci
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Wybierz historię swojej postaci przed przygodami.
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Lewa kolumna — grid teł */}
        <div style={{ flex: "0 0 320px" }}>
          {/* Wyszukiwarka */}
          <input
            type="text"
            placeholder="Szukaj tła..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", marginBottom: 16, height: 40,
              background: "#0f0e17", border: "1px solid #2e2b3d",
              borderRadius: 8, color: "#f0ece4", fontSize: 13,
              padding: "0 14px", boxSizing: "border-box",
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
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    background: active ? "rgba(201,168,76,0.12)" : "#1a1825",
                    border: `1px solid ${active ? "#c9a84c" : "#2e2b3d"}`,
                    transition: "border-color 0.15s",
                  }}
                >
                  {active && (
                    <div style={{
                      position: "absolute", top: 6, right: 8,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#52c97a", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: "#0f0e17", fontWeight: 700,
                    }}>✓</div>
                  )}
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{bg.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0ece4", lineHeight: 1.2 }}>{bg.name}</div>
                  <div style={{ fontSize: 10, color: "#4a4759", marginTop: 4 }}>
                    {bg.skillProficiencies.slice(0, 2).map((s) => SKILL_NAMES_PL[s]).join(", ")}
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p style={{ color: "#4a4759", fontSize: 13, marginTop: 12 }}>Brak wyników dla &ldquo;{search}&rdquo;</p>
          )}
        </div>

        {/* Prawa kolumna — panel szczegółów + cechy charakteru */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedBg ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#4a4759" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📜</div>
              <p style={{ fontSize: 14 }}>Wybierz tło, aby zobaczyć szczegóły.</p>
            </div>
          ) : (
            <div>
              {/* Nagłówek tła */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{selectedBg.icon}</span>
                  <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 20, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
                    {selectedBg.name}
                  </h2>
                  <span style={{
                    fontSize: 9, padding: "2px 8px", borderRadius: 10,
                    background: selectedBg.source === "SRD" ? "rgba(82,201,122,0.1)" : "rgba(124,92,191,0.1)",
                    border: `1px solid ${selectedBg.source === "SRD" ? "#52c97a44" : "#7c5cbf44"}`,
                    color: selectedBg.source === "SRD" ? "#52c97a" : "#7c5cbf",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>{selectedBg.source}</span>
                </div>
                <p style={{ fontSize: 13, color: "#8b8699", margin: 0 }}>{selectedBg.description}</p>
              </div>

              {/* Info — biegłości i języki */}
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Biegłości</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {selectedBg.skillProficiencies.map((s) => (
                      <span key={s} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c44", color: "#c9a84c" }}>
                        {SKILL_NAMES_PL[s]}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedBg.languages > 0 && (
                  <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Języki</div>
                    <span style={{ fontSize: 12, color: "#f0ece4" }}>+{selectedBg.languages} do wyboru</span>
                  </div>
                )}
                <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Narzędzia</div>
                  <span style={{ fontSize: 11, color: "#8b8699" }}>{selectedBg.toolProficiency}</span>
                </div>
              </div>

              {/* Cecha Specjalna */}
              <div style={{ background: "#1a1825", border: "1px solid #c9a84c33", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                  ✦ {selectedBg.specialFeature.name}
                </div>
                <p style={{ fontSize: 12, color: "#8b8699", margin: 0, lineHeight: 1.6 }}>
                  {selectedBg.specialFeature.description}
                </p>
              </div>

              <div style={{ height: 1, background: "#2e2b3d", marginBottom: 20 }} />

              {/* Cechy Charakteru */}
              <PersonalitySection
                title={`CECHY CHARAKTERU (${step5.personalityTraits.length}/2)`}
                options={selectedBg.personalityTraits}
                selected={step5.personalityTraits}
                maxSelect={2}
                onToggle={toggleTrait}
              />

              {/* Ideał */}
              <PersonalitySection
                title={`IDEAŁ (${step5.ideals.length}/1)`}
                options={selectedBg.ideals}
                selected={step5.ideals}
                maxSelect={1}
                onToggle={(id) => toggleSingle("ideals", id)}
              />

              {/* Więź */}
              <PersonalitySection
                title={`WIĘŹ (${step5.bonds.length}/1)`}
                options={selectedBg.bonds}
                selected={step5.bonds}
                maxSelect={1}
                onToggle={(id) => toggleSingle("bonds", id)}
              />

              {/* Wada */}
              <PersonalitySection
                title={`WADA (${step5.flaws.length}/1)`}
                options={selectedBg.flaws}
                selected={step5.flaws}
                maxSelect={1}
                onToggle={(id) => toggleSingle("flaws", id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/cechy")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/ekwipunek")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: canProceed ? "linear-gradient(135deg, #c9a84c, #b8943c)" : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Ekwipunek →
        </button>
      </div>
    </div>
  );
}

// ── Sekcja cech charakteru ─────────────────────────────────────────────────────

function PersonalitySection({
  title,
  options,
  selected,
  maxSelect,
  onToggle,
}: {
  title: string;
  options: { id: string; text: string }[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        {title}
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
                textAlign: "left", padding: "10px 14px", borderRadius: 8, cursor: isDisabled ? "not-allowed" : "pointer",
                background: isSelected ? "rgba(201,168,76,0.1)" : "#1a1825",
                border: `1px solid ${isSelected ? "#c9a84c" : "#2e2b3d"}`,
                color: isDisabled ? "#4a4759" : isSelected ? "#f0ece4" : "#8b8699",
                fontSize: 12, lineHeight: 1.5, transition: "border-color 0.15s",
              }}
            >
              {isSelected && <span style={{ color: "#c9a84c", marginRight: 6 }}>✓</span>}
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
