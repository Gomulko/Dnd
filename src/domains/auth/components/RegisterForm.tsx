"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../actions";

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Siła hasła: Słabe", color: "#E05252" };
  if (score === 2) return { level: 2, label: "Siła hasła: Średnia", color: "#E8B84C" };
  if (score === 3) return { level: 3, label: "Siła hasła: Dobre", color: "#52C97A" };
  return { level: 4, label: "Siła hasła: Silne", color: "#52C97A" };
}

const BAR_COLORS: Record<number, string[]> = {
  0: ["#232136", "#232136", "#232136", "#232136"],
  1: ["#E05252", "#232136", "#232136", "#232136"],
  2: ["#E05252", "#E05252", "#E8B84C", "#232136"],
  3: ["#52C97A", "#52C97A", "#52C97A", "#232136"],
  4: ["#52C97A", "#52C97A", "#52C97A", "#52C97A"],
};

const inputStyle = (active = false): React.CSSProperties => ({
  width: "100%",
  height: 45,
  background: "#0F0E17",
  border: active ? "1px solid #C9A84C" : "1px solid #2E2B3D",
  boxShadow: active ? "0px 0px 0px 3px rgba(201, 168, 76, 0.1)" : "none",
  borderRadius: 8,
  padding: "13px 14px 13px 42px",
  fontFamily: "Inter, sans-serif",
  fontSize: 16,
  color: "#F0ECE4",
  outline: "none",
  boxSizing: "border-box" as const,
});

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  fontSize: 16,
  letterSpacing: "0.72px",
  textTransform: "uppercase",
  color: "#8B8699",
  marginBottom: 8,
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 15,
  color: "#4A4759",
  pointerEvents: "none",
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(true);
  const [activeField, setActiveField] = useState<string | null>(null);

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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
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

  return (
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 700,
          fontSize: 28,
          lineHeight: "38px",
          letterSpacing: "0.84px",
          color: "#F0ECE4",
          marginBottom: 10,
        }}>
          Utwórz konto
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#8B8699", marginBottom: 12 }}>
          Dołącz do tysięcy przygodników
        </p>
        <div style={{
          width: 48, height: 2,
          background: "linear-gradient(90deg, #C9A84C 0%, rgba(201, 168, 76, 0.2) 100%)",
          borderRadius: 2,
        }} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Pseudonim */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Pseudonim</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>⚔</span>
            <input
              name="name"
              type="text"
              required
              placeholder="Kelindra_Moonwhisper"
              style={inputStyle(activeField === "name")}
              onFocus={() => setActiveField("name")}
              onBlur={() => setActiveField(null)}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Adres E-mail</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>✉</span>
            <input
              name="email"
              type="email"
              required
              placeholder="kelindra@example.com"
              style={inputStyle(activeField === "email")}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
            />
          </div>
        </div>

        {/* Hasło + pasek siły */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Hasło</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>🔒</span>
            <input
              name="password"
              type="password"
              required
              placeholder="mypassword123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle(activeField === "password")}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
            />
          </div>
          {password && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {bars.map((color, i) => (
                  <div key={i} style={{ flex: 1, height: 3, background: color, borderRadius: 2 }} />
                ))}
              </div>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: strength.color,
              }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Powtórz hasło */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Powtórz Hasło</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>🔒</span>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="mypassword123"
              style={inputStyle(activeField === "confirm")}
              onFocus={() => setActiveField("confirm")}
              onBlur={() => setActiveField(null)}
            />
          </div>
        </div>

        {/* Checkbox regulamin */}
        <div
          className="flex items-start"
          style={{ gap: 12, marginBottom: 24, cursor: "pointer" }}
          onClick={() => setAccepted(!accepted)}
        >
          <div style={{
            width: 18, height: 18, flexShrink: 0, marginTop: 1,
            background: accepted ? "#C9A84C" : "transparent",
            border: `1px solid ${accepted ? "#C9A84C" : "#4A4759"}`,
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {accepted && <span style={{ color: "#1A1408", fontSize: 16, fontWeight: 700 }}>✓</span>}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: "20px", color: "#8B8699" }}>
            Akceptuję{" "}
            <Link href="/regulamin" style={{ color: "#C9A84C", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
              regulamin
            </Link>
            {" "}i{" "}
            <Link href="/prywatnosc" style={{ color: "#C9A84C", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
              politykę prywatności
            </Link>
            {" "}serwisu Kroniki Przygód
          </p>
        </div>

        {error && (
          <p style={{ color: "#E05252", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        {/* Przycisk */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", height: 49,
            background: loading ? "#8B6B2E" : "linear-gradient(135deg, #C9A84C 0%, #B8943C 100%)",
            boxShadow: "0px 4px 20px rgba(201, 168, 76, 0.25)",
            borderRadius: 8, border: "none",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700, fontSize: 15,
            letterSpacing: "0.45px",
            color: "#1A1408",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 24,
          }}
        >
          {loading ? "Tworzenie konta..." : "Rozpocznij Przygodę →"}
        </button>
      </form>

      {/* Separator LUB */}
      <div className="flex items-center" style={{ gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#2E2B3D" }} />
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 16,
          letterSpacing: "0.96px", textTransform: "uppercase", color: "#4A4759",
        }}>
          lub
        </span>
        <div style={{ flex: 1, height: 1, background: "#2E2B3D" }} />
      </div>

      {/* Login link */}
      <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 16, color: "#8B8699" }}>
        Masz już konto?{" "}
        <Link href="/logowanie" style={{ color: "#C9A84C", fontWeight: 500, textDecoration: "none" }}>
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
