"use client";

import Link from "next/link";

export function AddCharacterTile({ id }: { id?: string }) {
  return (
    <Link
      id={id}
      href="/kreator"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 180,
        background: "transparent",
        border: "1.5px dashed #999999",
        color: "#999999",
        textDecoration: "none",
        transition: "border-color 0.15s, color 0.15s",
        fontFamily: "var(--font-ui), Helvetica, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#0a0a0a";
        e.currentTarget.style.color = "#0a0a0a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#999999";
        e.currentTarget.style.color = "#999999";
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>+</span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
        }}
      >
        Nowa Postać
      </span>
    </Link>
  );
}
