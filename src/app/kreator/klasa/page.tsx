import KlasaForm from "@/domains/character/components/KlasaForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function KlasaPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <KlasaForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
