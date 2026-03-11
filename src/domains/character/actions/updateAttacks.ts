"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// Tabela ataków per SRD 5e: każdy atak ma nazwę, premię ATK i obrażenia/typ
const attackSchema = z.object({
  name: z.string().min(1).max(50),
  atkBonus: z.string().max(10),   // np. "+5", "-1" — string bo zawiera znak
  damage: z.string().max(20),     // np. "1d8+3 przebijające"
});

const schema = z.object({
  id: z.string().min(1),
  attacks: z.array(attackSchema).max(20),
});

export type AttackEntry = z.infer<typeof attackSchema>;

export async function updateAttacks(
  id: string,
  attacks: AttackEntry[]
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Brak autoryzacji." };

  const parsed = schema.safeParse({ id, attacks });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  await prisma.character.updateMany({
    where: { id, userId: session.user.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { attacks: JSON.stringify(parsed.data.attacks) } as any,
  });

  return {};
}
