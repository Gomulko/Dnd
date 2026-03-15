import KlasaForm from "@/domains/character/components/KlasaForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscKlasaPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <KlasaForm basePath="/kreator-goscia" />
      </div>
      <CharacterPreview />
    </div>
  );
}
