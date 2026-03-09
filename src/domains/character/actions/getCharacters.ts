"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function getCharacters() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      race: true,
      subrace: true,
      class: true,
      subclass: true,
      level: true,
      alignment: true,
      background: true,
      strength: true,
      dexterity: true,
      constitution: true,
      intelligence: true,
      wisdom: true,
      charisma: true,
      currentHp: true,
      isComplete: true,
      updatedAt: true,
    },
  });
}

export type CharacterSummary = Awaited<ReturnType<typeof getCharacters>>[number];
