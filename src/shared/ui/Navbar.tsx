import { auth, signOut } from "@/shared/lib/auth";

export default async function Navbar() {
  const session = await auth();
  const name = session?.user?.name ?? "Przygodnik";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
            fontSize: 16,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#555555",
          }}
        >
          Dungeons &amp; Dragons · 5e
        </span>
      </div>

      {/* User area */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0a0a0a",
              letterSpacing: "0.5px",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 16,
              fontWeight: 300,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#999999",
            }}
          >
            Gracz
          </div>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            border: "1.5px solid #0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-ui), Helvetica, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#0a0a0a",
            background: "#ffffff",
          }}
        >
          {initials}
        </div>

        {/* Wyloguj */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/logowanie" });
          }}
        >
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "1.5px solid #0a0a0a",
              color: "#0a0a0a",
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            Wyloguj
          </button>
        </form>
      </div>
    </header>
  );
}
