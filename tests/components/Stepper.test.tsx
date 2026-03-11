import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stepper from "@/shared/ui/Stepper";

describe("Stepper", () => {
  it("renderuje 8 kroków", () => {
    render(<Stepper currentStep={1} />);
    // textTransform: uppercase w CSS — DOM zawiera oryginalne teksty
    const labels = ["Koncept", "Rasa", "Klasa", "Cechy", "Tło", "Ekwipunek", "Magia", "Gotowe"];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("aktywny krok (currentStep=1) → bąbelek kroku 1 wyświetla cyfrę '1'", () => {
    render(<Stepper currentStep={1} />);
    // Aktywny krok pokazuje numer, nie ✓
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("ukończone kroki (currentStep=3) → kroki 1 i 2 wyświetlają '✓'", () => {
    render(<Stepper currentStep={3} />);
    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBe(2);
  });

  it("kroki po aktywnym są szare (numer, nie ✓)", () => {
    render(<Stepper currentStep={2} />);
    // Kroki 3-8 powinny pokazywać numery, nie ✓
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    // Tylko krok 1 ma ✓
    const checkmarks = screen.queryAllByText("✓");
    expect(checkmarks.length).toBe(1);
  });

  it("etykiety kroków są widoczne", () => {
    render(<Stepper currentStep={1} />);
    expect(screen.getByText("Koncept")).toBeInTheDocument();
    expect(screen.getByText("Gotowe")).toBeInTheDocument();
  });
});
