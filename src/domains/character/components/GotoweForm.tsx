"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { createCharacter } from "@/domains/character/actions/createCharacter";
import { updateCharacter } from "@/domains/character/actions/updateCharacter";
import { RACES } from "@/data/dnd/races";
import { CLASSES, SKILL_NAMES_PL } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { getCantripsForClass, getLevel1SpellsForClass } from "@/data/dnd/spells";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

// ── Mapowania ──────────────────────────────────────────────────────────────────

const ALIGNMENT_PL: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwie Neutralny", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const GENDER_PL: Record<string, string> = {
  kobieta: "Kobieta", mezczyzna: "Mężczyzna", inne: "Inne",
};

const METHOD_PL: Record<string, string> = {
  standard: "Standardowy Zestaw", pointbuy: "Zakup Punktów", roll: "Rzut Kośćmi",
};

function mod(score: number): string {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

// ── Główny komponent ───────────────────────────────────────────────────────────

export default function GotoweForm() {
  const router = useRouter();
  const store = useWizardStore();
  const { step1, step2, step3, step4, step5, step6, step7, editingId, reset } = store;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const race = RACES.find((r) => r.id === step2.race);
  const cls = CLASSES.find((c) => c.id === step3.class);
  const bg = BACKGROUNDS.find((b) => b.id === step5.background);

  const subrace = race?.subraces?.find((s) => s.id === step2.subrace);
  const subclass = cls?.subclasses.find((s) => s.id === step3.subclass);

  const conMod = Math.floor((step4.constitution - 10) / 2);
  const dexMod = Math.floor((step4.dexterity - 10) / 2);
  const hitDie = cls?.hitDie ?? 8;
  const maxHp = hitDie + conMod;
  const ac = 10 + dexMod;

  const availableCantrips = getCantripsForClass(step3.class);
  const availableSpells = getLevel1SpellsForClass(step3.class);
  const selectedCantrips = step7.cantrips.map((id) => availableCantrips.find((c) => c.id === id)?.namePl ?? id);
  const selectedSpells = step7.spells.map((id) => availableSpells.find((s) => s.id === id)?.namePl ?? id);

  const STATS = [
    { key: "strength" as const, label: "Siła", short: "SIŁ" },
    { key: "dexterity" as const, label: "Zręczność", short: "ZRR" },
    { key: "constitution" as const, label: "Kondycja", short: "KON" },
    { key: "intelligence" as const, label: "Intelekt", short: "INT" },
    { key: "wisdom" as const, label: "Mądrość", short: "MĄD" },
    { key: "charisma" as const, label: "Charyzma", short: "CHA" },
  ];

  const initials = step1.name.trim().slice(0, 2).toUpperCase() || "??";

  const characterPayload = {
    name: step1.name,
    gender: step1.gender,
    age: step1.age,
    height: step1.height,
    weight: step1.weight,
    eyeColor: step1.eyeColor || undefined,
    skinColor: step1.skinColor || undefined,
    hairColor: step1.hairColor || undefined,
    description: step1.description,
    alignment: step1.alignment,
    race: step2.race,
    subrace: step2.subrace,
    class: step3.class,
    subclass: step3.subclass,
    skills: [...new Set([...step3.skills, ...(bg?.skillProficiencies ?? [])])],
    strength: step4.strength || 10,
    dexterity: step4.dexterity || 10,
    constitution: step4.constitution || 10,
    intelligence: step4.intelligence || 10,
    wisdom: step4.wisdom || 10,
    charisma: step4.charisma || 10,
    background: step5.background,
    personalityTraits: step5.personalityTraits,
    ideals: step5.ideals,
    bonds: step5.bonds,
    flaws: step5.flaws,
    languages: [
      ...(race?.languages.filter((l) => !l.includes("wg wyboru")) ?? []),
      ...step5.languages,
    ],
    backstory: step5.backstory,
    allies: step5.allies || undefined,
    treasure: step5.treasure || undefined,
    equipment: step6.equipment,
    gold: step6.gold,
    cantrips: step7.cantrips,
    spells: step7.spells,
  };

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      let result: { error?: string; characterId?: string };

      if (editingId) {
        result = await updateCharacter({ id: editingId, ...characterPayload });
      } else {
        result = await createCharacter(characterPayload);
      }

      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }

      reset();
      if (editingId) {
        router.push(`/karta/${editingId}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Wystąpił błąd podczas zapisu. Spróbuj ponownie.");
      setSaving(false);
    }
  }

  return (
    <div className="wizard-card" style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 8 z 8
        </div>

        {/* Inicjały w okręgu */}
        <div style={{
          width: 80, height: 80, margin: "0 auto 16px",
          border: `1.5px solid ${BLACK}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: BLACK,
          fontStyle: "italic",
        }}>
          {initials}
        </div>

        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: "0 0 8px" }}>
          {step1.name || "Twoja Postać"}
        </h1>
        <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, margin: 0 }}>
          {race?.name ?? "—"}{subrace ? ` · ${subrace.name}` : ""} · {cls?.name ?? "—"}{subclass ? ` (${subclass.name})` : ""}
        </p>

        {/* Badge ukończenia */}
        <div style={{ marginTop: 16 }}>
          <span style={{
            fontFamily: FONT_UI,
            display: "inline-block", padding: "4px 16px",
            border: `1.5px solid ${BLACK}`,
            fontSize: 16, fontWeight: 700, color: BLACK, letterSpacing: "2px", textTransform: "uppercase",
          }}>
            ✓ KREATOR UKOŃCZONY
          </span>
        </div>

        {/* Szybkie statsy */}
        <div className="gotowe-quickstats" style={{ display: "inline-flex", justifyContent: "center", gap: 0, marginTop: 20, border: `1.5px solid ${BLACK}` }}>
          <QuickStat label="Max HP" value={`${Math.max(1, maxHp)}`} />
          <QuickStat label="KP" value={`${ac}`} border />
          <QuickStat label="Inicjatywa" value={mod(step4.dexterity)} border />
          <QuickStat label="Prędkość" value={`${race?.speed ?? 30} stóp`} border />
        </div>
      </div>

      <div style={{ height: 1.5, background: BLACK, marginBottom: 32 }} />

      {/* Grid sekcji podsumowania */}
      <div className="gotowe-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>

        {/* Koncept */}
        <SummarySection title="Koncept" onEdit={() => router.push("/kreator/koncept")}>
          <SummaryRow label="Imię" value={step1.name} />
          <SummaryRow label="Płeć" value={GENDER_PL[step1.gender]} />
          {step1.age && <SummaryRow label="Wiek" value={`${step1.age} lat`} />}
          {step1.height && <SummaryRow label="Wzrost" value={`${step1.height} cm`} />}
          <SummaryRow label="Alignment" value={ALIGNMENT_PL[step1.alignment]} />
        </SummarySection>

        {/* Rasa */}
        <SummarySection title="Rasa" onEdit={() => router.push("/kreator/rasa")}>
          <SummaryRow label="Rasa" value={race?.name ?? "—"} />
          {subrace && <SummaryRow label="Podrasa" value={subrace.name} />}
          <SummaryRow label="Prędkość" value={`${race?.speed ?? 30} stóp`} />
          <SummaryRow label="Rozmiar" value={race?.size ?? "Średni"} />
        </SummarySection>

        {/* Klasa */}
        <SummarySection title="Klasa" onEdit={() => router.push("/kreator/klasa")}>
          <SummaryRow label="Klasa" value={cls?.name ?? "—"} />
          {subclass && <SummaryRow label="Podklasa" value={subclass.name} />}
          <SummaryRow label="Kość Życia" value={`k${cls?.hitDie ?? 8}`} />
          {step3.skills.length > 0 && (
            <SummaryRow label="Umiejętności" value={step3.skills.map((s) => SKILL_NAMES_PL[s as keyof typeof SKILL_NAMES_PL] ?? s).join(", ")} />
          )}
        </SummarySection>

        {/* Wartości Cech */}
        <SummarySection title="Wartości Cech" onEdit={() => router.push("/kreator/cechy")}>
          <SummaryRow label="Metoda" value={METHOD_PL[step4.method]} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
            {STATS.map(({ key, short }) => (
              <div key={key} style={{ textAlign: "center", border: `1.5px solid ${BLACK}`, padding: "6px 4px" }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: BLACK }}>{step4[key]}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase" }}>{short}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 16, color: BLACK, fontWeight: 700 }}>{mod(step4[key])}</div>
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Tło */}
        <SummarySection title="Tło" onEdit={() => router.push("/kreator/tlo")}>
          <SummaryRow label="Tło" value={bg?.name ?? "—"} />
          {step5.personalityTraits.length > 0 && (
            <SummaryRow label="Cechy char." value={`${step5.personalityTraits.length} wybrane`} />
          )}
          {step5.ideals.length > 0 && <SummaryRow label="Ideał" value="1 wybrany" />}
          {step5.bonds.length > 0 && <SummaryRow label="Więź" value="1 wybrana" />}
          {step5.flaws.length > 0 && <SummaryRow label="Wada" value="1 wybrana" />}
        </SummarySection>

        {/* Ekwipunek + Magia */}
        <SummarySection title="Ekwipunek i Magia" onEdit={() => router.push("/kreator/ekwipunek")}>
          {step6.equipment.length > 0 ? (
            <SummaryRow label="Przedmioty" value={`${step6.equipment.length} szt.`} />
          ) : (
            <SummaryRow label="Złoto" value={`${step6.gold} sz.`} />
          )}
          {selectedCantrips.length > 0 && (
            <SummaryRow label="Cantripy" value={`${selectedCantrips.length} wybrane`} />
          )}
          {selectedSpells.length > 0 && (
            <SummaryRow label="Zaklęcia" value={`${selectedSpells.length} wybrane`} />
          )}
        </SummarySection>
      </div>

      {/* Historia */}
      {step1.description && (
        <div style={{ border: `1px solid ${LIGHT}`, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>Historia Postaci</div>
          <p style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, lineHeight: 1.7, margin: 0 }}>{step1.description}</p>
        </div>
      )}

      {/* Błąd zapisu */}
      {error && (
        <div style={{ border: "1.5px solid #e05252", padding: "12px 16px", marginBottom: 20, fontFamily: FONT_UI, color: "#e05252", fontSize: 16 }}>
          {error}
        </div>
      )}

      {/* Przyciski */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/magia")}
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
          disabled={saving}
          onClick={handleSave}
          style={{
            padding: "12px 40px", border: "none",
            background: saving ? LIGHT : BLACK,
            color: saving ? MID : WHITE,
            fontFamily: FONT_UI, fontSize: 16, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "2px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Zapisywanie..." : editingId ? "Zapisz Zmiany →" : "Zapisz Postać i Graj →"}
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function QuickStat({ label, value, border = false }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{
      textAlign: "center", padding: "12px 20px",
      borderLeft: border ? `1.5px solid ${BLACK}` : undefined,
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: BLACK, fontStyle: "italic" }}>{value}</div>
      <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SummarySection({
  title, onEdit, children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: `1.5px solid ${BLACK}`, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{title}</div>
        <button
          type="button"
          onClick={onEdit}
          style={{ fontFamily: FONT_UI, fontSize: 16, color: BLACK, background: "none", border: "none", cursor: "pointer", padding: 0, textTransform: "uppercase", letterSpacing: "1px" }}
        >
          Edytuj →
        </button>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 16, color: MID, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: FONT_UI, fontSize: 16, color: BLACK, textAlign: "right" }}>{value}</span>
    </div>
  );
}
