"use client";

import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  href: string;
};

export function QuickActionLink({ title, desc, href }: Props) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "16px 18px",
        background: "#ffffff",
        border: "1.5px solid #0a0a0a",
        textDecoration: "none",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#0a0a0a";
        const titleEl = e.currentTarget.querySelector(".qa-title") as HTMLElement | null;
        const descEl = e.currentTarget.querySelector(".qa-desc") as HTMLElement | null;
        if (titleEl) titleEl.style.color = "#ffffff";
        if (descEl) descEl.style.color = "#cccccc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        const titleEl = e.currentTarget.querySelector(".qa-title") as HTMLElement | null;
        const descEl = e.currentTarget.querySelector(".qa-desc") as HTMLElement | null;
        if (titleEl) titleEl.style.color = "#0a0a0a";
        if (descEl) descEl.style.color = "#555555";
      }}
    >
      <div
        className="qa-title"
        style={{
          fontFamily: "var(--font-ui), Helvetica, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#0a0a0a",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        className="qa-desc"
        style={{
          fontFamily: "var(--font-ui), Helvetica, sans-serif",
          fontSize: 16,
          fontWeight: 300,
          color: "#555555",
        }}
      >
        {desc}
      </div>
    </Link>
  );
}
