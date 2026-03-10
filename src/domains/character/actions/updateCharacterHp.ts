"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1),
  currentHp: z.number().int().min(-99).max(999),
});

export async function updateCharacterHp(
  id: string,
  currentHp: number
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, currentHp });
  if (!parsed.success) return { error: "Nieprawidłowe dane." };

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    data: { currentHp: parsed.data.currentHp },
  });

  return {};
}
