import KonceptForm from "@/domains/character/components/KonceptForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscKonceptPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <KonceptForm basePath="/kreator-goscia" />
      </div>
      <CharacterPreview />
    </div>
  );
}
