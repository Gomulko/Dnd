import DiceRoller from "@/domains/dice/components/DiceRoller";

const FONT_DISPLAY = "var(--font-display), 'DM Serif Display', Georgia, serif";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";
const BLACK = "#0a0a0a";
const MID = "#555555";

export default function RzutnikPage() {
  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 10, color: MID, textTransform: "uppercase", letterSpacing: "4px", marginBottom: 10 }}>
          Narzędzia
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: 0 }}>
          Rzutnik Kości
        </h1>
        <div style={{ height: 1.5, background: BLACK, width: 60, marginTop: 12, marginBottom: 10 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: MID, margin: 0 }}>
          Rzucaj kośćmi i śledź historię rzutów w bieżącej sesji.
        </p>
      </div>

      <DiceRoller />
    </div>
  );
}
