"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// SRD 5e: liczba użytych kości życia nie może być ujemna
// ani przekraczać poziomu postaci (weryfikacja po stronie klienta/kart postaci)
const schema = z.object({
  id: z.string().min(1),
  hitDiceUsed: z.number().int().min(0).max(20),
});

export async function updateHitDiceUsed(
  id: string,
  hitDiceUsed: number
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, hitDiceUsed });
  if (!parsed.success) return { error: "Nieprawidłowe dane." };

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { hitDiceUsed: parsed.data.hitDiceUsed } as any,
  });

  return {};
}
