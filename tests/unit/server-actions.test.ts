import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * BLOK 6 — Server Actions
 * Testy z zamockowaną bazą danych (prisma) i sesją (auth).
 */

// ── Mocks (vi.hoisted — dostępne wewnątrz fabryk vi.mock) ────────────────────

const {
  mockAuth,
  mockCharacterCreate,
  mockCharacterFindUnique,
  mockCharacterDelete,
  mockCharacterUpdateMany,
  mockCharacterUpdate,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCharacterCreate: vi.fn(),
  mockCharacterFindUnique: vi.fn(),
  mockCharacterDelete: vi.fn(),
  mockCharacterUpdateMany: vi.fn(),
  mockCharacterUpdate: vi.fn(),
}));

vi.mock("@/shared/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    character: {
      create: mockCharacterCreate,
      findUnique: mockCharacterFindUnique,
      delete: mockCharacterDelete,
      updateMany: mockCharacterUpdateMany,
      update: mockCharacterUpdate,
    },
  },
}));

// ── Import po mockach ─────────────────────────────────────────────────────────

import { createCharacter } from "@/domains/character/actions/createCharacter";
import { deleteCharacter } from "@/domains/character/actions/deleteCharacter";
import { updateCharacterHp } from "@/domains/character/actions/updateCharacterHp";
import { updateCharacter } from "@/domains/character/actions/updateCharacter";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SESSION = { user: { id: "user-1", email: "test@kroniki.pl" } };

function validCreateInput() {
  return {
    name: "Araniel Świetlisty",
    gender: "mezczyzna" as const,
    age: 130,
    height: 175,
    description: "Opis postaci.",
    alignment: "LG" as const,
    race: "elf",
    subrace: "wysoki-elf",
    class: "cleric",
    subclass: "life",
    skills: ["insight", "history"],
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 15,
    charisma: 13,
    background: "acolyte",
    personalityTraits: ["Miłuję ład."],
    ideals: ["Sprawiedliwość."],
    bonds: ["Świątynia."],
    flaws: ["Nieufność."],
    languages: ["elvish"],
    backstory: "",
    equipment: [{ name: "Kolczuga", qty: 1, weight: 20 }],
    gold: 10,
    cantrips: ["guidance"],
    spells: ["bless"],
  };
}

// ── 6.1 createCharacter ───────────────────────────────────────────────────────

describe("createCharacter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createCharacter(validCreateInput());
    expect(result.error).toBeDefined();
    expect(mockCharacterCreate).not.toHaveBeenCalled();
  });

  it("zwraca { error } gdy sesja bez userId", async () => {
    mockAuth.mockResolvedValue({ user: {} });
    const result = await createCharacter(validCreateInput());
    expect(result.error).toBeDefined();
    expect(mockCharacterCreate).not.toHaveBeenCalled();
  });

  it("zwraca { error } przy za krótkim imieniu (walidacja Zod)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await createCharacter({ ...validCreateInput(), name: "A" });
    expect(result.error).toBeDefined();
    expect(mockCharacterCreate).not.toHaveBeenCalled();
  });

  it("zwraca { error } przy wartości cechy > 30 (walidacja Zod, SRD max)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await createCharacter({ ...validCreateInput(), strength: 31 });
    expect(result.error).toBeDefined();
    expect(mockCharacterCreate).not.toHaveBeenCalled();
  });

  it("zwraca { error } przy ujemnym gold", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await createCharacter({ ...validCreateInput(), gold: -1 });
    expect(result.error).toBeDefined();
    expect(mockCharacterCreate).not.toHaveBeenCalled();
  });

  it("zwraca { characterId } przy poprawnych danych", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterCreate.mockResolvedValue({ id: "char-abc-123" });
    const result = await createCharacter(validCreateInput());
    expect(result.error).toBeUndefined();
    expect(result.characterId).toBe("char-abc-123");
  });

  it("tworzy postać z isComplete: true", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterCreate.mockResolvedValue({ id: "char-1" });
    await createCharacter(validCreateInput());
    const callArg = mockCharacterCreate.mock.calls[0][0];
    expect(callArg.data.isComplete).toBe(true);
  });

  it("zapisuje userId zalogowanego użytkownika", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterCreate.mockResolvedValue({ id: "char-1" });
    await createCharacter(validCreateInput());
    const callArg = mockCharacterCreate.mock.calls[0][0];
    expect(callArg.data.userId).toBe("user-1");
  });
});

// ── 6.2 updateCharacter ───────────────────────────────────────────────────────

