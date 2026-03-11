"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const equipmentItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().min(0),
  weight: z.number().min(0),
});

const updateCharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(100),
  gender: z.enum(["kobieta", "mezczyzna", "inne"]),
  age: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  description: z.string().max(500),
  alignment: z.enum(["LG", "NG", "CG", "LN", "TN", "CN", "LE", "NE", "CE"]),
  race: z.string().min(1),
  subrace: z.string().nullable(),
  class: z.string().min(1),
  subclass: z.string().nullable(),
  skills: z.array(z.string()),
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
  background: z.string().nullable(),
  personalityTraits: z.array(z.string()),
  ideals: z.array(z.string()),
  bonds: z.array(z.string()),
  flaws: z.array(z.string()),
  languages: z.array(z.string()),
  backstory: z.string(),
  equipment: z.array(equipmentItemSchema),
  gold: z.number().int().min(0),
  cantrips: z.array(z.string()),
  spells: z.array(z.string()),
});

export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;

export async function updateCharacter(
  input: UpdateCharacterInput
): Promise<{ error?: string; characterId?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Nie jesteś zalogowany." };

  const parsed = updateCharacterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const data = parsed.data;

  const existing = await prisma.character.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!existing) return { error: "Postać nie istnieje." };
  if (existing.userId !== session.user.id) return { error: "Brak dostępu." };

  await prisma.character.update({
    where: { id: data.id },
    data: {
      name: data.name,
      gender: data.gender,
      age: data.age,
      height: data.height,
      description: data.description || null,
      alignment: data.alignment,
      race: data.race,
      subrace: data.subrace,
      class: data.class,
      subclass: data.subclass,
      skills: JSON.stringify(data.skills),
      strength: data.strength,
      dexterity: data.dexterity,
      constitution: data.constitution,
      intelligence: data.intelligence,
      wisdom: data.wisdom,
      charisma: data.charisma,
      background: data.background,
      personalityTraits: JSON.stringify(data.personalityTraits),
      ideals: JSON.stringify(data.ideals),
      bonds: JSON.stringify(data.bonds),
      flaws: JSON.stringify(data.flaws),
      languages: JSON.stringify(data.languages),
      backstory: data.backstory || null,
      equipment: JSON.stringify(data.equipment),
      gold: data.gold,
      cantrips: JSON.stringify(data.cantrips),
      spells: JSON.stringify(data.spells),
      isComplete: true,
    },
  });

  return { characterId: data.id };
}
