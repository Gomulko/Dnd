import EkwipunekForm from "@/domains/character/components/EkwipunekForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function EkwipunekPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <EkwipunekForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
