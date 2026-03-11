"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const schema = z.object({ id: z.string().min(1) });

export async function deleteCharacter(
  input: z.infer<typeof schema>,
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Nieprawidłowe dane" };

  const character = await prisma.character.findUnique({
    where: { id: parsed.data.id },
    select: { userId: true },
  });

  if (!character) return { error: "Postać nie istnieje" };
  if (character.userId !== session.user.id) return { error: "Brak dostępu" };

  await prisma.character.delete({ where: { id: parsed.data.id } });

  return { success: true };
}
