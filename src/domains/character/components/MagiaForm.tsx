"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { getCantripsForClass, getLevel1SpellsForClass } from "@/data/dnd/spells";
import type { Spell, SpellSchool } from "@/data/dnd/spells";
import Tooltip from "@/shared/ui/Tooltip";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

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

const SCHOOL_TOOLTIPS: Partial<Record<SpellSchool, string>> = {
  Abjuration:    "Ochrona i odpędzanie — bariery, odporności, anulowanie magii.",
  Conjuration:   "Przywoływanie stworzeń i teleportacja — materializuje sojuszników lub przenosi się w przestrzeni.",
  Divination:    "Przepowiednia i wykrywanie — ujawnia ukryte informacje, przyszłość i wrogów.",
  Enchantment:   "Wpływanie na umysły — usypia, fascynuje, wydaje rozkazy.",
  Evocation:     "Czysta energia — ogień, błyskawice, lód. Najbardziej ofensywna szkoła.",
  Illusion:      "Fałszywe obrazy i dźwięki — zmyla wrogów i ukrywa sojuszników.",
  Necromancy:    "Manipulacja życiem i śmiercią — wysysa energię życiową lub ożywia umarłych.",
  Transmutation: "Zmiana właściwości — modyfikuje istoty, obiekty i środowisko.",
};

const MAGIC_ROW_TOOLTIPS: Record<string, string> = {
  Atrybut:       "Cecha decydująca o mocy twoich zaklęć. Wyższy modyfikator = wyższe DC i bonus ataku.",
  "DC Zaklęć":   "Difficulty Class — liczba którą wróg musi wyrzucić żeby oprzeć się zaklęciu. Wzór: 8 + premia biegłości + modyfikator atrybutu.",
  "Bonus Ataku": "Dodawany do rzutu ataku zaklęciami wymagającymi trafienia (np. Ognisty Pocisk). Wzór: premia biegłości + modyfikator atrybutu.",
  "Sloty poz. 1": "Ile razy dziennie możesz rzucić zaklęcie 1. poziomu. Odnawia się po długim odpoczynku (8h).",
};

