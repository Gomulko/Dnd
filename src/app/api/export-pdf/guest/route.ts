import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { guestCharacterSchema } from "@/domains/character/schemas/guestCharacterSchema";
import { fillCharacterPdf } from "@/shared/lib/fillCharacterPdf";
import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const parsed = guestCharacterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { step1, step2, step3, step4, step5, step6, step7 } = parsed.data;

  const race = RACES.find((r) => r.id === step2.race);
  const bg   = BACKGROUNDS.find((b) => b.id === step5.background);

  const skills = [...new Set([...step3.skills, ...(bg?.skillProficiencies ?? [])])];
  const languages = [
    ...(race?.languages.filter((l) => !l.includes("wg wyboru")) ?? []),
    ...step5.languages,
  ];

  const templatePath  = path.join(process.cwd(), "public", "character-sheet-template.pdf");
  const templateBytes = fs.readFileSync(templatePath);

  const pdfBytes = await fillCharacterPdf(templateBytes, {
    name:             step1.name,
    race:             step2.race,
    class:            step3.class,
    level:            1,
    background:       step5.background,
    alignment:        step1.alignment,
    userName:         "Gość",
    experience:       0,
    inspiration:      false,
    strength:         step4.strength || 10,
    dexterity:        step4.dexterity || 10,
    constitution:     step4.constitution || 10,
    intelligence:     step4.intelligence || 10,
    wisdom:           step4.wisdom || 10,
    charisma:         step4.charisma || 10,
    currentHp:        null,
    tempHp:           0,
    skills,
    attacks:          [],
    personalityTraits: step5.personalityTraits,
    ideals:           step5.ideals,
    bonds:            step5.bonds,
    flaws:            step5.flaws,
    languages,
    equipment:        step6.equipment,
    gold:             step6.gold,
    cantrips:         step7.cantrips,
    spells:           step7.spells,
    backstory:        step5.backstory || null,
    allies:           step5.allies || null,
    treasure:         step5.treasure || null,
    description:      step1.description || null,
    age:              step1.age,
    height:           step1.height,
    weight:           step1.weight,
    eyeColor:         step1.eyeColor || null,
    skinColor:        step1.skinColor || null,
    hairColor:        step1.hairColor || null,
  });

  const safeName = (step1.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_") || "postac");

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_karta.pdf"; filename*=UTF-8''${encodeURIComponent(`${step1.name.replace(/\s+/g, "_")}_karta.pdf`)}`,
      "Content-Length": pdfBytes.byteLength.toString(),
    },
  });
}
