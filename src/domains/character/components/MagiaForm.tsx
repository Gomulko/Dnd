"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { getCantripsForClass, getLevel1SpellsForClass } from "@/data/dnd/spells";
import type { Spell, SpellSchool } from "@/data/dnd/spells";

// ── Limity SRD (poziom 1) ─────────────────────────────────────────────────────

const CANTRIP_COUNTS: Record<string, number> = {
  bard: 2, cleric: 3, druid: 2, sorcerer: 4, warlock: 2, wizard: 3,
};

const SPELL_COUNTS: Record<string, number> = {
  bard: 4, cleric: 2, druid: 2, paladin: 2, ranger: 2, sorcerer: 2, warlock: 2, wizard: 6,
};

const SCHOOL_LABELS: Record<SpellSchool, string> = {
  Abjuration: "Abjuracja", Conjuration: "Przywoływanie",
  Divination: "Wróżbiarstwo", Enchantment: "Zaklęcia",
  Evocation: "Ewokacja", Illusion: "Iluzja",
  Necromancy: "Nekromancja", Transmutation: "Transmutacja",
};

// ── Główny komponent ───────────────────────────────────────────────────────────

export default function MagiaForm() {
  const router = useRouter();
  const { step3, step4, step7, setStep7 } = useWizardStore();

  const cls = CLASSES.find((c) => c.id === step3.class);
  const isSpellcaster = cls?.spellcasting ?? false;

  const cantripLimit = CANTRIP_COUNTS[step3.class] ?? 0;
  const spellLimit = SPELL_COUNTS[step3.class] ?? 0;

  const availableCantrips = getCantripsForClass(step3.class);
  const availableSpells = getLevel1SpellsForClass(step3.class);

  const [schoolFilter, setSchoolFilter] = useState<SpellSchool | "Wszystkie">("Wszystkie");

  const allSchools = Array.from(
    new Set([...availableCantrips, ...availableSpells].map((s) => s.school))
  ).sort();

  const filteredCantrips = schoolFilter === "Wszystkie"
    ? availableCantrips
    : availableCantrips.filter((s) => s.school === schoolFilter);

  const filteredSpells = schoolFilter === "Wszystkie"
    ? availableSpells
    : availableSpells.filter((s) => s.school === schoolFilter);

  // Spell DC
  const abilityMap: Record<string, keyof typeof step4> = {
    cha: "charisma", wis: "wisdom", int: "intelligence",
  };
  const spellAbilityKey = cls?.spellcastingAbility ? abilityMap[cls.spellcastingAbility] : null;
  const spellAbilityScore = spellAbilityKey ? (step4[spellAbilityKey] as number) : 10;
  const spellMod = Math.floor((spellAbilityScore - 10) / 2);
  const spellDc = 8 + 2 + spellMod;

  const canProceed = !isSpellcaster || (
    step7.cantrips.length >= cantripLimit &&
    step7.spells.length >= spellLimit
  );

  function toggleCantrip(id: string) {
    const cur = step7.cantrips;
    if (cur.includes(id)) {
      setStep7({ cantrips: cur.filter((c) => c !== id) });
    } else if (cur.length < cantripLimit) {
      setStep7({ cantrips: [...cur, id] });
    }
  }

  function toggleSpell(id: string) {
    const cur = step7.spells;
    if (cur.includes(id)) {
      setStep7({ spells: cur.filter((s) => s !== id) });
    } else if (cur.length < spellLimit) {
      setStep7({ spells: [...cur, id] });
    }
  }

  return (
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 7 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Magia
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          {isSpellcaster
            ? `Wybierz zaklęcia startowe dla klasy ${cls?.name ?? ""}.`
            : "Ta klasa nie posiada zdolności magicznych."}
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      {!isSpellcaster ? (
        /* Klasa niemagiczna */
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚔</div>
          <p style={{ color: "#8b8699", fontSize: 16 }}>{cls?.name ?? "Ta klasa"} nie posiada zaklęć.</p>
          <p style={{ color: "#4a4759", fontSize: 13, marginTop: 8 }}>Ten krok zostaje pominięty.</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Lewa/środkowa kolumna — wybór zaklęć */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Filtr szkoły */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              <SchoolButton label="Wszystkie" active={schoolFilter === "Wszystkie"} onClick={() => setSchoolFilter("Wszystkie")} />
              {allSchools.map((school) => (
                <SchoolButton
                  key={school}
                  label={SCHOOL_LABELS[school]}
                  active={schoolFilter === school}
                  onClick={() => setSchoolFilter(school)}
                />
              ))}
            </div>

            {/* Cantrips */}
            {cantripLimit > 0 && (
              <SpellSection
                title={`CANTRIPY (${step7.cantrips.length}/${cantripLimit})`}
                spells={filteredCantrips}
                selected={step7.cantrips}
                maxSelect={cantripLimit}
                onToggle={toggleCantrip}
              />
            )}

            {/* Zaklęcia poz. 1 */}
            {spellLimit > 0 && (
              <SpellSection
                title={`ZAKLĘCIA POZ. 1 (${step7.spells.length}/${spellLimit})`}
                spells={filteredSpells}
                selected={step7.spells}
                maxSelect={spellLimit}
                onToggle={toggleSpell}
              />
            )}
          </div>

          {/* Panel statystyk magii */}
          <div style={{ width: 200, flexShrink: 0 }}>
            <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #7c5cbf, transparent)" }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                  Statystyki Magii
                </div>
                <MagicRow label="Atrybut" value={cls?.spellcastingAbility?.toUpperCase() ?? "—"} />
                <MagicRow label="DC Zaklęć" value={`${spellDc}`} highlight />
                <MagicRow label="Bonus Ataku" value={`+${2 + spellMod}`} />
                <MagicRow label="Sloty poz. 1" value="2" />

                {step7.cantrips.length > 0 && (
                  <>
                    <div style={{ height: 1, background: "#2e2b3d", margin: "12px 0" }} />
                    <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                      Wybrane Cantripy
                    </div>
                    {step7.cantrips.map((id) => {
                      const sp = availableCantrips.find((c) => c.id === id);
                      return sp ? (
                        <div key={id} style={{ fontSize: 11, color: "#7c5cbf", marginBottom: 4 }}>· {sp.namePl}</div>
                      ) : null;
                    })}
                  </>
                )}

                {step7.spells.length > 0 && (
                  <>
                    <div style={{ height: 1, background: "#2e2b3d", margin: "12px 0" }} />
                    <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                      Wybrane Zaklęcia
                    </div>
                    {step7.spells.map((id) => {
                      const sp = availableSpells.find((s) => s.id === id);
                      return sp ? (
                        <div key={id} style={{ fontSize: 11, color: "#c9a84c", marginBottom: 4 }}>· {sp.namePl}</div>
                      ) : null;
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/ekwipunek")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => router.push("/kreator/gotowe")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: canProceed ? "linear-gradient(135deg, #c9a84c, #b8943c)" : "#232136",
            color: canProceed ? "#0f0e17" : "#4a4759",
            fontSize: 14, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Gotowe →
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function SchoolButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", border: "none",
        background: active ? "#7c5cbf" : "#1a1825",
        color: active ? "#f0ece4" : "#4a4759",
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  );
}

function SpellSection({ title, spells, selected, maxSelect, onToggle }: {
  title: string;
  spells: Spell[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {spells.map((spell) => {
          const isSelected = selected.includes(spell.id);
          const isDisabled = !isSelected && selected.length >= maxSelect;
          return (
            <button
              key={spell.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggle(spell.id)}
              aria-label={spell.namePl}
              style={{
                textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: isDisabled ? "not-allowed" : "pointer",
                background: isSelected ? "rgba(124,92,191,0.12)" : "#1a1825",
                border: `1px solid ${isSelected ? "#7c5cbf" : "#2e2b3d"}`,
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: isDisabled ? "#4a4759" : isSelected ? "#f0ece4" : "#8b8699" }}>
                {isSelected && <span style={{ color: "#7c5cbf", marginRight: 4 }}>✓</span>}
                {spell.namePl}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: "#232136", color: "#4a4759" }}>
                  {SCHOOL_LABELS[spell.school]}
                </span>
                {spell.ritual && (
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: "rgba(201,168,76,0.1)", color: "#c9a84c" }}>
                    Rytuał
                  </span>
                )}
                {spell.concentration && (
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: "rgba(224,82,82,0.1)", color: "#e05252" }}>
                    Koncentracja
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10, color: "#4a4759", marginTop: 4, lineHeight: 1.3 }}>
                {spell.castingTime} · {spell.range}
              </div>
            </button>
          );
        })}
      </div>
      {spells.length === 0 && (
        <p style={{ color: "#4a4759", fontSize: 12 }}>Brak zaklęć dla wybranej szkoły.</p>
      )}
    </div>
  );
}

function MagicRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "#4a4759" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? "#7c5cbf" : "#f0ece4" }}>{value}</span>
    </div>
  );
}
