import RasaForm from "@/domains/character/components/RasaForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function RasaPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <RasaForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
