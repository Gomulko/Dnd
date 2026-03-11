import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiceRoller from "@/domains/dice/components/DiceRoller";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("DiceRoller", () => {
  it("renderuje 7 przycisków kości (k4, k6, k8, k10, k12, k20, k100)", () => {
    render(<DiceRoller />);
    for (const die of [4, 6, 8, 10, 12, 20, 100]) {
      expect(screen.getByTestId(`die-${die}`)).toBeInTheDocument();
    }
  });

  it("licznik kości startuje na 1", () => {
    render(<DiceRoller />);
    expect(screen.getByTestId("dice-count")).toHaveTextContent("1");
  });

  it("kliknięcie + zwiększa licznik do 2", () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("dice-count-plus"));
    expect(screen.getByTestId("dice-count")).toHaveTextContent("2");
  });

  it("licznik nie spada poniżej 1", () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("dice-count-minus"));
    expect(screen.getByTestId("dice-count")).toHaveTextContent("1");
  });

  it("licznik nie przekracza 20", () => {
    render(<DiceRoller />);
    for (let i = 0; i < 25; i++) fireEvent.click(screen.getByTestId("dice-count-plus"));
    expect(screen.getByTestId("dice-count")).toHaveTextContent("20");
  });

  it("historia zaczyna się pusta", () => {
    render(<DiceRoller />);
    const history = screen.getByTestId("roll-history");
    expect(history.querySelectorAll("[data-testid^='roll-entry']").length).toBe(0);
  });

  it("kliknięcie k6 → wynik w zakresie 1–6", async () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("die-6"));
    const el = await screen.findByTestId("roll-total");
    const total = parseInt(el.textContent ?? "0");
    expect(total).toBeGreaterThanOrEqual(1);
    expect(total).toBeLessThanOrEqual(6);
  });

  it("kliknięcie k20 → wynik w zakresie 1–20", async () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("die-20"));
    const el = await screen.findByTestId("roll-total");
    const total = parseInt(el.textContent ?? "0");
    expect(total).toBeGreaterThanOrEqual(1);
    expect(total).toBeLessThanOrEqual(20);
  });

  it("2k6 → wynik w zakresie 2–12", async () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("dice-count-plus")); // 2 kości
    fireEvent.click(screen.getByTestId("die-6"));
    const el = await screen.findByTestId("roll-total");
    const total = parseInt(el.textContent ?? "0");
    expect(total).toBeGreaterThanOrEqual(2);
    expect(total).toBeLessThanOrEqual(12);
  });

  it("po rzucie historia ma 1 wpis", async () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("die-20"));
    await screen.findByTestId("roll-total");
    const entries = screen.getByTestId("roll-history").children;
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  it("wyczyszczenie historii usuwa wpisy", async () => {
    render(<DiceRoller />);
    fireEvent.click(screen.getByTestId("die-20"));
    const clearBtn = await screen.findByTestId("clear-history");
    fireEvent.click(clearBtn);
    await waitFor(() => {
      const history = screen.getByTestId("roll-history");
      expect(history.querySelectorAll("[data-testid^='roll-entry']").length).toBe(0);
    });
  });
});
