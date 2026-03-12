import { RegisterForm } from "@/domains/auth/components";

export default function RejestracjaPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#0F0E17" }}>

      {/* Lewa strona — dekoracyjna (identyczna jak logowanie) */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: "50%",
          background: "radial-gradient(80% 60% at 30% 40%, rgba(124, 92, 191, 0.18) 0%, rgba(0,0,0,0) 65%), radial-gradient(60% 80% at 70% 80%, rgba(201, 168, 76, 0.07) 0%, rgba(0,0,0,0) 60%), linear-gradient(160deg, #12101E 8%, #0F0E17 42%, #0C0B14 92%)",
          borderRight: "1px solid #2E2B3D",
        }}
      >
        <div className="flex flex-col items-center" style={{ width: 520 }}>

          <div style={{ filter: "drop-shadow(0px 0px 64px rgba(201, 168, 76, 0.4))", fontSize: 160, lineHeight: 1, color: "#C9A84C", textAlign: "center" }}>
            ⚔
          </div>

          <h1 style={{
            fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: 36,
            lineHeight: "40px", letterSpacing: "1.44px",
            color: "#F0ECE4", textAlign: "center", marginTop: 24,
          }}>
            Kroniki Przygód
          </h1>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: "26px", color: "#8B8699", textAlign: "center", marginTop: 16 }}>
            Twój cyfrowy towarzysz<br />w świecie D&amp;D 5e
          </p>

          <div className="flex items-center" style={{ width: 400, gap: 16, marginTop: 32, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(201, 168, 76, 0.5) 50%, rgba(0,0,0,0) 100%)" }} />
            <span style={{ color: "#C9A84C", fontSize: 16, opacity: 0.7 }}>◆</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(201, 168, 76, 0.5) 50%, rgba(0,0,0,0) 100%)" }} />
          </div>

          <div className="flex flex-col" style={{ gap: 20, width: 380 }}>
            {[
              "Kreator postaci krok po kroku",
              "Karta postaci zawsze pod ręką",
              "Zgodny z D&D 5e Basic Rules",
            ].map((text) => (
              <div key={text} className="flex items-center" style={{ gap: 16 }}>
                <div className="flex items-center justify-center" style={{
                  width: 40, height: 40, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(201, 168, 76, 0.04) 100%)",
                  border: "1px solid rgba(201, 168, 76, 0.2)", borderRadius: 10,
                }}>
                  <span style={{ color: "#C9A84C", fontSize: 16 }}>✦</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 16, color: "#F0ECE4" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute flex items-center" style={{ bottom: 67, gap: 12, opacity: 0.35 }}>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, #C9A84C 100%)" }} />
          <span style={{ color: "#C9A84C", fontSize: 16, letterSpacing: "2.8px" }}>✦ ✦ ✦</span>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, #C9A84C 0%, rgba(0,0,0,0) 100%)" }} />
        </div>
      </div>

      {/* Prawa strona — formularz */}
      <div
        className="flex items-center justify-center overflow-y-auto"
        style={{ width: "50%", background: "#1A1825" }}
      >
        <div style={{ width: 440, paddingTop: 48, paddingBottom: 48 }}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
