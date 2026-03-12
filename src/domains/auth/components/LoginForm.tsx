"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Nieprawidłowa nazwa użytkownika lub hasło");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 40px" }}>

      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 12 }}>
          Logowanie
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontStyle: "italic", color: BLACK, lineHeight: 1.1 }}>
          Powrót do przygody
        </div>
        <div style={{ width: 40, height: 1.5, background: BLACK, marginTop: 14 }} />
      </div>

      <form onSubmit={handleSubmit}>

        {/* Nazwa użytkownika */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontFamily: FONT_UI,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: MID,
            marginBottom: 8,
          }}>
            Nazwa użytkownika
          </label>
          <input
            name="username"
            type="text"
            required
            placeholder="Kelindra_Moonwhisper"
            style={{
              width: "100%",
              height: 44,
              background: WHITE,
              border: `1.5px solid ${BLACK}`,
              borderRadius: 0,
              padding: "0 14px",
              fontFamily: FONT_UI,
              fontSize: 15,
              color: BLACK,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Hasło */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: "block",
            fontFamily: FONT_UI,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: MID,
            marginBottom: 8,
          }}>
            Hasło
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            style={{
              width: "100%",
              height: 44,
              background: WHITE,
              border: `1.5px solid ${BLACK}`,
              borderRadius: 0,
              padding: "0 14px",
              fontFamily: FONT_UI,
              fontSize: 15,
              color: BLACK,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div style={{
            fontFamily: FONT_UI,
            fontSize: 13,
            color: "#a02020",
            marginBottom: 16,
            padding: "10px 14px",
            border: "1px solid #a02020",
          }}>
            {error}
          </div>
        )}

        {/* Przycisk */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 46,
            background: loading ? MID : BLACK,
            border: "none",
            fontFamily: FONT_UI,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: WHITE,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 24,
          }}
        >
          {loading ? "Logowanie..." : "Wkrocz do świata"}
        </button>
      </form>

      {/* Separator */}
      <div style={{ borderTop: `1px solid ${LIGHT}`, paddingTop: 20 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: MID, margin: 0 }}>
          Nie masz konta?{" "}
          <Link href="/rejestracja" style={{ color: BLACK, fontWeight: 700, textDecoration: "underline" }}>
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
