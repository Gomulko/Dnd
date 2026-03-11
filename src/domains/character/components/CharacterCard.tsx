"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CharacterSummary } from "@/domains/character/actions/getCharacters";
import { deleteCharacter } from "@/domains/character/actions/deleteCharacter";
import { modNum, maxHp as calcMaxHp } from "@/shared/lib/dnd-mechanics";
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

const ALIGNMENT_LABELS: Record<string, string> = {
  LG: "Praworządny Dobry", NG: "Neutralny Dobry", CG: "Chaotyczny Dobry",
  LN: "Praworządny Neutralny", TN: "Prawdziwa Neutralność", CN: "Chaotyczny Neutralny",
  LE: "Praworządny Zły", NE: "Neutralny Zły", CE: "Chaotyczny Zły",
};

function maxHp(cls: string, level: number, conScore: number) {
  const die = CLASSES.find((c) => c.id === cls)?.hitDie ?? 8;
  return calcMaxHp(die, level, modNum(conScore));
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
  const hp = c.currentHp ?? maxHp(c.class, c.level, c.constitution);
  const maxHpVal = maxHp(c.class, c.level, c.constitution);
  const hpPct = Math.max(0, Math.min(100, Math.round((hp / maxHpVal) * 100)));
  const ac = 10 + modNum(c.dexterity);
  const initiativeNum = modNum(c.dexterity);
  const initiative = initiativeNum >= 0 ? `+${initiativeNum}` : `${initiativeNum}`;

  return (
    <div
      data-testid="character-card"
      style={{
        background: "#ffffff",
        border: "1.5px solid #0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #cccccc" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 44,
              height: 44,
              border: "1.5px solid #0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#0a0a0a",
              flexShrink: 0,
            }}
          >
            {initials(c.name)}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                fontWeight: 400,
                color: "#0a0a0a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.1,
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
                marginTop: 4,
              }}
            >
              {raceLabel} · {clsLabel} · Poz. {c.level}
              {c.alignment && ` · ${ALIGNMENT_LABELS[c.alignment] ?? c.alignment}`}
            </div>
          </div>

          {/* Draft badge */}
          {!c.isComplete && (
            <span
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#0a0a0a",
                border: "1px solid #0a0a0a",
                padding: "2px 6px",
                flexShrink: 0,
              }}
            >
              Szkic
            </span>
          )}
        </div>

        {/* HP bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              Punkty Życia
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 9,
                fontWeight: 600,
                color: "#0a0a0a",
              }}
            >
              {hp} / {maxHpVal}
            </span>
          </div>
          {/* HP track: thin line with black fill */}
          <div style={{ height: 4, background: "#d8d8d8", border: "1px solid #0a0a0a", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${hpPct}%`,
                background: "#0a0a0a",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: "1px solid #cccccc",
        }}
      >
        {[
          { label: "KP", value: `${ac}`, ariaLabel: "Klasa Pancerza" },
          { label: "Init.", value: initiative, ariaLabel: "Inicjatywa" },
          { label: "Prędkość", value: "9m", ariaLabel: "Prędkość" },
        ].map(({ label, value, ariaLabel }, i) => (
          <div
            key={label}
            aria-label={ariaLabel}
            style={{
              textAlign: "center",
              padding: "10px 8px",
              borderRight: i < 2 ? "1px solid #cccccc" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: 20,
                fontWeight: 400,
                color: "#0a0a0a",
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
                marginTop: 3,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div
        style={{
          padding: "12px 16px",
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
            padding: "9px",
            background: "#0a0a0a",
            color: "#ffffff",
            fontFamily: "var(--font-ui), Helvetica, sans-serif",
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {c.isComplete ? "Otwórz kartę" : "Dokończ"}
        </Link>

        {/* Menu "···" */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            data-testid="menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 34,
              height: 34,
              background: "transparent",
              border: "1.5px solid #0a0a0a",
              color: "#0a0a0a",
              cursor: "pointer",
              fontSize: 14,
              letterSpacing: "2px",
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
                background: "#ffffff",
                border: "1.5px solid #0a0a0a",
                padding: "4px",
                minWidth: 160,
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
                  color: "#0a0a0a",
                  fontFamily: "var(--font-ui), Helvetica, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Usuń postać
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
            background: "rgba(10,10,10,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #0a0a0a",
              padding: 32,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: 20,
                fontWeight: 400,
                color: "#0a0a0a",
                margin: "0 0 8px",
              }}
            >
              Usuń postać
            </h3>
            <p
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 12,
                color: "#555555",
                margin: "0 0 24px",
              }}
            >
              Czy na pewno chcesz usunąć <strong style={{ color: "#0a0a0a" }}>{c.name}</strong>?
              Tej operacji nie można cofnąć.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                data-testid="cancel-delete"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                style={{
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1.5px solid #555555",
                  color: "#555555",
                  fontFamily: "var(--font-ui), Helvetica, sans-serif",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
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
                  background: deleting ? "#999999" : "#0a0a0a",
                  border: "1.5px solid #0a0a0a",
                  color: "#ffffff",
                  fontFamily: "var(--font-ui), Helvetica, sans-serif",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: deleting ? "not-allowed" : "pointer",
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
