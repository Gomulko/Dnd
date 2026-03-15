import MagiaForm from "@/domains/character/components/MagiaForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscMagiaPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <MagiaForm basePath="/kreator-goscia" />
      </div>
      <CharacterPreview />
    </div>
  );
}
