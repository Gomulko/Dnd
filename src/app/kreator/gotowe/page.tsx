import GotoweForm from "@/domains/character/components/GotoweForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GotowePage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <GotoweForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
