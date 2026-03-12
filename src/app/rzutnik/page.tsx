import DiceRoller from "@/domains/dice/components/DiceRoller";

export default function RzutnikPage() {
  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Nagłówek */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontFamily: "Cinzel, serif",
            color: "#f0ece4",
            fontWeight: 700,
          }}
        >
          Rzutnik Kości
        </h1>
        <div
          style={{
            marginTop: 8,
            height: 2,
            width: 60,
            background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 100%)",
            borderRadius: 1,
          }}
        />
        <p style={{ marginTop: 12, color: "#8b8699", fontSize: 16, margin: "8px 0 0" }}>
          Rzucaj kośćmi i śledź historię rzutów w bieżącej sesji.
        </p>
      </div>

      <DiceRoller />
    </div>
  );
}
