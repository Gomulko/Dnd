"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { RACES } from "@/data/dnd/races";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseItems(raw: string): string[] {
  return raw.split(", ").filter(Boolean);
}

// ── Główny komponent ───────────────────────────────────────────────────────────

export default function EkwipunekForm() {
  const router = useRouter();
  const { step2, step3, step4, step5, step6, setStep6 } = useWizardStore();

  const cls = CLASSES.find((c) => c.id === step3.class);
  const bg = BACKGROUNDS.find((b) => b.id === step5.background);
  const race = RACES.find((r) => r.id === step2.race);

  const [packageChoice, setPackageChoice] = useState<"A" | "gold">(
    step6.gold > 0 && step6.equipment.length === 0 ? "gold" : "A"
  );

  useEffect(() => {
    if (!cls) return;
    if (packageChoice === "A") {
      const items = parseItems(cls.startingEquipmentA).map((name) => ({ name, qty: 1, weight: 0 }));
      setStep6({ equipment: items, gold: 0 });
    } else {
      setStep6({ equipment: [], gold: cls.startingEquipmentGold });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageChoice, step3.class]);

  const classItems = packageChoice === "A" && cls ? parseItems(cls.startingEquipmentA) : [];
  const bgItems = bg ? bg.equipmentA : [];

  const dexMod = Math.floor((step4.dexterity - 10) / 2);
  const ac = 10 + dexMod;
  const speed = race?.speed ?? 30;

  return (
    <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 48px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 7, textTransform: "uppercase", letterSpacing: "4px", color: MID, marginBottom: 10 }}>
          Krok 6 z 8
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Ekwipunek Startowy
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, margin: 0 }}>
          Wybierz pakiet ekwipunku lub zacznij z funtem złota.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Lewa kolumna */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Ekwipunek klasy */}
          <SectionHeader label="Ekwipunek Klasy" icon={cls?.icon ?? "⚔"} subtitle={cls?.name ?? "—"} />

          {!cls ? (
            <p style={{ fontFamily: FONT_UI, color: MID, fontSize: 12 }}>Wróć do kroku Klasa i wybierz klasę.</p>
          ) : (
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {/* Pakiet A */}
              <PackageCard
                label="Pakiet A"
                sublabel="Gotowy ekwipunek"
                active={packageChoice === "A"}
                onClick={() => setPackageChoice("A")}
              >
                <ul style={{ margin: "8px 0 0", padding: "0 0 0 16px", listStyle: "disc" }}>
                  {parseItems(cls.startingEquipmentA).map((item, i) => (
                    <li key={i} style={{ fontFamily: FONT_UI, fontSize: 12, color: packageChoice === "A" ? LIGHT : MID, marginBottom: 3 }}>{item}</li>
                  ))}
                </ul>
              </PackageCard>

              {/* Pakiet Złota */}
              <PackageCard
                label="Pakiet Złota"
                sublabel="Kup sam w sklepie"
                active={packageChoice === "gold"}
                onClick={() => setPackageChoice("gold")}
              >
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: packageChoice === "gold" ? WHITE : BLACK }}>
                    {cls.startingEquipmentGold}
                  </span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 13, color: packageChoice === "gold" ? LIGHT : MID, marginLeft: 6 }}>sz. złota</span>
                </div>
              </PackageCard>
            </div>
          )}

          {/* Ekwipunek z tła */}
          <SectionHeader label="Ekwipunek z Tła" icon={bg?.icon ?? "📜"} subtitle={bg?.name ?? "—"} />

          {!bg ? (
            <p style={{ fontFamily: FONT_UI, color: MID, fontSize: 12 }}>Wróć do kroku Tło i wybierz tło.</p>
          ) : (
            <div style={{ border: `1px solid ${LIGHT}`, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontFamily: FONT_UI, fontSize: 9, padding: "2px 8px",
                  border: `1px solid ${BLACK}`, color: BLACK,
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>Automatycznie dodany</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "disc" }}>
                {bgItems.map((item, i) => (
                  <li key={i} style={{ fontFamily: FONT_UI, fontSize: 12, color: MID, marginBottom: 3 }}>{item}</li>
                ))}
              </ul>
              {bg.equipmentGold > 0 && (
                <div style={{ marginTop: 8, fontFamily: FONT_UI, fontSize: 12, color: MID }}>
                  + {bg.equipmentGold} sz. złota z tła
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel podsumowania */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: 20 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 7, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14, borderBottom: `1px solid ${LIGHT}`, paddingBottom: 4 }}>
              Panel Bojowy
            </div>

            <SummaryRow label="Klasa Pancerza" value={`${ac}`} />
            <SummaryRow label="Prędkość" value={`${speed} stóp`} />
            <SummaryRow label="Bonus Biegłości" value="+2" />

            <div style={{ height: 1, background: LIGHT, margin: "12px 0" }} />

            <div style={{ fontFamily: FONT_UI, fontSize: 7, color: MID, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>
              Ekwipunek ({classItems.length + bgItems.length} szt.)
            </div>

            {packageChoice === "gold" && cls && (
              <div style={{ fontFamily: FONT_UI, fontSize: 12, color: BLACK, marginBottom: 8, fontWeight: 700 }}>
                🪙 {cls.startingEquipmentGold + (bg?.equipmentGold ?? 0)} sz. złota
              </div>
            )}

            {classItems.map((item, i) => (
              <div key={i} style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, marginBottom: 4, display: "flex", gap: 6 }}>
                <span style={{ color: BLACK }}>·</span>
                <span>{item}</span>
              </div>
            ))}

            {bgItems.map((item, i) => (
              <div key={i} style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, marginBottom: 4, display: "flex", gap: 6 }}>
                <span>·</span>
                <span>{item}</span>
              </div>
            ))}

            {classItems.length === 0 && bgItems.length === 0 && packageChoice !== "gold" && (
              <p style={{ fontFamily: FONT_UI, fontSize: 11, color: LIGHT }}>Brak wybranego ekwipunku</p>
            )}

            {(step6.gold > 0 || (bg?.equipmentGold ?? 0) > 0) && packageChoice === "A" && (
              <>
                <div style={{ height: 1, background: LIGHT, margin: "10px 0" }} />
                <div style={{ fontFamily: FONT_UI, fontSize: 12, color: BLACK }}>
                  🪙 {(bg?.equipmentGold ?? 0)} sz. złota
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nawigacja */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/tlo")}
          style={{
            padding: "10px 28px",
            border: `1.5px solid ${BLACK}`, background: "transparent",
            color: BLACK, fontFamily: FONT_UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          onClick={() => router.push("/kreator/magia")}
          style={{
            padding: "10px 28px", border: "none",
            background: BLACK, color: WHITE,
            fontFamily: FONT_UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer",
          }}
        >
          Dalej — Magia →
        </button>
      </div>
    </div>
  );
}

// ── Podkomponenty ──────────────────────────────────────────────────────────────

function SectionHeader({ label, icon, subtitle }: { label: string; icon: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: FONT_UI, fontSize: 7, color: MID, textTransform: "uppercase", letterSpacing: "2px" }}>{label}</div>
        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: BLACK, fontWeight: 700 }}>{subtitle}</div>
      </div>
    </div>
  );
}

function PackageCard({
  label, sublabel, active, onClick, children,
}: {
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, textAlign: "left", padding: "14px 16px", cursor: "pointer",
        background: active ? BLACK : "transparent",
        border: `1.5px solid ${active ? BLACK : LIGHT}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 14, height: 14, flexShrink: 0,
          border: `1.5px solid ${active ? WHITE : LIGHT}`,
          background: active ? WHITE : "transparent",
        }} />
        <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 700, color: active ? WHITE : BLACK }}>{label}</span>
      </div>
      <div style={{ fontFamily: FONT_UI, fontSize: 10, color: active ? LIGHT : MID, marginLeft: 22, marginBottom: 4 }}>{sublabel}</div>
      {children}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 9, color: MID, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: BLACK }}>{value}</span>
    </div>
  );
}