const CANTRIP_SECTION_TOOLTIP = "Cantripy to zaklęcia znane na pamięć — używasz ich do woli, bez slotów zaklęć. Zawsze dostępne, nie mają limitu dziennego użycia.";
const SPELL_SECTION_TOOLTIP   = "Zaklęcia 1. poziomu są potężniejsze, ale wymagają slotu zaklęcia. Masz ograniczoną liczbę slotów na dzień — odnawiają się po długim odpoczynku.";

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
    <div className="wizard-card" style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 7 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Magia
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>
          {isSpellcaster
            ? `Wybierz zaklęcia startowe dla klasy ${cls?.name ?? ""}.`
            : "Ta klasa nie posiada zdolności magicznych."}
        </p>
      </div>

      {!isSpellcaster ? (
        /* Klasa niemagiczna */
        <div style={{ border: `1.5px dashed ${LIGHT}`, padding: "60px 0", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚔</div>
          <p style={{ fontFamily: FONT_UI, color: MID, fontSize: 17 }}>{cls?.name ?? "Ta klasa"} nie posiada zaklęć.</p>
          <p style={{ fontFamily: FONT_UI, color: LIGHT, fontSize: 16, marginTop: 8 }}>Ten krok zostaje pominięty.</p>
        </div>
      ) : (
        <div className="magia-layout" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Lewa kolumna — wybór zaklęć */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Filtr szkoły */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {(["Wszystkie", ...allSchools] as const).map((school) => {
                const label = school === "Wszystkie" ? "Wszystkie" : SCHOOL_LABELS[school as SpellSchool];
                const active = schoolFilter === school;
                const schoolTooltip = school !== "Wszystkie" ? SCHOOL_TOOLTIPS[school as SpellSchool] : undefined;
                const btn = (
                  <button
                    key={school}
                    type="button"
                    onClick={() => setSchoolFilter(school as SpellSchool | "Wszystkie")}
                    style={{
                      padding: "5px 12px",
                      fontFamily: FONT_UI, fontSize: 16,
                      border: active ? `1.5px solid ${BLACK}` : `1.5px solid ${LIGHT}`,
                      background: active ? BLACK : "transparent",
                      color: active ? WHITE : MID,
                      cursor: "pointer",
                      textTransform: "uppercase", letterSpacing: "1px",
                    }}
                  >
                    {label}
                  </button>
                );
                return schoolTooltip
                  ? <Tooltip key={school} content={schoolTooltip} position="bottom">{btn}</Tooltip>
                  : btn;
              })}
            </div>

            {/* Cantrips */}
            {cantripLimit > 0 && (
              <SpellSection
                title={`CANTRIPY (${step7.cantrips.length}/${cantripLimit})`}
                titleTooltip={CANTRIP_SECTION_TOOLTIP}
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
                titleTooltip={SPELL_SECTION_TOOLTIP}
                spells={filteredSpells}
                selected={step7.spells}
                maxSelect={spellLimit}
                onToggle={toggleSpell}
              />
            )}
          </div>

          {/* Panel statystyk magii */}
          <div className="magia-panel" style={{ width: 200, flexShrink: 0 }}>
            <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: 20 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14, borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4 }}>
                Statystyki Magii
              </div>
              <MagicRow label="Atrybut" value={cls?.spellcastingAbility?.toUpperCase() ?? "—"} tooltip={MAGIC_ROW_TOOLTIPS["Atrybut"]} />
              <MagicRow label="DC Zaklęć" value={`${spellDc}`} highlight tooltip={MAGIC_ROW_TOOLTIPS["DC Zaklęć"]} />
              <MagicRow label="Bonus Ataku" value={`+${2 + spellMod}`} tooltip={MAGIC_ROW_TOOLTIPS["Bonus Ataku"]} />
              <MagicRow label="Sloty poz. 1" value="2" tooltip={MAGIC_ROW_TOOLTIPS["Sloty poz. 1"]} />

              {step7.cantrips.length > 0 && (
                <>
                  <div style={{ height: 1, background: LIGHT, margin: "12px 0" }} />
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
                    Wybrane Cantripy
                  </div>
                  {step7.cantrips.map((id) => {
                    const sp = availableCantrips.find((c) => c.id === id);
                    return sp ? (
                      <div key={id} style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, marginBottom: 4 }}>· {sp.namePl}</div>
                    ) : null;
                  })}
                </>
              )}

              {step7.spells.length > 0 && (
                <>
                  <div style={{ height: 1, background: LIGHT, margin: "12px 0" }} />
                  <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
                    Wybrane Zaklęcia
                  </div>
                  {step7.spells.map((id) => {
                    const sp = availableSpells.find((s) => s.id === id);
                    return sp ? (
                      <div key={id} style={{ fontFamily: FONT_UI, fontSize: 16, color: BLACK, marginBottom: 4, fontWeight: 600 }}>· {sp.namePl}</div>
                    ) : null;
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/ekwipunek")}
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
          onClick={() => router.push("/kreator/gotowe")}
          style={{
            padding: "10px 28px", border: "none",
            background: canProceed ? BLACK : LIGHT,
            color: canProceed ? WHITE : MID,
            fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "2px",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          Dalej — Gotowe →
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function SpellSection({ title, titleTooltip, spells, selected, maxSelect, onToggle }: {
  title: string;
  titleTooltip?: string;
  spells: Spell[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
        {titleTooltip ? (
          <Tooltip content={titleTooltip} position="right">
            <span style={{ borderBottom: `1px dashed ${LIGHT}`, cursor: "help" }}>{title}</span>
          </Tooltip>
        ) : title}
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
                textAlign: "left", padding: "10px 12px", cursor: isDisabled ? "not-allowed" : "pointer",
                background: isSelected ? BLACK : "transparent",
                border: `1.5px solid ${isSelected ? BLACK : LIGHT}`,
              }}
            >
              <div style={{ fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, color: isDisabled ? LIGHT : isSelected ? WHITE : MID }}>
                {isSelected && <span style={{ marginRight: 4 }}>✓</span>}
                {spell.namePl}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT_UI, fontSize: 16, padding: "1px 6px", border: `1px solid ${LIGHT}`, color: MID }}>
                  {SCHOOL_LABELS[spell.school]}
                </span>
                {spell.ritual && (
                  <Tooltip content="Można rzucić jako rytuał (10 min dłużej) bez zużywania slotu zaklęcia. Idealne dla zaklęć użytkowych poza walką." position="top">
                    <span style={{ fontFamily: FONT_UI, fontSize: 16, padding: "1px 6px", border: `1px solid ${LIGHT}`, color: MID, cursor: "help" }}>
                      Rytuał
                    </span>
                  </Tooltip>
                )}
                {spell.concentration && (
                  <Tooltip content="Wymaga Koncentracji — możesz utrzymywać tylko jedno takie zaklęcie na raz. Otrzymanie obrażeń może je przerwać (rzut KON DC 10)." position="top">
                    <span style={{ fontFamily: FONT_UI, fontSize: 16, padding: "1px 6px", border: `1px solid ${LIGHT}`, color: MID, cursor: "help" }}>
                      Konc.
                    </span>
                  </Tooltip>
                )}
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: 16, color: isSelected ? LIGHT : MID, marginTop: 4, lineHeight: 1.3 }}>
                {spell.castingTime} · {spell.range}
              </div>
            </button>
          );
        })}
      </div>
      {spells.length === 0 && (
        <p style={{ fontFamily: FONT_UI, color: MID, fontSize: 16 }}>Brak zaklęć dla wybranej szkoły.</p>
      )}
    </div>
  );
}

function MagicRow({ label, value, highlight = false, tooltip }: { label: string; value: string; highlight?: boolean; tooltip?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      {tooltip ? (
        <Tooltip content={tooltip} position="left">
          <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `1px dashed ${LIGHT}`, cursor: "help" }}>{label}</span>
        </Tooltip>
      ) : (
        <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
      )}
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: highlight ? 24 : 20, color: BLACK, fontWeight: highlight ? 700 : 400 }}>{value}</span>
    </div>
  );
}
