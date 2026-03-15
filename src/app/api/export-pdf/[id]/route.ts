import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { auth } from "@/shared/lib/auth";
import { getCharacter } from "@/domains/character/actions/getCharacter";
import { fillCharacterPdf } from "@/shared/lib/fillCharacterPdf";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) {
    return NextResponse.json({ error: "Postać nie istnieje" }, { status: 404 });
  }

  const templatePath  = path.join(process.cwd(), "public", "character-sheet-template.pdf");
  const templateBytes = fs.readFileSync(templatePath);

  const pdfBytes = await fillCharacterPdf(templateBytes, {
    name:             character.name,
    race:             character.race,
    class:            character.class,
    level:            character.level,
    background:       character.background ?? null,
    alignment:        character.alignment,
    userName:         session.user.name ?? "",
    experience:       character.experience ?? 0,
    inspiration:      character.inspiration ?? false,
    strength:         character.strength,
    dexterity:        character.dexterity,
    constitution:     character.constitution,
    intelligence:     character.intelligence,
    wisdom:           character.wisdom,
    charisma:         character.charisma,
    currentHp:        character.currentHp ?? null,
    tempHp:           character.tempHp ?? 0,
    skills:           JSON.parse(character.skills || "[]") as string[],
    attacks:          JSON.parse(character.attacks || "[]") as { name: string; atkBonus: string; damage: string }[],
    personalityTraits: JSON.parse(character.personalityTraits || "[]") as string[],
    ideals:           JSON.parse(character.ideals  || "[]") as string[],
    bonds:            JSON.parse(character.bonds   || "[]") as string[],
    flaws:            JSON.parse(character.flaws   || "[]") as string[],
    languages:        JSON.parse(character.languages || "[]") as string[],
    equipment:        JSON.parse(character.equipment || "[]") as { name: string; qty: number }[],
    gold:             character.gold ?? 0,
    cantrips:         JSON.parse(character.cantrips || "[]") as string[],
    spells:           JSON.parse(character.spells   || "[]") as string[],
    backstory:        character.backstory   ?? null,
    allies:           character.allies     ?? null,
    treasure:         character.treasure   ?? null,
    description:      character.description ?? null,
    age:              character.age    ?? null,
    height:           character.height ?? null,
    weight:           character.weight ?? null,
    eyeColor:         character.eyeColor  ?? null,
    skinColor:        character.skinColor ?? null,
    hairColor:        character.hairColor ?? null,
  });

  const safeName = (character.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_") || "karta");

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_karta.pdf"; filename*=UTF-8''${encodeURIComponent(`${character.name.replace(/\s+/g, "_")}_karta.pdf`)}`,
      "Content-Length": pdfBytes.byteLength.toString(),
    },
  });
}
