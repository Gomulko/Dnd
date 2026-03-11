import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CharacterSheet from "@/domains/character/components/CharacterSheet";
import type { CharacterFull } from "@/domains/character/actions/getCharacter";

// ── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/domains/character/actions/updateCharacterHp", () => ({
  updateCharacterHp: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/domains/character/actions/updateSessionNotes", () => ({
  updateSessionNotes: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/domains/character/store/wizardStore", () => ({
  useWizardStore: () => ({
    loadCharacter: vi.fn(),
    editingId: null,
  }),
}));

// ── Fixture ──────────────────────────────────────────────────────────────────

function makeCharacter(overrides: Partial<CharacterFull> = {}): CharacterFull {
  return {
    id: "test-id",
    name: "Aldric Świetlisty",
    race: "elf",
    subrace: null,
    class: "cleric",
    subclass: "life",
    level: 1,
    alignment: "LG",
    background: "acolyte",
    description: "Historia testowa",
    age: null,
    height: null,
    gender: null,
    strength: 10,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 17,
    charisma: 10,
    currentHp: null,
    gold: 50,
    skills: "[]",
    equipment: "[]",
    cantrips: "[]",
    spells: "[]",
    personalityTraits: "[]",
    ideals: "[]",
    bonds: "[]",
    flaws: "[]",
    sessionNotes: null,
    isComplete: true,
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ── Testy ────────────────────────────────────────────────────────────────────

describe("CharacterSheet", () => {
  it("renderuje imię postaci w nagłówku", () => {
    render(<CharacterSheet character={makeCharacter()} />);
    expect(screen.getByText("Aldric Świetlisty")).toBeInTheDocument();
  });

  it("renderuje poprawne HP: kleryk d8, KON 12 (+1), poziom 1 → 9", () => {
    render(<CharacterSheet character={makeCharacter({ constitution: 12, class: "cleric", level: 1 })} />);
    expect(screen.getByTestId("current-hp")).toHaveTextContent("9");
  });

  it("renderuje poprawną AC: DEX 14 (+2) → AC = 12", () => {
    render(<CharacterSheet character={makeCharacter({ dexterity: 14 })} />);
    expect(screen.getAllByText("12").length).toBeGreaterThan(0);
  });

  it("renderuje poprawny bonus biegłości: poziom 1 → +2", () => {
    render(<CharacterSheet character={makeCharacter({ level: 1 })} />);
    expect(screen.getAllByText("+2").length).toBeGreaterThan(0);
  });

  it("renderuje modyfikator cechy: MĄD 17 → '+3'", () => {
    render(<CharacterSheet character={makeCharacter({ wisdom: 17 })} />);
    expect(screen.getAllByText("+3").length).toBeGreaterThan(0);
  });

  it("renderuje Spell Save DC: kleryk MĄD 17 (+3), poziom 1 (PB+2) → 13", () => {
    render(<CharacterSheet character={makeCharacter({ wisdom: 17, level: 1, class: "cleric" })} />);
    // ST Czarów = 8 + 3 + 2 = 13
    expect(screen.getByText("13")).toBeInTheDocument();
  });

  it("przyciski topbaru są widoczne: 'Eksportuj PDF' i 'Edytuj Postać'", () => {
    render(<CharacterSheet character={makeCharacter()} />);
    expect(screen.getByTestId("export-pdf-btn")).toBeInTheDocument();
    expect(screen.getByTestId("edit-character-btn")).toBeInTheDocument();
  });

  it("renderuje sekcję rzutów obronnych", () => {
    render(<CharacterSheet character={makeCharacter()} />);
    expect(screen.getByText(/Rzuty Obronne/i)).toBeInTheDocument();
  });
});
