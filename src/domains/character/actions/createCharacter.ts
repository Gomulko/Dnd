"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const equipmentItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().min(0),
  weight: z.number().min(0),
});

const createCharacterSchema = z.object({
  // Step 1
  name: z.string().min(2).max(100),
  gender: z.enum(["kobieta", "mezczyzna", "inne"]),
  age: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  description: z.string().max(500),
  alignment: z.enum(["LG", "NG", "CG", "LN", "TN", "CN", "LE", "NE", "CE"]),
  // Step 2
  race: z.string().min(1),
  subrace: z.string().nullable(),
  // Step 3
  class: z.string().min(1),
  subclass: z.string().nullable(),
  skills: z.array(z.string()),
  // Step 4
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
  // Step 5
  background: z.string().nullable(),
  personalityTraits: z.array(z.string()),
  ideals: z.array(z.string()),
  bonds: z.array(z.string()),
  flaws: z.array(z.string()),
  languages: z.array(z.string()),
  backstory: z.string(),
  // Step 6
  equipment: z.array(equipmentItemSchema),
  gold: z.number().int().min(0),
  // Step 7
  cantrips: z.array(z.string()),
  spells: z.array(z.string()),
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;

export async function createCharacter(
  input: CreateCharacterInput
): Promise<{ error?: string; characterId?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Nie jesteś zalogowany." };

  const parsed = createCharacterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const data = parsed.data;

  // Compute maxHp based on class (stored as string) — simplified: use strength as fallback
  // The actual maxHp will be computed on the character card from class + constitution
  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      // Step 1
      name: data.name,
      gender: data.gender,
      age: data.age,
      height: data.height,
      description: data.description || null,
      alignment: data.alignment,
      // Step 2
      race: data.race,
      subrace: data.subrace,
      // Step 3
      class: data.class,
      subclass: data.subclass,
      level: 1,
      skills: JSON.stringify(data.skills),
      // Step 4
      strength: data.strength,
      dexterity: data.dexterity,
      constitution: data.constitution,
      intelligence: data.intelligence,
      wisdom: data.wisdom,
      charisma: data.charisma,
      // Step 5
      background: data.background,
      personalityTraits: JSON.stringify(data.personalityTraits),
      ideals: JSON.stringify(data.ideals),
      bonds: JSON.stringify(data.bonds),
      flaws: JSON.stringify(data.flaws),
      languages: JSON.stringify(data.languages),
      backstory: data.backstory || null,
      // Step 6
      equipment: JSON.stringify(data.equipment),
      gold: data.gold,
      // Step 7
      cantrips: JSON.stringify(data.cantrips),
      spells: JSON.stringify(data.spells),
      // Meta
      isComplete: true,
    },
  });

  return { characterId: character.id };
}
