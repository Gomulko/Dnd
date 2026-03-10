import TloForm from "@/domains/character/components/TloForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function TloPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <TloForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
