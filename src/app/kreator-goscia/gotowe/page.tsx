import GuestGotoweForm from "@/domains/character/components/GuestGotoweForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscGotowePage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <GuestGotoweForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
