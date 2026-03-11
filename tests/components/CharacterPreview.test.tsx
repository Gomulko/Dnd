import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CharacterPreview from "@/domains/character/components/CharacterPreview";
import { useWizardStore } from "@/domains/character/store/wizardStore";

// ── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/domains/character/store/wizardStore", () => ({
  useWizardStore: vi.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

type StoreOverride = {
  step1?: Partial<{ name: string; alignment: string; gender: string; age: number | null; height: number | null; description: string }>;
  step2?: Partial<{ race: string; subrace: string | null }>;
  step3?: Partial<{ class: string; subclass: string | null; skills: string[] }>;
};

function mockStore(overrides: StoreOverride = {}) {
  vi.mocked(useWizardStore).mockReturnValue({
    step1: {
      name: "",
      alignment: "",
      gender: "mezczyzna",
      age: null,
      height: null,
      description: "",
      ...overrides.step1,
    },
    step2: {
      race: "",
      subrace: null,
      ...overrides.step2,
    },
    step3: {
      class: "",
      subclass: null,
      skills: [],
      ...overrides.step3,
    },
  });
}

// ── Testy ────────────────────────────────────────────────────────────────────

describe("CharacterPreview", () => {
  it("renderuje '?' jako inicjały gdy brak imienia", () => {
    mockStore();
    render(<CharacterPreview />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renderuje inicjały z imienia (dwa wyrazy → pierwsza litera każdego słowa)", () => {
    // split(" ").map(w => w[0]) = ["A","Ś"] → "AŚ"
    mockStore({ step1: { name: "Araniel Świetlisty" } });
    render(<CharacterPreview />);
    expect(screen.getByText("AŚ")).toBeInTheDocument();
  });

  it("renderuje inicjały z jednowyrazowego imienia (tylko pierwsza litera)", () => {
    // split(" ").map(w => w[0]) = ["A"] → "A"
    mockStore({ step1: { name: "Araniel" } });
    render(<CharacterPreview />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("wyświetla imię postaci gdy wpisane", () => {
    mockStore({ step1: { name: "Aldric Świetlisty" } });
    render(<CharacterPreview />);
    expect(screen.getByText("Aldric Świetlisty")).toBeInTheDocument();
  });

  it("wyświetla 'Imię postaci' gdy brak imienia", () => {
    mockStore({ step1: { name: "" } });
    render(<CharacterPreview />);
    expect(screen.getByText("Imię postaci")).toBeInTheDocument();
  });

  it("wyświetla 'Rasa · Klasa' gdy brak rasy i klasy", () => {
    mockStore();
    render(<CharacterPreview />);
    expect(screen.getByText("Rasa · Klasa")).toBeInTheDocument();
  });

  it("wyświetla rasę i klasę gdy wybrane", () => {
    mockStore({ step2: { race: "elf" }, step3: { class: "cleric" } });
    render(<CharacterPreview />);
    expect(screen.getByText("Elf · Kleryk")).toBeInTheDocument();
  });

  it("wyświetla tylko rasę gdy brak klasy", () => {
    mockStore({ step2: { race: "dwarf" } });
    render(<CharacterPreview />);
    expect(screen.getByText("Krasnolud")).toBeInTheDocument();
  });

  it("wyświetla '—' gdy brak alignmentu", () => {
    mockStore({ step1: { alignment: "" } });
    render(<CharacterPreview />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("wyświetla skróconą formę alignmentu (pierwszy człon)", () => {
    mockStore({ step1: { alignment: "LG" } });
    render(<CharacterPreview />);
    // ALIGNMENT_LABELS["LG"] = "Praworządny Dobry" → split(" ")[0] = "Praworządny"
    expect(screen.getByText("Praworządny")).toBeInTheDocument();
  });

  it("wyświetla alignment Chaotyczny Neutralny → 'Chaotyczny'", () => {
    mockStore({ step1: { alignment: "CN" } });
    render(<CharacterPreview />);
    expect(screen.getByText("Chaotyczny")).toBeInTheDocument();
  });

  it("wyświetla poziom '1' zawsze (kreator tworzy poz. 1)", () => {
    mockStore();
    render(<CharacterPreview />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
