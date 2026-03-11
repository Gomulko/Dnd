"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Moje Postacie" },
  { href: "/kreator", label: "Stwórz Postać" },
  { href: "/zasady", label: "Podręcznik Zasad" },
  { href: "/rzutnik", label: "Rzutnik Kości" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minHeight: "calc(100vh - 56px)",
        background: "#ffffff",
        borderRight: "1.5px solid #0a0a0a",
        display: "flex",
        flexDirection: "column",
        padding: "28px 0",
        flexShrink: 0,
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        {NAV_ITEMS.map(({ href, label }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                padding: "10px 24px",
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 11,
                fontWeight: active ? 900 : 400,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: active ? "#0a0a0a" : "#555555",
                textDecoration: "none",
                borderLeft: active ? "3px solid #0a0a0a" : "3px solid transparent",
                background: "transparent",
                transition: "color 0.1s, border-color 0.1s",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Wersja */}
      <div
        style={{
          borderTop: "1px solid #cccccc",
          paddingTop: 14,
          paddingInline: 24,
          fontFamily: "var(--font-ui), Helvetica, sans-serif",
          fontSize: 7,
          fontWeight: 300,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#999999",
        }}
      >
        D&amp;D 5e SRD 5.2.1
        <br />
        v0.1
      </div>
    </aside>
  );
}
