"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWizardStore } from "@/domains/character/store/wizardStore";
import { CLASSES } from "@/data/dnd/classes";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import { RACES } from "@/data/dnd/races";

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

  // Detect current package from store: if gold > 0 → "gold" package was chosen
  const [packageChoice, setPackageChoice] = useState<"A" | "gold">(
    step6.gold > 0 && step6.equipment.length === 0 ? "gold" : "A"
  );

  // Keep step6 in sync when choice or class changes
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
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Krok 6 z 8
        </div>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: 0 }}>
          Ekwipunek Startowy
        </h1>
        <p style={{ color: "#8b8699", fontSize: 14, marginTop: 8 }}>
          Wybierz pakiet ekwipunku lub zacznij z funtem złota.
        </p>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)", marginBottom: 24 }} />

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Lewa kolumna */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Ekwipunek klasy */}
          <SectionHeader label="Ekwipunek Klasy" icon={cls?.icon ?? "⚔"} subtitle={cls?.name ?? "—"} />

          {!cls ? (
            <p style={{ color: "#4a4759", fontSize: 13 }}>Wróć do kroku Klasa i wybierz klasę.</p>
          ) : (
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {/* Pakiet A */}
              <PackageCard
                label="Pakiet A"
                sublabel="Gotowy ekwipunek"
                active={packageChoice === "A"}
                onClick={() => setPackageChoice("A")}
              >
                <ul style={{ margin: "8px 0 0", padding: "0 0 0 16px", listStyle: "disc" }}>
                  {parseItems(cls.startingEquipmentA).map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: "#8b8699", marginBottom: 3 }}>{item}</li>
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
                  <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 28, fontWeight: 700, color: "#c9a84c" }}>
                    {cls.startingEquipmentGold}
                  </span>
                  <span style={{ fontSize: 13, color: "#8b8699", marginLeft: 6 }}>sz. złota</span>
                </div>
              </PackageCard>
            </div>
          )}

          {/* Ekwipunek z tła */}
          <SectionHeader label="Ekwipunek z Tła" icon={bg?.icon ?? "📜"} subtitle={bg?.name ?? "—"} />

          {!bg ? (
            <p style={{ color: "#4a4759", fontSize: 13 }}>Wróć do kroku Tło i wybierz tło.</p>
          ) : (
            <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 10,
                  background: "rgba(82,201,122,0.1)", border: "1px solid #52c97a44",
                  color: "#52c97a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>Automatycznie dodany</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "disc" }}>
                {bgItems.map((item, i) => (
                  <li key={i} style={{ fontSize: 12, color: "#4a4759", marginBottom: 3 }}>{item}</li>
                ))}
              </ul>
              {bg.equipmentGold > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#4a4759" }}>
                  + {bg.equipmentGold} sz. złota z tła
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel podsumowania */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: "#1a1825", border: "1px solid #2e2b3d", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                Panel Bojowy
              </div>

              <SummaryRow label="Klasa Pancerza" value={`${ac}`} />
              <SummaryRow label="Prędkość" value={`${speed} stóp`} />
              <SummaryRow label="Bonus Biegłości" value="+2" />

              <div style={{ height: 1, background: "#2e2b3d", margin: "12px 0" }} />

              <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                Ekwipunek ({classItems.length + bgItems.length} szt.)
              </div>

              {packageChoice === "gold" && cls && (
                <div style={{ fontSize: 12, color: "#c9a84c", marginBottom: 8, fontWeight: 700 }}>
                  🪙 {cls.startingEquipmentGold + (bg?.equipmentGold ?? 0)} sz. złota
                </div>
              )}

              {classItems.map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: "#8b8699", marginBottom: 4, display: "flex", gap: 6 }}>
                  <span style={{ color: "#c9a84c" }}>·</span>
                  <span>{item}</span>
                </div>
              ))}

              {bgItems.map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: "#4a4759", marginBottom: 4, display: "flex", gap: 6 }}>
                  <span>·</span>
                  <span>{item}</span>
                </div>
              ))}

              {classItems.length === 0 && bgItems.length === 0 && packageChoice !== "gold" && (
                <p style={{ fontSize: 11, color: "#2e2b3d" }}>Brak wybranego ekwipunku</p>
              )}

              {(step6.gold > 0 || (bg?.equipmentGold ?? 0) > 0) && packageChoice === "A" && (
                <>
                  <div style={{ height: 1, background: "#2e2b3d", margin: "10px 0" }} />
                  <div style={{ fontSize: 12, color: "#c9a84c" }}>
                    🪙 {(bg?.equipmentGold ?? 0)} sz. złota
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nawigacja — Ekwipunek zawsze można pominąć */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #2e2b3d" }}>
        <button
          type="button"
          onClick={() => router.push("/kreator/tlo")}
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #2e2b3d", background: "transparent", color: "#8b8699", fontSize: 14, cursor: "pointer" }}
        >
          ← Wróć
        </button>
        <button
          type="button"
          onClick={() => router.push("/kreator/magia")}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #c9a84c, #b8943c)",
            color: "#0f0e17", fontSize: 14, fontWeight: 700, cursor: "pointer",
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
        <div style={{ fontSize: 9, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
        <div style={{ fontSize: 13, color: "#c9a84c", fontWeight: 700 }}>{subtitle}</div>
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
        flex: 1, textAlign: "left", padding: "14px 16px", borderRadius: 10, cursor: "pointer",
        background: active ? "rgba(201,168,76,0.08)" : "#1a1825",
        border: `2px solid ${active ? "#c9a84c" : "#2e2b3d"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${active ? "#c9a84c" : "#4a4759"}`,
          background: active ? "#c9a84c" : "transparent",
        }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#c9a84c" : "#f0ece4" }}>{label}</span>
      </div>
      <div style={{ fontSize: 10, color: "#4a4759", marginLeft: 22, marginBottom: 4 }}>{sublabel}</div>
      {children}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "#4a4759" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#f0ece4" }}>{value}</span>
    </div>
  );
}
