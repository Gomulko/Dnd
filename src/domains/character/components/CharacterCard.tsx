"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CharacterSummary } from "@/domains/character/actions/getCharacters";
import { deleteCharacter } from "@/domains/character/actions/deleteCharacter";
import { mod, modNum, maxHp as calcMaxHp } from "@/shared/lib/dnd-mechanics";
import { CLASSES } from "@/data/dnd/classes";

// ── helpers ─────────────────────────────────────────────────────────────────

const CLASS_LABELS: Record<string, string> = {
  barbarian: "Barbarzyńca", bard: "Bard", cleric: "Kleryk",
  druid: "Druid", fighter: "Wojownik", monk: "Mnich",
  paladin: "Paladyn", ranger: "Łowca", rogue: "Łotrzyk",
  sorcerer: "Czarownik", warlock: "Warlock", wizard: "Czarodziej",
};

const RACE_LABELS: Record<string, string> = {
  human: "Człowiek", dwarf: "Krasnolud", elf: "Elf",
  halfling: "Niziołek", gnome: "Gnom", dragonborn: "Drakonid",
  tiefling: "Tiefling", goliath: "Goliath", orc: "Ork",
  "half-elf": "Półelf", "half-orc": "Półork",
  "high-elf": "Elf", "wood-elf": "Elf", "dark-elf": "Elf",
};

const SUBCLASS_LABELS: Record<string, string> = {
  life: "Domena Życia", light: "Domena Światła", war: "Domena Wojny",
  knowledge: "Domena Wiedzy", nature: "Domena Natury",
  trickery: "Domena Oszustwa", tempest: "Domena Burzy",
  berserker: "Berserkier", lore: "Kolegium Wiedzy",
  land: "Krąg Ziemi", champion: "Mistrz", "open-hand": "Otwarta Dłoń",
  devotion: "Przysięga Pobożności", hunter: "Łowca",
  thief: "Złodziej", draconic: "Rodowód Smoczy",
  fiend: "Pakt Fienda", evocation: "Szkoła Ewokacji",
};

const ALIGNMENT_LABELS: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

const CLASS_COLORS: Record<string, string> = {
  barbarian: "#e05252", bard: "#7c5cbf", cleric: "#e8c97a",
  druid: "#52c97a", fighter: "#e05252", monk: "#52c97a",
  paladin: "#e8c97a", ranger: "#52c97a", rogue: "#8b8699",
  sorcerer: "#7c5cbf", warlock: "#7c5cbf", wizard: "#5c9be8",
};

function modifier(score: number) {
  return mod(score);
}

function maxHp(cls: string, level: number, conScore: number) {
  const die = CLASSES.find((c) => c.id === cls)?.hitDie ?? 8;
  return calcMaxHp(die, level, modNum(conScore));
}

