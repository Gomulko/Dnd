import { auth } from "@/shared/lib/auth";
import { getCharacters } from "@/domains/character/actions/getCharacters";
import CharacterCard from "@/domains/character/components/CharacterCard";
import Link from "next/link";
import { AddCharacterTile } from "@/shared/ui/AddCharacterTile";
import { QuickActionLink } from "@/shared/ui/QuickActionLink";

export default async function DashboardPage() {
  const [session, characters] = await Promise.all([auth(), getCharacters()]);
  const name = session?.user?.name ?? "Przygodnik";
  const complete = characters.filter((c) => c.isComplete);
  const drafts = characters.filter((c) => !c.isComplete);

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200 }}>

      {/* ── Nagłówek ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, borderBottom: "1.5px solid #0a0a0a", paddingBottom: 20 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 8,
              fontWeight: 300,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#555555",
              marginBottom: 6,
            }}
          >
            Witaj z powrotem
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: 36,
              fontWeight: 400,
              color: "#0a0a0a",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 11,
              color: "#555555",
              marginTop: 6,
            }}
          >
            {complete.length === 0
              ? "Nie masz jeszcze żadnych postaci. Stwórz pierwszą!"
              : `${complete.length} ${complete.length === 1 ? "postać" : complete.length < 5 ? "postacie" : "postaci"} gotowych do gry`}
          </p>
        </div>

        <Link
          href="/kreator"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#0a0a0a",
            border: "1.5px solid #0a0a0a",
            color: "#ffffff",
            fontFamily: "var(--font-ui), Helvetica, sans-serif",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          + Nowa Postać
        </Link>
      </div>

      {/* ── Ukończone postacie ────────────────────────────────────────── */}
      {complete.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#0a0a0a",
                margin: 0,
                paddingBottom: 5,
                borderBottom: "1.5px solid #0a0a0a",
              }}
            >
              Moje Postacie
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {complete.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
            <AddCharacterTile />
          </div>
        </section>
      )}

      {/* ── Szkice (niedokończone) ────────────────────────────────────── */}
      {drafts.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-ui), Helvetica, sans-serif",
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#0a0a0a",
                margin: 0,
                paddingBottom: 5,
                borderBottom: "1.5px solid #0a0a0a",
              }}
            >
              Niedokończone
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
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
            background: "#ffffff",
            border: "1.5px solid #0a0a0a",
            marginBottom: 40,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: 24,
              fontWeight: 400,
              color: "#0a0a0a",
              marginBottom: 8,
            }}
          >
            Twoja Drużyna Jest Pusta
          </h3>
          <p
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 11,
              color: "#555555",
              marginBottom: 24,
            }}
          >
            Stwórz swoją pierwszą postać i wyrusz na przygodę.
          </p>
          <Link
            href="/kreator"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "#0a0a0a",
              border: "1.5px solid #0a0a0a",
              color: "#ffffff",
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Stwórz Pierwszą Postać
          </Link>
        </div>
      )}

      {/* ── Szybkie Akcje ─────────────────────────────────────────────── */}
      <section>
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: "var(--font-ui), Helvetica, sans-serif",
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#0a0a0a",
              margin: 0,
              paddingBottom: 5,
              borderBottom: "1.5px solid #0a0a0a",
            }}
          >
            Szybkie Akcje
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {[
            {
              title: "Kontynuuj Sesję",
              desc: complete.length > 0 ? `Ostatnia: ${complete[0]?.name}` : "Brak aktywnych postaci",
              href: complete.length > 0 ? `/karta/${complete[0]?.id}` : "/kreator",
            },
            {
              title: "Nowa Postać",
              desc: "Kreator krok po kroku",
              href: "/kreator",
            },
            {
              title: "Podręcznik Zasad",
              desc: "SRD 5.2.1",
              href: "/zasady",
            },
            {
              title: "Rzutnik Kości",
              desc: "k4, k6, k8, k10, k12, k20",
              href: "/rzutnik",
            },
          ].map(({ title, desc, href }) => (
            <QuickActionLink key={title} title={title} desc={desc} href={href} />
          ))}
        </div>
      </section>
    </div>
  );
}
