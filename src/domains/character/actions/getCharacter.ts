"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function getCharacter(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const character = await prisma.character.findFirst({
    where: { id, userId: session.user.id },
  });

  return character;
}

export type CharacterFull = NonNullable<Awaited<ReturnType<typeof getCharacter>>>;