describe("updateCharacter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function validUpdateInput() {
    return { id: "char-1", ...validCreateInput() };
  }

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateCharacter(validUpdateInput());
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdate).not.toHaveBeenCalled();
  });

  it("zwraca { error } gdy postać nie istnieje", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue(null);
    const result = await updateCharacter(validUpdateInput());
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdate).not.toHaveBeenCalled();
  });

  it("zwraca { error } gdy postać należy do innego użytkownika", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "other-user" });
    const result = await updateCharacter(validUpdateInput());
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdate).not.toHaveBeenCalled();
  });

  it("zwraca { characterId } przy sukcesie", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "user-1" });
    mockCharacterUpdate.mockResolvedValue({});
    const result = await updateCharacter(validUpdateInput());
    expect(result.error).toBeUndefined();
    expect(result.characterId).toBe("char-1");
  });

  it("aktualizuje imię — nie zeruje HP ani notatek (HP/notatki nie są w updateCharacterSchema)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "user-1" });
    mockCharacterUpdate.mockResolvedValue({});
    await updateCharacter({ ...validUpdateInput(), name: "Nowe Imię" });
    const callArg = mockCharacterUpdate.mock.calls[0][0];
    // Upewnij się, że HP i sessionNotes NIE są w data (nie nadpisujemy)
    expect(callArg.data.currentHp).toBeUndefined();
    expect(callArg.data.sessionNotes).toBeUndefined();
    expect(callArg.data.name).toBe("Nowe Imię");
  });
});

// ── 6.3 deleteCharacter ───────────────────────────────────────────────────────

describe("deleteCharacter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await deleteCharacter({ id: "char-1" });
    expect("error" in result && result.error).toBeDefined();
    expect(mockCharacterDelete).not.toHaveBeenCalled();
  });

  it("zwraca { error } gdy postać nie istnieje", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue(null);
    const result = await deleteCharacter({ id: "char-1" });
    expect("error" in result && result.error).toBeDefined();
    expect(mockCharacterDelete).not.toHaveBeenCalled();
  });

  it("zwraca { error } gdy postać należy do innego użytkownika", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "other-user" });
    const result = await deleteCharacter({ id: "char-1" });
    expect("error" in result && result.error).toBeDefined();
    expect(mockCharacterDelete).not.toHaveBeenCalled();
  });

  it("usuwa postać z bazy przy sukcesie", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "user-1" });
    mockCharacterDelete.mockResolvedValue({});
    const result = await deleteCharacter({ id: "char-1" });
    expect(mockCharacterDelete).toHaveBeenCalledWith({ where: { id: "char-1" } });
    expect("success" in result && result.success).toBe(true);
  });

  it("zwraca { success: true } przy sukcesie", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterFindUnique.mockResolvedValue({ userId: "user-1" });
    mockCharacterDelete.mockResolvedValue({});
    const result = await deleteCharacter({ id: "char-xyz" });
    expect(result).toEqual({ success: true });
  });

  it("zwraca { error } przy pustym id (walidacja Zod)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await deleteCharacter({ id: "" });
    expect("error" in result && result.error).toBeDefined();
    expect(mockCharacterDelete).not.toHaveBeenCalled();
  });
});

// ── 6.4 updateCharacterHp ─────────────────────────────────────────────────────
// SRD: HP może być ujemne (zasady masowych obrażeń), ale gra zazwyczaj używa 0
// Aplikacja: zakres -99..999 (wymaganie z PLAN.md)

describe("updateCharacterHp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zwraca { error } gdy brak sesji", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateCharacterHp("char-1", 10);
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdateMany).not.toHaveBeenCalled();
  });

  it("zwraca {} (brak błędu) przy poprawnych danych", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateCharacterHp("char-1", 10);
    expect(result.error).toBeUndefined();
  });

  it("HP = 0 jest prawidłowe (postać na granicy śmierci)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateCharacterHp("char-1", 0);
    expect(result.error).toBeUndefined();
    expect(mockCharacterUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { currentHp: 0 } })
    );
  });

  it("HP = -99 jest prawidłowe (dolna granica aplikacji)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateCharacterHp("char-1", -99);
    expect(result.error).toBeUndefined();
  });

  it("HP = 999 jest prawidłowe (górna granica aplikacji)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterUpdateMany.mockResolvedValue({ count: 1 });
    const result = await updateCharacterHp("char-1", 999);
    expect(result.error).toBeUndefined();
  });

  it("HP = -100 zwraca błąd Zod (poniżej -99)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateCharacterHp("char-1", -100);
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdateMany).not.toHaveBeenCalled();
  });

  it("HP = 1000 zwraca błąd Zod (powyżej 999)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateCharacterHp("char-1", 1000);
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdateMany).not.toHaveBeenCalled();
  });

  it("HP = 3.14 zwraca błąd Zod (nie liczba całkowita)", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const result = await updateCharacterHp("char-1", 3.14);
    expect(result.error).toBeDefined();
    expect(mockCharacterUpdateMany).not.toHaveBeenCalled();
  });

  it("updateMany jest wywoływane z userId — brak dostępu do cudzych postaci", async () => {
    mockAuth.mockResolvedValue(SESSION);
    mockCharacterUpdateMany.mockResolvedValue({ count: 1 });
    await updateCharacterHp("char-1", 42);
    const callArg = mockCharacterUpdateMany.mock.calls[0][0];
    expect(callArg.where.userId).toBe("user-1");
    expect(callArg.where.id).toBe("char-1");
    expect(callArg.data.currentHp).toBe(42);
  });
});
