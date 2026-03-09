import { auth } from "@/shared/lib/auth";
import { getCharacters } from "@/domains/character/actions/getCharacters";
import CharacterCard from "@/domains/character/components/CharacterCard";
import Link from "next/link";

export default async function DashboardPage() {
  const [session, characters] = await Promise.all([auth(), getCharacters()]);
  const name = session?.user?.name ?? "Przygodnik";
  const complete = characters.filter((c) => c.isComplete);
  const drafts = characters.filter((c) => !c.isComplete);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>

      {/* ── Nagłówek ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
            Witaj z powrotem
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#f0ece4",
              margin: 0,
            }}
          >
            {name}
          </h1>
          <p style={{ color: "#8b8699", fontSize: 14, marginTop: 4 }}>
            {complete.length === 0
              ? "Nie masz jeszcze żadnych postaci. Stwórz pierwszą!"
              : `${complete.length} ${complete.length === 1 ? "postać" : complete.length < 5 ? "postacie" : "postaci"} gotowych do gry`}
          </p>
        </div>

        <Link
          href="/kreator"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            borderRadius: 8,
            color: "#0f0e17",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          + Nowa Postać
        </Link>
      </div>

      {/* ── Ukończone postacie ────────────────────────────────────────── */}
      {complete.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 16, color: "#f0ece4", margin: 0 }}>
              Moje Postacie
            </h2>
            <span
              style={{
                background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 10,
                padding: "1px 8px",
                fontSize: 11,
                color: "#c9a84c",
                fontWeight: 600,
              }}
            >
              {complete.length}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {complete.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}

            {/* Kafelek "Dodaj postać" */}
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
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c9a84c44";
                (e.currentTarget as HTMLAnchorElement).style.color = "#c9a84c";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2e2b3d";
                (e.currentTarget as HTMLAnchorElement).style.color = "#4a4759";
              }}
            >
              <span style={{ fontSize: 32 }}>+</span>
              <span style={{ fontSize: 13 }}>Nowa Postać</span>
            </Link>
          </div>
        </section>
      )}

      {/* ── Szkice (niedokończone) ────────────────────────────────────── */}
      {drafts.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 16, color: "#f0ece4", margin: 0 }}>
              Niedokończone
            </h2>
            <span
              style={{
                background: "rgba(224,82,82,0.1)",
                border: "1px solid rgba(224,82,82,0.2)",
                borderRadius: 10,
                padding: "1px 8px",
                fontSize: 11,
                color: "#e05252",
                fontWeight: 600,
              }}
            >
              {drafts.length}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {drafts.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        </section>
      )}

      {/* ── Stan pusty ────────────────────────────────────────────────── */}
      {characters.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 40px",
            background: "#1a1825",
            border: "1px solid #2e2b3d",
            borderRadius: 16,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚔</div>
          <h3
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 20,
              color: "#f0ece4",
              marginBottom: 8,
            }}
          >
            Twoja Drużyna Jest Pusta
          </h3>
          <p style={{ color: "#8b8699", marginBottom: 24 }}>
            Stwórz swoją pierwszą postać i wyrusz na przygodę.
          </p>
          <Link
            href="/kreator"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
              borderRadius: 8,
              color: "#0f0e17",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Stwórz Pierwszą Postać →
          </Link>
        </div>
      )}

      {/* ── Szybkie Akcje ─────────────────────────────────────────────── */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 16,
            color: "#f0ece4",
            marginBottom: 16,
          }}
        >
          Szybkie Akcje
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {[
            {
              icon: "⚔",
              title: "Kontynuuj Sesję",
              desc: complete.length > 0 ? `Ostatnia: ${complete[0]?.name}` : "Brak aktywnych postaci",
              href: complete.length > 0 ? `/karta/${complete[0]?.id}` : "/kreator",
              color: "#c9a84c",
            },
            {
              icon: "+",
              title: "Nowa Postać",
              desc: "Kreator krok po kroku",
              href: "/kreator",
              color: "#52c97a",
            },
            {
              icon: "📖",
              title: "Podręcznik Zasad",
              desc: "SRD 5.2.1 po polsku",
              href: "/zasady",
              color: "#5c9be8",
            },
            {
              icon: "🎲",
              title: "Rzutnik Kości",
              desc: "k4, k6, k8, k10, k12, k20",
              href: "/rzutnik",
              color: "#7c5cbf",
            },
          ].map(({ icon, title, desc, href, color }) => (
            <Link
              key={title}
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
                (e.currentTarget as HTMLAnchorElement).style.borderColor = color + "44";
                (e.currentTarget as HTMLAnchorElement).style.background = "#232136";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2e2b3d";
                (e.currentTarget as HTMLAnchorElement).style.background = "#1a1825";
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
          ))}
        </div>
      </section>
    </div>
  );
}
