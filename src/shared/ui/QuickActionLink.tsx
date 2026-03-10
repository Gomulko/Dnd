"use client";

import Link from "next/link";

type Props = {
  icon: string;
  title: string;
  desc: string;
  href: string;
  color: string;
};

export function QuickActionLink({ icon, title, desc, href, color }: Props) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        background: "#1a1825",
        border: "1px solid #2e2b3d",
        borderRadius: 10,
        textDecoration: "none",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color + "44";
        e.currentTarget.style.background = "#232136";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2e2b3d";
        e.currentTarget.style.background = "#1a1825";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ece4" }}>{title}</div>
        <div style={{ fontSize: 11, color: "#8b8699", marginTop: 2 }}>{desc}</div>
      </div>
    </Link>
  );
}
