import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement, JSXElementConstructor } from "react";
import { auth } from "@/shared/lib/auth";
import { getCharacter } from "@/domains/character/actions/getCharacter";
import { CharacterPdfDocument } from "@/domains/character/pdf/CharacterPdfDocument";
import React from "react";

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

  const element = React.createElement(
    CharacterPdfDocument,
    { character }
  ) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>;

  const buffer = await renderToBuffer(element);
  const bytes = new Uint8Array(buffer);

  const safeName = (character.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_") || "karta");
  const asciiFilename = `${safeName}_karta.pdf`;
  const utf8Filename = encodeURIComponent(`${character.name.replace(/\s+/g, "_")}_karta.pdf`);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${utf8Filename}`,
      "Content-Length": bytes.byteLength.toString(),
    },
  });
}
