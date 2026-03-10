"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { createCharacter } from "@/domains/character/actions/createCharacter";
import { RACES } from "@/data/dnd/races";
import { CLASSES, SKILL_NAMES_PL } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { getCantripsForClass, getLevel1SpellsForClass } from "@/data/dnd/spells";

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
  const { step1, step2, step3, step4, step5, step6, step7, reset } = store;

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

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const result = await createCharacter({
        name: step1.name,
        gender: step1.gender,
        age: step1.age,
        height: step1.height,
        description: step1.description,
        alignment: step1.alignment,
        race: step2.race,
        subrace: step2.subrace,
        class: step3.class,
        subclass: step3.subclass,
        skills: step3.skills,
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
        languages: step5.languages,
        backstory: step5.backstory,
        equipment: step6.equipment,
        gold: step6.gold,
        cantrips: step7.cantrips,
        spells: step7.spells,
      });

      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }

      reset();
      router.push("/dashboard");
    } catch {
      setError("Wystąpił błąd podczas zapisu. Spróbuj ponownie.");
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Badge ukończenia */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{
          display: "inline-block", padding: "6px 20px", borderRadius: 20,
          background: "rgba(82,201,122,0.1)", border: "1px solid #52c97a44",
          fontSize: 11, fontWeight: 700, color: "#52c97a", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          ✓ KREATOR UKOŃCZONY
        </span>
      </div>

      {/* Nagłówek hero */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
          background: "linear-gradient(135deg, #c9a84c, #b8943c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-cinzel), serif", fontSize: 28, fontWeight: 700, color: "#0f0e17",
        }}>
          {initials}
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 28, fontWeight: 700, color: "#c9a84c", margin: "0 0 8px" }}>
          {step1.name || "Twoja Postać"}
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, margin: 0 }}>
          {race?.name ?? "—"}{subrace ? ` · ${subrace.name}` : ""} · {cls?.name ?? "—"}{subclass ? ` (${subclass.name})` : ""}
        </p>

        {/* Szybkie statsy */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20 }}>
          <QuickStat label="Max HP" value={`${Math.max(1, maxHp)}`} />
          <QuickStat label="KP" value={`${ac}`} />
          <QuickStat label="Inicjatywa" value={mod(step4.dexterity)} />
          <QuickStat label="Prędkość" value={`${race?.speed ?? 30} stóp`} />
        </div>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 32 }} />

      {/* Grid sekcji podsumowania */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>

        {/* Koncept */}
        <SummarySection title="Koncept" step="/kreator/koncept" onEdit={() => router.push("/kreator/koncept")}>
          <SummaryRow label="Imię" value={step1.name} />
          <SummaryRow label="Płeć" value={GENDER_PL[step1.gender]} />
          {step1.age && <SummaryRow label="Wiek" value={`${step1.age} lat`} />}
          {step1.height && <SummaryRow label="Wzrost" value={`${step1.height} cm`} />}
          <SummaryRow label="Alignment" value={ALIGNMENT_PL[step1.alignment]} />
        </SummarySection>

        {/* Rasa */}
        <SummarySection title="Rasa" step="/kreator/rasa" onEdit={() => router.push("/kreator/rasa")}>
          <SummaryRow label="Rasa" value={race?.name ?? "—"} />
          {subrace && <SummaryRow label="Podrasa" value={subrace.name} />}
          <SummaryRow label="Prędkość" value={`${race?.speed ?? 30} stóp`} />
          <SummaryRow label="Rozmiar" value={race?.size ?? "Średni"} />
        </SummarySection>

        {/* Klasa */}
        <SummarySection title="Klasa" step="/kreator/klasa" onEdit={() => router.push("/kreator/klasa")}>
          <SummaryRow label="Klasa" value={cls?.name ?? "—"} />
          {subclass && <SummaryRow label="Podklasa" value={subclass.name} />}
          <SummaryRow label="Kość Życia" value={`k${cls?.hitDie ?? 8}`} />
          {step3.skills.length > 0 && (
            <SummaryRow label="Umiejętności" value={step3.skills.map((s) => SKILL_NAMES_PL[s as keyof typeof SKILL_NAMES_PL] ?? s).join(", ")} />
          )}
        </SummarySection>

        {/* Wartości Cech */}
        <SummarySection title="Wartości Cech" step="/kreator/cechy" onEdit={() => router.push("/kreator/cechy")}>
          <SummaryRow label="Metoda" value={METHOD_PL[step4.method]} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
            {STATS.map(({ key, short }) => (
              <div key={key} style={{ textAlign: "center", background: "#0f0e17", borderRadius: 6, padding: "6px 4px", border: "1px solid #2e2b3d" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0ece4" }}>{step4[key]}</div>
                <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase" }}>{short}</div>
                <div style={{ fontSize: 10, color: "#c9a84c" }}>{mod(step4[key])}</div>
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Tło */}
        <SummarySection title="Tło" step="/kreator/tlo" onEdit={() => router.push("/kreator/tlo")}>
          <SummaryRow label="Tło" value={bg?.name ?? "—"} />
          {step5.personalityTraits.length > 0 && (
            <SummaryRow label="Cechy char." value={`${step5.personalityTraits.length} wybrane`} />
          )}
          {step5.ideals.length > 0 && <SummaryRow label="Ideał" value="1 wybrany" />}
          {step5.bonds.length > 0 && <SummaryRow label="Więź" value="1 wybrana" />}
          {step5.flaws.length > 0 && <SummaryRow label="Wada" value="1 wybrana" />}
        </SummarySection>

        {/* Ekwipunek */}
        <SummarySection title="Ekwipunek" step="/kreator/ekwipunek" onEdit={() => router.push("/kreator/ekwipunek")}>
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
        <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Historia Postaci</div>
          <p style={{ fontSize: 13, color: "#8b8699", lineHeight: 1.7, margin: 0 }}>{step1.description}</p>
        </div>
      )}

      {/* Błąd zapisu */}
      {error && (
        <div style={{ background: "rgba(224,82,82,0.1)", border: "1px solid #e0525244", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#e05252", fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Przyciski */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/magia")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          style={{
            padding: "14px 40px", borderRadius: 8, border: "none",
            background: saving ? "#232136" : "linear-gradient(135deg, #c9a84c, #b8943c)",
            color: saving ? "#4a4759" : "#0f0e17",
            fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Zapisywanie..." : "✨ Zapisz Postać i Graj →"}
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#f0ece4" }}>{value}</div>
      <div style={{ fontSize: 10, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

function SummarySection({
  title, onEdit, children,
}: {
  title: string;
  step: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</div>
        <button
          type="button"
          onClick={onEdit}
          style={{ fontSize: 11, color: "#c9a84c", background: "none", border: "none", cursor: "pointer", padding: 0 }}
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
      <span style={{ fontSize: 11, color: "#4a4759", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: "#8b8699", textAlign: "right" }}>{value}</span>
    </div>
  );
}
