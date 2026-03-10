import CechyForm from "@/domains/character/components/CechyForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function CechyPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <CechyForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
