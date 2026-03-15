"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { buildCharacterPayload } from "@/domains/character/store/buildCharacterPayload";
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

export default function GuestGotoweForm() {
  const router = useRouter();
  const store = useWizardStore();
  const { step1, step2, step3, step4, step5, step6, step7 } = store;

  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

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

  async function handleExportPdf() {
    setExportingPdf(true);
    setPdfError(null);
    try {
      const payload = buildCharacterPayload({ step1, step2, step3, step4, step5, step6, step7 });
      const charName = payload.name || "postac";
      const res = await fetch("/api/export-pdf/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step1, step2, step3, step4, step5, step6, step7 }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${charName.replace(/\s+/g, "_")}_karta.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        setPdfError("Nie udało się wygenerować PDF. Sprawdź, czy wszystkie kroki są wypełnione.");
      }
    } catch {
      setPdfError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setExportingPdf(false);
    }
  }

  function handleRegister() {
    const storeState = { step1, step2, step3, step4, step5, step6, step7 };
    localStorage.setItem("guest-wizard-character", JSON.stringify(storeState));
    router.push("/rejestracja");
  }

  return (
    <div className="wizard-card" style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 8 z 8
        </div>

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
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: MID, margin: 0 }}>
          {race?.name ?? "—"}{subrace ? ` · ${subrace.name}` : ""} · {cls?.name ?? "—"}{subclass ? ` (${subclass.name})` : ""}
        </p>

        <div style={{ marginTop: 16 }}>
          <span style={{
            fontFamily: FONT_UI,
            display: "inline-block", padding: "4px 16px",
            border: `1.5px solid ${BLACK}`,
            fontSize: 11, fontWeight: 700, color: BLACK, letterSpacing: "2px", textTransform: "uppercase",
          }}>
            ✓ KREATOR UKOŃCZONY
          </span>
        </div>

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

        <SummarySection title="Koncept" onEdit={() => router.push("/kreator-goscia/koncept")}>
          <SummaryRow label="Imię" value={step1.name} />
          <SummaryRow label="Płeć" value={GENDER_PL[step1.gender]} />
          {step1.age && <SummaryRow label="Wiek" value={`${step1.age} lat`} />}
          {step1.height && <SummaryRow label="Wzrost" value={`${step1.height} cm`} />}
          <SummaryRow label="Alignment" value={ALIGNMENT_PL[step1.alignment]} />
        </SummarySection>

        <SummarySection title="Rasa" onEdit={() => router.push("/kreator-goscia/rasa")}>
          <SummaryRow label="Rasa" value={race?.name ?? "—"} />
          {subrace && <SummaryRow label="Podrasa" value={subrace.name} />}
          <SummaryRow label="Prędkość" value={`${race?.speed ?? 30} stóp`} />
          <SummaryRow label="Rozmiar" value={race?.size ?? "Średni"} />
        </SummarySection>

        <SummarySection title="Klasa" onEdit={() => router.push("/kreator-goscia/klasa")}>
          <SummaryRow label="Klasa" value={cls?.name ?? "—"} />
          {subclass && <SummaryRow label="Podklasa" value={subclass.name} />}
          <SummaryRow label="Kość Życia" value={`k${cls?.hitDie ?? 8}`} />
          {step3.skills.length > 0 && (
            <SummaryRow label="Umiejętności" value={step3.skills.map((s) => SKILL_NAMES_PL[s as keyof typeof SKILL_NAMES_PL] ?? s).join(", ")} />
          )}
        </SummarySection>

        <SummarySection title="Wartości Cech" onEdit={() => router.push("/kreator-goscia/cechy")}>
          <SummaryRow label="Metoda" value={METHOD_PL[step4.method]} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
            {STATS.map(({ key, short }) => (
              <div key={key} style={{ textAlign: "center", border: `1.5px solid ${BLACK}`, padding: "6px 4px" }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: BLACK }}>{step4[key]}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase" }}>{short}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 13, color: BLACK, fontWeight: 700 }}>{mod(step4[key])}</div>
              </div>
            ))}
          </div>
        </SummarySection>

        <SummarySection title="Tło" onEdit={() => router.push("/kreator-goscia/tlo")}>
          <SummaryRow label="Tło" value={bg?.name ?? "—"} />
          {step5.personalityTraits.length > 0 && (
            <SummaryRow label="Cechy char." value={`${step5.personalityTraits.length} wybrane`} />
          )}
          {step5.ideals.length > 0 && <SummaryRow label="Ideał" value="1 wybrany" />}
          {step5.bonds.length > 0 && <SummaryRow label="Więź" value="1 wybrana" />}
          {step5.flaws.length > 0 && <SummaryRow label="Wada" value="1 wybrana" />}
        </SummarySection>

        <SummarySection title="Ekwipunek i Magia" onEdit={() => router.push("/kreator-goscia/ekwipunek")}>
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

      {step1.description && (
        <div style={{ border: `1px solid ${LIGHT}`, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>Historia Postaci</div>
          <p style={{ fontFamily: FONT_UI, fontSize: 14, color: MID, lineHeight: 1.7, margin: 0 }}>{step1.description}</p>
        </div>
      )}

      {/* Baner informacyjny */}
      <div style={{ border: `1.5px solid ${BLACK}`, padding: "12px 16px", marginBottom: 24, background: "#f8f8f8" }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: BLACK, margin: 0, lineHeight: 1.6 }}>
          <strong>Tryb gościa</strong> — ta postać nie zostanie zapisana. Pobierz kartę PDF lub zarejestruj się, aby zachować postać na stałe.
        </p>
      </div>

      {pdfError && (
        <div style={{ border: "1.5px solid #e05252", padding: "12px 16px", marginBottom: 20, fontFamily: FONT_UI, color: "#e05252", fontSize: 13 }}>
          {pdfError}
        </div>
      )}

      {/* Przyciski */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator-goscia/magia")}
          style={{
            padding: "10px 28px",
            border: `1.5px solid ${BLACK}`, background: "transparent",
            color: BLACK, fontFamily: FONT_UI, fontSize: 13, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          ← Wróć
        </button>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={exportingPdf}
            onClick={handleExportPdf}
            style={{
              padding: "10px 24px",
              border: `1.5px solid ${BLACK}`, background: "transparent",
              color: BLACK, fontFamily: FONT_UI, fontSize: 13, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "2px",
              cursor: exportingPdf ? "not-allowed" : "pointer",
              opacity: exportingPdf ? 0.6 : 1,
            }}
          >
            {exportingPdf ? "Generowanie..." : "Eksportuj PDF"}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            style={{
              padding: "12px 28px",
              border: "none",
              background: BLACK,
              color: WHITE,
              fontFamily: FONT_UI, fontSize: 13, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "2px",
              cursor: "pointer",
            }}
          >
            Zarejestruj się i zapisz postać →
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, border = false }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{
      textAlign: "center", padding: "12px 20px",
      borderLeft: border ? `1.5px solid ${BLACK}` : undefined,
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: BLACK, fontStyle: "italic" }}>{value}</div>
      <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 2 }}>{label}</div>
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
        <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{title}</div>
        <button
          type="button"
          onClick={onEdit}
          style={{ fontFamily: FONT_UI, fontSize: 11, color: BLACK, background: "none", border: "none", cursor: "pointer", padding: 0, textTransform: "uppercase", letterSpacing: "1px" }}
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
      <span style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: FONT_UI, fontSize: 13, color: BLACK, textAlign: "right" }}>{value}</span>
    </div>
  );
}
