import Link from "next/link";

export default function GuestNavbar() {
  return (
    <header
      style={{
        height: 56,
        background: "#ffffff",
        borderBottom: "1.5px solid #0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 32,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: 20,
            fontWeight: 400,
            color: "#0a0a0a",
            letterSpacing: "0.01em",
          }}
        >
          Kroniki Przygód
        </span>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-ui), Helvetica, sans-serif",
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#555555",
          }}
        >
          Dungeons &amp; Dragons · 5e
        </span>
      </div>

      {/* Zaloguj się */}
      <Link
        href="/logowanie"
        style={{
          fontFamily: "var(--font-ui), Helvetica, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#0a0a0a",
          textDecoration: "none",
          border: "1.5px solid #0a0a0a",
          padding: "6px 14px",
        }}
      >
        Zaloguj się
      </Link>
    </header>
  );
}
