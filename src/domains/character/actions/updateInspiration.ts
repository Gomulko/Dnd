"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// SRD 5e: postać albo ma inspirację, albo nie — wartość boolean
const schema = z.object({
  id: z.string().min(1),
  inspiration: z.boolean(),
});

export async function updateInspiration(
  id: string,
  inspiration: boolean
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, inspiration });
  if (!parsed.success) return { error: "Nieprawidłowe dane." };

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { inspiration: parsed.data.inspiration } as any,
  });

  return {};
}
