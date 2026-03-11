"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// SRD 5e: sloty czarów poziomów 1-9, każdy użyty >= 0
// Klucze to numery poziomów 1-9, wartości = liczba użytych slotów
const VALID_LEVELS = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

const schema = z.object({
  id: z.string().min(1),
  spellSlotsUsed: z
    .record(z.string(), z.number().int().min(0).max(4))
    .refine(
      (obj) => Object.keys(obj).every((k) => VALID_LEVELS.has(k)),
      { message: "Klucz musi być poziomem czarów 1–9" }
    ),
});

export async function updateSpellSlots(
  id: string,
  spellSlotsUsed: Record<string, number>
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, spellSlotsUsed });
  if (!parsed.success) return { error: "Nieprawidłowe dane." };

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { spellSlotsUsed: JSON.stringify(parsed.data.spellSlotsUsed) } as any,
  });

  return {};
}
