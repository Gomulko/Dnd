import RasaForm from "@/domains/character/components/RasaForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscRasaPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <RasaForm basePath="/kreator-goscia" />
      </div>
      <CharacterPreview />
    </div>
  );
}
