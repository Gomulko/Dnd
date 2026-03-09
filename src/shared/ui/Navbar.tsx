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
        height: 64,
        background: "#1a1825",
        borderBottom: "1px solid #2e2b3d",
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
      <span
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 18,
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ color: "#c9a84c" }}>⚔</span>{" "}
        <span style={{ color: "#f0ece4" }}>Kroniki Przygód</span>
      </span>

      {/* User area */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#f0ece4", fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 11, color: "#8b8699" }}>PRO ACCOUNT</div>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c, #7c5cbf)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#0f0e17",
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
              border: "1px solid #2e2b3d",
              borderRadius: 6,
              color: "#8b8699",
              fontSize: 13,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            Wyloguj
          </button>
        </form>
      </div>
    </header>
  );
}
