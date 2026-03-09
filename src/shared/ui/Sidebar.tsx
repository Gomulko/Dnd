"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "⚔", label: "Moje Postacie" },
  { href: "/kreator", icon: "+", label: "Stwórz Postać", accent: true },
  { href: "/zasady", icon: "📖", label: "Podręcznik Zasad" },
  { href: "/rzutnik", icon: "🎲", label: "Rzutnik Kości" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minHeight: "calc(100vh - 64px)",
        background: "#1a1825",
        borderRight: "1px solid #2e2b3d",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        flexShrink: 0,
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ href, icon, label, accent }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "#c9a84c" : accent ? "#c9a84c" : "#8b8699",
                background: active ? "rgba(201,168,76,0.08)" : "transparent",
                border: active ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: icon === "+" ? 18 : 16, lineHeight: 1 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Wersja */}
      <div
        style={{
          borderTop: "1px solid #2e2b3d",
          paddingTop: 16,
          fontSize: 11,
          color: "#4a4759",
          textAlign: "center",
        }}
      >
        Kroniki Przygód v0.1
        <br />
        D&amp;D 5e SRD 5.2.1
      </div>
    </aside>
  );
}
