import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * BLOK 7 — Nowe Server Actions (Faza 4)
 * updateInspiration, updateHitDiceUsed, updateSpellSlots, updateAttacks
 * Weryfikacja zgodności z zasadami D&D 5e SRD.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

const { mockAuth, mockUpdateMany } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockUpdateMany: vi.fn(),
}));

vi.mock("@/shared/lib/auth", () => ({ auth: mockAuth }));
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    character: {
      updateMany: mockUpdateMany,
    },
  },
}));

import { updateInspiration } from "@/domains/character/actions/updateInspiration";
import { updateHitDiceUsed } from "@/domains/character/actions/updateHitDiceUsed";
import { updateSpellSlots } from "@/domains/character/actions/updateSpellSlots";
import { updateAttacks } from "@/domains/character/actions/updateAttacks";

const SESSION = { user: { id: "user-1", email: "test@kroniki.pl" } };

// ── 7.1 updateInspiration ─────────────────────────────────────────────────────
// SRD 5e: "You either have inspiration or you don't" — wartość boolean

describe("updateInspiration", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateInspiration("char-1", true);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("zapisuje inspiration: true", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateInspiration("char-1", true);
    expect(result.error).toBeUndefined();
    expect(mockUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ inspiration: true }) })
    );
  });

  it("zapisuje inspiration: false (wydanie inspiracji)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateInspiration("char-1", false);
    expect(result.error).toBeUndefined();
    expect(mockUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ inspiration: false }) })
    );
  });

  it("wywołuje updateMany z userId — izolacja użytkowników", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    await updateInspiration("char-1", true);
    const callArg = mockUpdateMany.mock.calls[0][0];
    expect(callArg.where.userId).toBe("user-1");
    expect(callArg.where.id).toBe("char-1");
  });

  it("zwraca { error } przy pustym id", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateInspiration("", true);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });
});

// ── 7.2 updateHitDiceUsed ─────────────────────────────────────────────────────
// SRD 5e: "You have a number of Hit Dice equal to your level"
// Liczba użytych kości nie może być ujemna ani przekroczyć poziomu (max 20)

describe("updateHitDiceUsed", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateHitDiceUsed("char-1", 1);
    expect(result.error).toBeDefined();
  });

  it("hitDiceUsed = 0 jest poprawne (nikt nie użył kości)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateHitDiceUsed("char-1", 0);
    expect(result.error).toBeUndefined();
  });

  it("hitDiceUsed = 20 jest poprawne (max poziom w SRD)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateHitDiceUsed("char-1", 20);
    expect(result.error).toBeUndefined();
  });

  it("hitDiceUsed = -1 zwraca błąd (ujemne — SRD nie dopuszcza)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateHitDiceUsed("char-1", -1);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("hitDiceUsed = 21 zwraca błąd (powyżej max poziomu)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateHitDiceUsed("char-1", 21);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("hitDiceUsed = 2.5 zwraca błąd (nie liczba całkowita)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateHitDiceUsed("char-1", 2.5);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("zapisuje wartość z userId guard", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    await updateHitDiceUsed("char-1", 3);
    const callArg = mockUpdateMany.mock.calls[0][0];
    expect(callArg.where.userId).toBe("user-1");
    expect(callArg.data.hitDiceUsed).toBe(3);
  });
});

// ── 7.3 updateSpellSlots ──────────────────────────────────────────────────────
// SRD 5e: sloty czarów poziomów 1-9
// Maks. 4 sloty na poziom (Czarodziej poz.20 ma 4 sloty 9. poziomu)

describe("updateSpellSlots", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateSpellSlots("char-1", { "1": 1 });
    expect(result.error).toBeDefined();
  });

  it("zapisuje użycie jednego slotu 1. poziomu", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateSpellSlots("char-1", { "1": 1 });
    expect(result.error).toBeUndefined();
    expect(mockUpdateMany).toHaveBeenCalled();
  });

  it("zapisuje sloty dla wielu poziomów jednocześnie (SRD pozwala 1-9)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateSpellSlots("char-1", { "1": 2, "2": 1, "3": 0 });
    expect(result.error).toBeUndefined();
  });

  it("poziom '10' jest nieprawidłowy (SRD max poziom czarów = 9)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateSpellSlots("char-1", { "10": 1 } as Record<string, number>);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("wartość 5 jest nieprawidłowa (SRD max 4 sloty na poziom)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateSpellSlots("char-1", { "1": 5 });
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("wartość -1 jest nieprawidłowa (nie można użyć ujemnej liczby slotów)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateSpellSlots("char-1", { "1": -1 });
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("serializuje do JSON przy zapisie", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    await updateSpellSlots("char-1", { "1": 2, "2": 1 });
    const callArg = mockUpdateMany.mock.calls[0][0];
    const stored = JSON.parse(callArg.data.spellSlotsUsed);
    expect(stored["1"]).toBe(2);
    expect(stored["2"]).toBe(1);
  });
});

// ── 7.4 updateAttacks ─────────────────────────────────────────────────────────
// SRD 5e: tabela ataków (Weapon Attack) — nazwa, premia ATK, obrażenia/typ

describe("updateAttacks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateAttacks("char-1", []);
    expect(result.error).toBeDefined();
  });

  it("pusta tablica jest poprawna (postać bez broni)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateAttacks("char-1", []);
    expect(result.error).toBeUndefined();
  });

  it("poprawny atak — miecz długi typowy dla wojownika", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateAttacks("char-1", [
      { name: "Miecz długi", atkBonus: "+5", damage: "1d8+3 cięte" },
    ]);
    expect(result.error).toBeUndefined();
  });

  it("atak z ujemną premią ATK jest poprawny (SRD: kary do ataku możliwe)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateAttacks("char-1", [
      { name: "Improwizowana broń", atkBonus: "-1", damage: "1d4" },
    ]);
    expect(result.error).toBeUndefined();
  });

  it("brak nazwy ataku zwraca błąd walidacji", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateAttacks("char-1", [
      { name: "", atkBonus: "+5", damage: "1d8" },
    ]);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("serializuje ataki do JSON przy zapisie", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    const attacks = [
      { name: "Sztylet", atkBonus: "+4", damage: "1d4+2 przebijające" },
    ];
    await updateAttacks("char-1", attacks);
    const callArg = mockUpdateMany.mock.calls[0][0];
    const stored = JSON.parse(callArg.data.attacks);
    expect(stored[0].name).toBe("Sztylet");
    expect(stored[0].atkBonus).toBe("+4");
  });

  it("więcej niż 20 ataków zwraca błąd (limit tabeli)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const tooMany = Array.from({ length: 21 }, (_, i) => ({
      name: `Broń ${i}`,
      atkBonus: "+0",
      damage: "1d4",
    }));
    const result = await updateAttacks("char-1", tooMany);
    expect(result.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("wywołuje updateMany z userId guard", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    await updateAttacks("char-1", [{ name: "Łuk", atkBonus: "+3", damage: "1d6+1 przebijające" }]);
    const callArg = mockUpdateMany.mock.calls[0][0];
    expect(callArg.where.userId).toBe("user-1");
    expect(callArg.where.id).toBe("char-1");
  });
});
