"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { registerSchema, type RegisterInput } from "../schemas";

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { username, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { name: username } });
  if (existing) {
    return { error: "Użytkownik o tej nazwie już istnieje" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name: username, password: hashedPassword },
  });

  return { success: true };
}
