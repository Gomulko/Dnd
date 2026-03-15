import { z } from "zod";

export const guestCharacterSchema = z.object({
  step1: z.object({
    name: z.string().min(1),
    gender: z.string(),
    age: z.number().nullable(),
    height: z.number().nullable(),
    weight: z.number().nullable(),
    eyeColor: z.string(),
    skinColor: z.string(),
    hairColor: z.string(),
    description: z.string(),
    alignment: z.string(),
  }),
  step2: z.object({
    race: z.string(),
    subrace: z.string().nullable(),
  }),
  step3: z.object({
    class: z.string(),
    subclass: z.string().nullable(),
    skills: z.array(z.string()),
  }),
  step4: z.object({
    method: z.string(),
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
  }),
  step5: z.object({
    background: z.string(),
    personalityTraits: z.array(z.string()),
    ideals: z.array(z.string()),
    bonds: z.array(z.string()),
    flaws: z.array(z.string()),
    languages: z.array(z.string()),
    backstory: z.string(),
    allies: z.string(),
    treasure: z.string(),
  }),
  step6: z.object({
    equipment: z.array(z.object({ name: z.string(), qty: z.number(), weight: z.number() })),
    gold: z.number(),
  }),
  step7: z.object({
    cantrips: z.array(z.string()),
    spells: z.array(z.string()),
  }),
});

export type GuestCharacterInput = z.infer<typeof guestCharacterSchema>;
