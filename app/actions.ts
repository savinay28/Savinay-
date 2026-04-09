"use server";

import { generateQuizOrFlashcard } from "@/lib/ai";
import { redirect } from "next/navigation";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);
    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", () => {
      resolve((pdfParser as any).getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function generateContent(formData: FormData) {
  const notesText = formData.get("notes") as string | null;
  const file = formData.get("file") as File | null;
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const count = parseInt((formData.get("count") as string) || "10", 10);

  let extractedText = notesText || "";

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.name.endsWith(".pdf")) {
      extractedText += "\n" + (await extractTextFromPDF(buffer));
    } else if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText += "\n" + result.value;
    } else if (file.name.endsWith(".txt")) {
      extractedText += "\n" + buffer.toString("utf-8");
    }
  }

  if (!extractedText.trim()) {
    throw new Error("No content provided to generate from.");
  }

  const result = await generateQuizOrFlashcard(extractedText, mode, count);
  const encodedData = encodeURIComponent(JSON.stringify(result));

  redirect(`/${mode}?data=${encodedData}`);
}
