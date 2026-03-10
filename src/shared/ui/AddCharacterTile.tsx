"use client";

import Link from "next/link";

export function AddCharacterTile() {
  return (
    <Link
      href="/kreator"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: 200,
        background: "transparent",
        border: "2px dashed #2e2b3d",
        borderRadius: 12,
        color: "#4a4759",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c9a84c44";
        e.currentTarget.style.color = "#c9a84c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2e2b3d";
        e.currentTarget.style.color = "#4a4759";
      }}
    >
      <span style={{ fontSize: 32 }}>+</span>
      <span style={{ fontSize: 13 }}>Nowa Postać</span>
    </Link>
  );
}
