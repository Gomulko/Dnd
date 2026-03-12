"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../actions";

const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const WHITE = "#ffffff";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Słabe", color: "#a02020" };
  if (score === 2) return { level: 2, label: "Średnie", color: MID };
  if (score === 3) return { level: 3, label: "Dobre", color: "#1a7a3a" };
  return { level: 4, label: "Silne", color: BLACK };
}

const BAR_COLORS: Record<number, string[]> = {
  0: [LIGHT, LIGHT, LIGHT, LIGHT],
  1: ["#a02020", LIGHT, LIGHT, LIGHT],
  2: [MID, MID, LIGHT, LIGHT],
  3: ["#1a7a3a", "#1a7a3a", "#1a7a3a", LIGHT],
  4: [BLACK, BLACK, BLACK, BLACK],
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(true);

  const strength = getPasswordStrength(password);
  const bars = BAR_COLORS[strength.level];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accepted) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/logowanie?registered=true");
  }

  const inputStyle: React.CSSProperties = {
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
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT_UI,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: MID,
    marginBottom: 8,
  };

  return (
    <div style={{ background: WHITE, border: `1.5px solid ${BLACK}`, padding: "40px 40px" }}>

      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 12 }}>
          Rejestracja
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontStyle: "italic", color: BLACK, lineHeight: 1.1 }}>
          Utwórz konto
        </div>
        <div style={{ width: 40, height: 1.5, background: BLACK, marginTop: 14 }} />
      </div>

      <form onSubmit={handleSubmit}>

        {/* Nazwa użytkownika */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Nazwa użytkownika</label>
          <input
            name="username"
            type="text"
            required
            placeholder="Kelindra_Moonwhisper"
            style={inputStyle}
          />
        </div>

        {/* Hasło */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Hasło</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          {password && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                {bars.map((color, i) => (
                  <div key={i} style={{ flex: 1, height: 2, background: color }} />
                ))}
              </div>
              <span style={{ fontFamily: FONT_UI, fontSize: 11, color: strength.color, textTransform: "uppercase", letterSpacing: "1px" }}>
                Hasło: {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Powtórz hasło */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Powtórz hasło</label>
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        {/* Regulamin */}
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24, cursor: "pointer" }}
          onClick={() => setAccepted(!accepted)}
        >
          <div style={{
            width: 18, height: 18, flexShrink: 0, marginTop: 1,
            border: `1.5px solid ${BLACK}`,
            background: accepted ? BLACK : WHITE,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {accepted && <span style={{ color: WHITE, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
          </div>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, lineHeight: "20px", color: MID, margin: 0 }}>
            Akceptuję{" "}
            <Link href="/regulamin" style={{ color: BLACK, textDecoration: "underline" }} onClick={(e) => e.stopPropagation()}>
              regulamin
            </Link>
            {" "}i{" "}
            <Link href="/prywatnosc" style={{ color: BLACK, textDecoration: "underline" }} onClick={(e) => e.stopPropagation()}>
              politykę prywatności
            </Link>
          </p>
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
          {loading ? "Tworzenie konta..." : "Rozpocznij przygodę"}
        </button>
      </form>

      {/* Link do logowania */}
      <div style={{ borderTop: `1px solid ${LIGHT}`, paddingTop: 20 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: MID, margin: 0 }}>
          Masz już konto?{" "}
          <Link href="/logowanie" style={{ color: BLACK, fontWeight: 700, textDecoration: "underline" }}>
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}
