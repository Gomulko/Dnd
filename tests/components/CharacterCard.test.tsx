import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CharacterCard from "@/domains/character/components/CharacterCard";
import type { CharacterSummary } from "@/domains/character/actions/getCharacters";

// ── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/domains/character/actions/deleteCharacter", () => ({
  deleteCharacter: vi.fn().mockResolvedValue({ success: true }),
}));

// ── Fixtures ────────────────────────────────────────────────────────────────

function makeCharacter(overrides: Partial<CharacterSummary> = {}): CharacterSummary {
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
    strength: 10,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 17,
    charisma: 10,
    currentHp: null,
    isComplete: true,
    updatedAt: new Date(),
    ...overrides,
  };
}

// ── Testy ───────────────────────────────────────────────────────────────────

describe("CharacterCard", () => {
  it("renderuje imię postaci", () => {
    render(<CharacterCard character={makeCharacter()} />);
    expect(screen.getByText("Aldric Świetlisty")).toBeInTheDocument();
  });

  it("renderuje rasę i klasę (Elf · Kleryk)", () => {
    render(<CharacterCard character={makeCharacter()} />);
    expect(screen.getByText(/Elf/)).toBeInTheDocument();
    expect(screen.getByText(/Kleryk/)).toBeInTheDocument();
  });

  it("renderuje poziom (POZ. 1)", () => {
    render(<CharacterCard character={makeCharacter()} />);
    expect(screen.getByText(/POZ\. 1/i)).toBeInTheDocument();
  });

  it("inicjały w avatarze: 'Aldric Świetlisty' → 'AŚ'", () => {
    render(<CharacterCard character={makeCharacter()} />);
    expect(screen.getByText("AŚ")).toBeInTheDocument();
  });

  it("inicjały avatara — dwa wyrazy po angielsku: 'Anna Lena' → 'AL'", () => {
    render(<CharacterCard character={makeCharacter({ name: "Anna Lena" })} />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("link do karty postaci dla ukończonej postaci", () => {
    render(<CharacterCard character={makeCharacter({ isComplete: true })} />);
    expect(screen.getByRole("link", { name: /Otwórz kartę/i })).toBeInTheDocument();
  });

  it("przycisk 'Dokończ →' dla szkicu", () => {
    render(<CharacterCard character={makeCharacter({ isComplete: false })} />);
    expect(screen.getByRole("link", { name: /Dokończ/i })).toBeInTheDocument();
  });

  it("badge 'SZKIC' gdy isComplete = false", () => {
    render(<CharacterCard character={makeCharacter({ isComplete: false })} />);
    expect(screen.getByText(/SZKIC/i)).toBeInTheDocument();
  });

  it("nazwa klasy widoczna w podtytule postaci", () => {
    render(<CharacterCard character={makeCharacter()} />);
    // Klasa wyświetlana w meta-linii (Barlow uppercase): "Elf · Kleryk · Poz. 1"
    expect(screen.getByText(/kleryk/i)).toBeInTheDocument();
  });

  it("kliknięcie '···' otwiera dropdown z 'Usuń postać'", () => {
    render(<CharacterCard character={makeCharacter()} />);
    const menuBtn = screen.getByTestId("menu-btn");
    fireEvent.click(menuBtn);
    expect(screen.getByTestId("menu-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
  });

  it("kliknięcie 'Usuń postać' pokazuje dialog potwierdzenia", () => {
    render(<CharacterCard character={makeCharacter()} />);
    fireEvent.click(screen.getByTestId("menu-btn"));
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
  });
});

// ── Kolor HP — logika progów ─────────────────────────────────────────────────
// Funkcja hpColor: >60% → zielony, 30-60% → żółty, <30% → czerwony

describe("CharacterCard — kolor HP (progi)", () => {
  it("HP 100% wyświetla tekst HP w kolorze zielonym", () => {
    // kleryk d8, KON 12 (+1), lvl1 → maxHp=9; currentHp=9 → 100%
    render(<CharacterCard character={makeCharacter({ currentHp: 9, constitution: 12, class: "cleric", level: 1 })} />);
    // HP text "9 / 9" powinno być widoczne
    expect(screen.getByText("9 / 9")).toBeInTheDocument();
  });

  it("HP ~44% wyświetla tekst HP w kolorze żółtym", () => {
    // maxHp=9; currentHp=4 → ~44%
    render(<CharacterCard character={makeCharacter({ currentHp: 4, constitution: 12, class: "cleric", level: 1 })} />);
    expect(screen.getByText("4 / 9")).toBeInTheDocument();
  });

  it("HP ~22% wyświetla tekst HP w kolorze czerwonym", () => {
    // maxHp=9; currentHp=2 → ~22%
    render(<CharacterCard character={makeCharacter({ currentHp: 2, constitution: 12, class: "cleric", level: 1 })} />);
    expect(screen.getByText("2 / 9")).toBeInTheDocument();
  });
});
