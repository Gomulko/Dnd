"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1),
  sessionNotes: z.string().max(5000),
});

export async function updateSessionNotes(
  id: string,
  sessionNotes: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, sessionNotes });
  if (!parsed.success) return { error: "Nieprawidłowe dane." };

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    data: { sessionNotes: parsed.data.sessionNotes },
  });

  return {};
}
