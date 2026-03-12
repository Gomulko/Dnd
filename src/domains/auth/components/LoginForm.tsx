"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div>
      {/* Nagłówek */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "1.32px",
          textTransform: "uppercase",
          color: "#C9A84C",
          marginBottom: 8,
        }}>
          Powrót do przygody
        </p>
        <h2 style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 700,
          fontSize: 28,
          lineHeight: "34px",
          letterSpacing: "0.84px",
          color: "#F0ECE4",
          marginBottom: 10,
        }}>
          Witaj z powrotem
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          color: "#8B8699",
          marginBottom: 12,
        }}>
          Twoje postacie czekają
        </p>
        {/* Złota linia */}
        <div style={{
          width: 48,
          height: 2,
          background: "linear-gradient(90deg, #C9A84C 0%, rgba(201, 168, 76, 0.2) 100%)",
          borderRadius: 2,
        }} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nazwa użytkownika */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "0.72px",
            textTransform: "uppercase",
            color: "#8B8699",
            marginBottom: 8,
          }}>
            Nazwa użytkownika
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "#4A4759",
              pointerEvents: "none",
            }}>
              ⚔
            </span>
            <input
              name="username"
              type="text"
              required
              placeholder="Kelindra_Moonwhisper"
              style={{
                width: "100%",
                height: 45,
                background: "#0F0E17",
                border: "1px solid rgba(82, 201, 122, 0.4)",
                borderRadius: 8,
                padding: "13px 14px 13px 42px",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                color: "#F0ECE4",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #C9A84C";
                e.target.style.boxShadow = "0px 0px 0px 3px rgba(201, 168, 76, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(82, 201, 122, 0.4)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Hasło */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "0.72px",
            textTransform: "uppercase",
            color: "#8B8699",
            marginBottom: 8,
          }}>
            Hasło
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "#4A4759",
              pointerEvents: "none",
            }}>
              🔒
            </span>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••••••"
              style={{
                width: "100%",
                height: 45,
                background: "#0F0E17",
                border: "1px solid #C9A84C",
                boxShadow: "0px 0px 0px 3px rgba(201, 168, 76, 0.1)",
                borderRadius: 8,
                padding: "13px 14px 13px 42px",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                color: "#F0ECE4",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #C9A84C";
                e.target.style.boxShadow = "0px 0px 0px 3px rgba(201, 168, 76, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #2E2B3D";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Zapamiętaj + Zapomniałem */}
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <label className="flex items-center" style={{ gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 18,
              height: 18,
              background: "#C9A84C",
              border: "1px solid #C9A84C",
              borderRadius: 4,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#8B8699" }}>
              Zapamiętaj mnie
            </span>
          </label>
          <Link href="/reset-hasla" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            color: "#4A4759",
            textDecoration: "none",
          }}>
            Zapomniałem hasła
          </Link>
        </div>

        {error && (
          <p style={{ color: "#E05252", fontSize: 16, marginBottom: 12 }}>{error}</p>
        )}

        {/* Przycisk */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 49,
            background: loading ? "#8B6B2E" : "linear-gradient(135deg, #C9A84C 0%, #B8943C 100%)",
            boxShadow: "0px 4px 20px rgba(201, 168, 76, 0.25)",
            borderRadius: 8,
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.45px",
            color: "#1A1408",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 24,
          }}
        >
          {loading ? "Logowanie..." : "Wkrocz do Świata →"}
        </button>
      </form>

      {/* Separator LUB */}
      <div className="flex items-center" style={{ gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#2E2B3D" }} />
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.96px",
          textTransform: "uppercase",
          color: "#4A4759",
        }}>
          lub
        </span>
        <div style={{ flex: 1, height: 1, background: "#2E2B3D" }} />
      </div>

      {/* Rejestracja link */}
      <p style={{
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontSize: 16,
        color: "#8B8699",
        marginBottom: 16,
      }}>
        Nie masz konta?{" "}
        <Link href="/rejestracja" style={{ color: "#C9A84C", fontWeight: 500, textDecoration: "none" }}>
          Zarejestruj się
        </Link>
      </p>

      {/* Bezpieczeństwo */}
      <div
        className="flex items-center justify-center"
        style={{
          gap: 10,
          height: 47,
          background: "rgba(82, 201, 122, 0.05)",
          border: "1px solid rgba(82, 201, 122, 0.12)",
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 16, opacity: 0.8 }}>🛡</span>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.12px",
          color: "#4A4759",
        }}>
          Twoje dane są bezpieczne i szyfrowane
        </span>
      </div>
    </div>
  );
}
