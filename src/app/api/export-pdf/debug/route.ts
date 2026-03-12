import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(): Promise<NextResponse> {
  const templatePath = path.join(process.cwd(), "public", "character-sheet-template.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Wypełnij każde pole numerem porządkowym (1, 2, 3...)
  form.getFields().forEach((field, i) => {
    try {
      form.getTextField(field.getName()).setText(String(i + 1));
    } catch {
      // nie TextField — ignoruj
    }
  });

  const pdfBytes = await pdfDoc.save({ updateFieldAppearances: false });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="debug-fields.pdf"',
    },
  });
}