function hpColor(current: number, max: number) {
  const pct = current / max;
  if (pct > 0.6) return "#52c97a";
  if (pct > 0.3) return "#e8c97a";
  return "#e05252";
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── component ────────────────────────────────────────────────────────────────

interface Props {
  character: CharacterSummary;
}

export default function CharacterCard({ character: c }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCharacter({ id: c.id });
    if ("error" in result) {
      setDeleting(false);
      setConfirmDelete(false);
      return;
    }
    router.refresh();
  }

  const clsLabel = CLASS_LABELS[c.class] ?? c.class;
  const raceLabel = RACE_LABELS[c.race] ?? c.race;
  const subclassLabel = c.subclass ? SUBCLASS_LABELS[c.subclass] ?? c.subclass : null;
  const accentColor = CLASS_COLORS[c.class] ?? "#c9a84c";
  const hp = c.currentHp ?? maxHp(c.class, c.level, c.constitution);
  const maxHpVal = maxHp(c.class, c.level, c.constitution);
  const hpPct = Math.min(100, Math.round((hp / maxHpVal) * 100));
  const ac = 10 + Math.floor((c.dexterity - 10) / 2);
  const initiative = Math.floor((c.dexterity - 10) / 2);

  return (
    <div
      data-testid="character-card"
      style={{
        background: "#1a1825",
        border: "1px solid #2e2b3d",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accentColor + "66";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2e2b3d";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

      <div style={{ padding: "20px 20px 16px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
              border: `2px solid ${accentColor}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 16,
              fontWeight: 700,
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {initials(c.name)}
          </div>

          {/* Name + class */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#f0ece4",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {c.name}
            </div>
            <div style={{ fontSize: 12, color: "#8b8699", marginTop: 2 }}>
              {raceLabel} · {clsLabel}
              {subclassLabel && <span style={{ color: accentColor }}> · {subclassLabel}</span>}
            </div>
          </div>

          {/* Level badge */}
          <div
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}44`,
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 700,
              color: accentColor,
              flexShrink: 0,
            }}
          >
            POZ. {c.level}
          </div>
        </div>

        {/* HP bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#8b8699", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Punkty Życia
            </span>
            <span style={{ fontSize: 11, color: hpColor(hp, maxHpVal), fontWeight: 600 }}>
              {hp} / {maxHpVal}
            </span>
          </div>
          <div style={{ height: 5, background: "#0f0e17", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${hpPct}%`,
                background: hpColor(hp, maxHpVal),
                borderRadius: 3,
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {[
            { label: "KP", value: ac },
            { label: "Init.", value: initiative >= 0 ? `+${initiative}` : initiative },
            { label: "Prędkość", value: "9m" },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "#0f0e17",
                borderRadius: 6,
                padding: "6px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0ece4" }}>{value}</div>
              <div style={{ fontSize: 10, color: "#4a4759", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {clsLabel.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              background: "#232136",
              color: "#8b8699",
              border: "1px solid #2e2b3d",
            }}
          >
            {raceLabel.toUpperCase()}
          </span>
          {c.alignment && (
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#232136",
                color: "#8b8699",
                border: "1px solid #2e2b3d",
              }}
            >
              {ALIGNMENT_LABELS[c.alignment] ?? c.alignment}
            </span>
          )}
          {!c.isComplete && (
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(224,82,82,0.1)",
                color: "#e05252",
                border: "1px solid rgba(224,82,82,0.2)",
              }}
            >
              SZKIC
            </span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div
        style={{
          borderTop: "1px solid #2e2b3d",
          padding: "12px 20px",
          display: "flex",
          gap: 8,
          position: "relative",
        }}
      >
        <Link
          href={`/karta/${c.id}`}
          style={{
            flex: 1,
            display: "block",
            textAlign: "center",
            padding: "8px",
            borderRadius: 6,
            background: accentColor,
            color: "#0f0e17",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {c.isComplete ? "Graj →" : "Dokończ →"}
        </Link>

        {/* Menu "···" */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            data-testid="menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: "#232136",
              border: "1px solid #2e2b3d",
              color: "#8b8699",
              cursor: "pointer",
              fontSize: 16,
            }}
            title="Opcje"
          >
            ···
          </button>

          {menuOpen && (
            <div
              data-testid="menu-dropdown"
              style={{
                position: "absolute",
                bottom: "calc(100% + 4px)",
                right: 0,
                background: "#232136",
                border: "1px solid #2e2b3d",
                borderRadius: 8,
                padding: "4px",
                minWidth: 160,
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                zIndex: 10,
              }}
            >
              <button
                data-testid="delete-btn"
                onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: "#e05252",
                  fontSize: 13,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                🗑 Usuń postać
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialog potwierdzenia usunięcia */}
      {confirmDelete && (
        <div
          data-testid="confirm-dialog"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}
        >
          <div
            style={{
              background: "#232136",
              border: "1px solid #2e2b3d",
              borderRadius: 12,
              padding: 32,
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}
          >
            <h3
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: 18,
                color: "#f0ece4",
                margin: "0 0 8px",
              }}
            >
              Usuń postać
            </h3>
            <p style={{ color: "#8b8699", fontSize: 14, margin: "0 0 24px" }}>
              Czy na pewno chcesz usunąć <strong style={{ color: "#f0ece4" }}>{c.name}</strong>?
              Tej operacji nie można cofnąć.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                data-testid="cancel-delete"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                style={{
                  padding: "8px 20px",
                  borderRadius: 6,
                  background: "transparent",
                  border: "1px solid #2e2b3d",
                  color: "#8b8699",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Anuluj
              </button>
              <button
                data-testid="confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "8px 20px",
                  borderRadius: 6,
                  background: deleting ? "#4a4759" : "#e05252",
                  border: "none",
                  color: "#fff",
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {deleting ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
