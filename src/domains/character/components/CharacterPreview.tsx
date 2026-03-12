"use client";

import { useWizardStore } from "@/domains/character/store/wizardStore";
import { RACES } from "@/data/dnd/races";
import { CLASSES } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const ALIGNMENT_SHORT: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const GENDER_PL: Record<string, string> = {
  kobieta: "Kobieta", mezczyzna: "Mężczyzna", inne: "Inne",
};

const STAT_KEYS = [
  { key: "strength" as const,     short: "SIŁ" },
  { key: "dexterity" as const,    short: "ZRR" },
  { key: "constitution" as const, short: "KON" },
  { key: "intelligence" as const, short: "INT" },
  { key: "wisdom" as const,       short: "MĄD" },
  { key: "charisma" as const,     short: "CHA" },
];

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function initials(name: string) {
  return name.trim()
    ? name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
}

export default function CharacterPreview() {
  const { step1, step2, step3, step4, step5, step6, step7 } = useWizardStore();

  const race = RACES.find((r) => r.id === step2.race) ?? null;
  const cls  = CLASSES.find((c) => c.id === step3.class) ?? null;
  const bg   = BACKGROUNDS.find((b) => b.id === step5.background) ?? null;

  const raceName  = race?.name ?? step2.race;
  const className = cls?.name  ?? step3.class;

  const hasName   = step1.name.trim().length > 0;
  const hasRace   = !!step2.race;
  const hasClass  = !!step3.class;
  const hasStats  = step4.strength > 0 && step4.dexterity > 0 && step4.constitution > 0;
  const hasBg     = !!step5.background;
  const hasEquip  = step6.equipment.length > 0 || step6.gold > 0;
  const hasMagic  = step7.cantrips.length > 0 || step7.spells.length > 0;

  // Wyliczenia bojowe
  const conMod = Math.floor((step4.constitution - 10) / 2);
  const dexMod = Math.floor((step4.dexterity - 10) / 2);
  const maxHp  = hasStats && cls ? Math.max(1, cls.hitDie + conMod) : null;
  const ac     = hasStats ? 10 + dexMod : null;
  const initMod = hasStats ? mod(step4.dexterity) : null;
  const speed  = race?.speed ?? null;

  return (
    <aside
      data-testid="character-preview"
      className="character-preview"
      style={{
        width: 220,
        flexShrink: 0,
        position: "sticky",
        top: 140,
        alignSelf: "flex-start",
      }}
    >
      <div style={{ background: WHITE, border: `1.5px solid ${BLACK}` }}>

        {/* ── Nagłówek ── */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{
            fontFamily: FONT_UI, fontSize: 10, color: MID,
            textTransform: "uppercase", letterSpacing: "2.5px",
            marginBottom: 14, borderBottom: `1px solid ${LIGHT}`, paddingBottom: 8,
          }}>
            Podgląd postaci
          </div>

          {/* Inicjały */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div
              data-testid="preview-initials"
              style={{
                width: 56, height: 56,
                border: `1.5px solid ${BLACK}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: "italic", color: BLACK,
              }}
            >
              {initials(step1.name)}
            </div>
          </div>

          {/* Imię */}
          <div
            data-testid="preview-name"
            style={{
              fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 400, fontStyle: "italic",
              color: hasName ? BLACK : LIGHT,
              textAlign: "center", marginBottom: 4, minHeight: 20,
            }}
          >
            {hasName ? step1.name : "Imię postaci"}
          </div>

          {/* Rasa · Klasa */}
          <div
            data-testid="preview-race-class"
            style={{
              fontFamily: FONT_UI, fontSize: 10, color: hasRace || hasClass ? MID : LIGHT,
              textAlign: "center", marginBottom: 14,
              textTransform: "uppercase", letterSpacing: "1px",
            }}
          >
            {hasRace || hasClass
              ? [raceName, className].filter(Boolean).join(" · ")
              : "Rasa · Klasa"}
          </div>
        </div>

        {/* ── Sekcja: Koncept ── */}
        <PreviewSection label="Koncept">
          <StatRow label="Płeć" value={GENDER_PL[step1.gender] ?? "—"} />
          <StatRow
            label="Postawa"
            value={step1.alignment ? (ALIGNMENT_SHORT[step1.alignment]?.split(" ")[0] ?? step1.alignment) : "—"}
          />
          {step1.age   && <StatRow label="Wiek"   value={`${step1.age} lat`} />}
          {step1.height && <StatRow label="Wzrost" value={`${step1.height} cm`} />}
        </PreviewSection>

        {/* ── Sekcja: Walka (po uzupełnieniu cech) ── */}
        {hasStats && (
          <PreviewSection label="Walka" testId="preview-combat">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 2 }}>
              <CombatBox label="Max HP" value={`${maxHp}`} testId="preview-hp" />
              <CombatBox label="KP" value={`${ac}`} testId="preview-ac" />
              <CombatBox label="Inicjatywa" value={`${initMod}`} testId="preview-initiative" />
              <CombatBox label="Prędkość" value={speed ? `${speed}` : "—"} testId="preview-speed" />
            </div>
          </PreviewSection>
        )}

        {/* ── Sekcja: Statystyki (po uzupełnieniu cech) ── */}
        {hasStats && (
          <PreviewSection label="Statystyki" testId="preview-stats">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
              {STAT_KEYS.map(({ key, short }) => {
                const val = step4[key];
                return (
                  <div
                    key={key}
                    data-testid={`preview-stat-${short.toLowerCase()}`}
                    style={{
                      textAlign: "center", border: `1px solid ${LIGHT}`, padding: "4px 2px",
                    }}
                  >
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: BLACK }}>{val}</div>
                    <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase" }}>{short}</div>
                    <div style={{ fontFamily: FONT_UI, fontSize: 10, color: BLACK, fontWeight: 700 }}>{mod(val)}</div>
                  </div>
                );
              })}
            </div>
          </PreviewSection>
        )}

        {/* ── Sekcja: Tło ── */}
        {hasBg && (
          <PreviewSection label="Tło" testId="preview-background">
            <div style={{ fontFamily: FONT_UI, fontSize: 14, color: BLACK }}>
              {bg?.icon && <span style={{ marginRight: 6 }}>{bg.icon}</span>}
              <span data-testid="preview-background-name">{bg?.name ?? step5.background}</span>
            </div>
          </PreviewSection>
        )}

        {/* ── Sekcja: Ekwipunek ── */}
        {hasEquip && (
          <PreviewSection label="Ekwipunek" testId="preview-equipment">
            {step6.equipment.length > 0
              ? <StatRow label="Przedmioty" value={`${step6.equipment.length} szt.`} />
              : <StatRow label="Złoto" value={`${step6.gold} sz.`} />}
          </PreviewSection>
        )}

        {/* ── Sekcja: Magia ── */}
        {hasMagic && (
          <PreviewSection label="Magia" testId="preview-magic">
            {step7.cantrips.length > 0 &&
              <StatRow label="Cantripy" value={`${step7.cantrips.length}`} testId="preview-cantrips" />}
            {step7.spells.length > 0 &&
              <StatRow label="Zaklęcia" value={`${step7.spells.length}`} testId="preview-spells" />}
          </PreviewSection>
        )}

      </div>
    </aside>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function PreviewSection({ label, children, testId }: {
  label: string;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      style={{ borderTop: `1px solid ${LIGHT}`, padding: "10px 20px" }}
    >
      <div style={{
        fontFamily: FONT_UI, fontSize: 10, color: MID,
        textTransform: "uppercase", letterSpacing: "2px",
        marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function StatRow({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </span>
      <span data-testid={testId} style={{ fontFamily: FONT_UI, fontSize: 12, color: BLACK, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

function CombatBox({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div style={{ border: `1px solid ${BLACK}`, padding: "6px 4px", textAlign: "center" }}>
      <div data-testid={testId} style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: BLACK, fontStyle: "italic" }}>
        {value}
      </div>
      <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
