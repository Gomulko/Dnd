import { Suspense } from "react";
import { LoginForm } from "@/domains/auth/components";
import { RecaptchaProvider } from "@/shared/ui/RecaptchaProvider";

const BLACK = "#0a0a0a";
const WHITE = "#ffffff";
const MID = "#555555";
const PAGE = "#d8d8d8";
const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

const FEATURES = [
  "Kreator postaci krok po kroku",
  "Karta postaci zawsze pod ręką",
  "Zgodny z D&D 5e Basic Rules",
];

export default function LogowaniePage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>

      {/* Lewa strona — czarna, dekoracyjna */}
      <div
        className="auth-left"
        style={{
          width: "50%",
          background: BLACK,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "3px" }}>
          Kroniki Przygód
        </div>

        {/* Środek */}
        <div>
          <div
            className="auth-left-heading"
            style={{ fontFamily: FONT_DISPLAY, fontSize: 80, fontStyle: "italic", color: WHITE, lineHeight: 1, marginBottom: 32 }}
          >
            Witaj<br />z powrotem.
          </div>
          <div style={{ width: 60, height: 1.5, background: WHITE, marginBottom: 32 }} />
          <p style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: "26px", maxWidth: 320 }}>
            Twój cyfrowy towarzysz<br />w świecie D&amp;D 5e
          </p>

          {/* Feature lista */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 20 }}>
            {FEATURES.map((text) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 6, height: 6, background: WHITE, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT_UI, fontSize: 14, color: WHITE }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dół */}
        <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, letterSpacing: "1px" }}>
          D&amp;D 5e Basic Rules — SRD 5.2.1
        </div>
      </div>

      {/* Prawa strona — formularz */}
      <div
        className="auth-right"
        style={{
          width: "50%",
          background: PAGE,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "48px 24px",
        }}
      >
        {/* Logo widoczne tylko na mobile (lewa strona ukryta) */}
        <div
          className="auth-mobile-logo"
          style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 32, display: "none" }}
        >
          Kroniki Przygód
        </div>

        <div className="auth-form-wrap">
          <RecaptchaProvider>
            <Suspense>
              <LoginForm />
            </Suspense>
          </RecaptchaProvider>
        </div>
      </div>
    </div>
  );
}
