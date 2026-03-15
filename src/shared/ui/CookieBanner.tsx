"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookiesAccepted";

const BLACK = "#0a0a0a";
const WHITE = "#ffffff";
const MID = "#555555";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Informacja o plikach cookie"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: BLACK,
        color: WHITE,
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        zIndex: 10000,
        borderTop: `2px solid ${WHITE}`,
        flexWrap: "wrap",
      }}
    >
      <p style={{
        fontFamily: FONT_UI,
        fontSize: 13,
        color: "#cccccc",
        margin: 0,
        lineHeight: 1.6,
        flex: 1,
        minWidth: 260,
      }}>
        Serwis używa ciasteczka sesyjnego (logowanie) oraz plików cookie Google reCAPTCHA
        (ochrona przed botami).{" "}
        <Link
          href="/polityka-prywatnosci"
          style={{ color: WHITE, textDecoration: "underline" }}
        >
          Polityka prywatności
        </Link>
      </p>

      <button
        type="button"
        onClick={accept}
        style={{
          background: WHITE,
          color: BLACK,
          border: "none",
          padding: "10px 24px",
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "2px",
          textTransform: "uppercase",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Rozumiem
      </button>
    </div>
  );
}
