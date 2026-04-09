import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10
) {
  const prompt =
    mode === "quiz"
      ? `You are an expert educational AI. Generate exactly ${count} multiple-choice questions based on the exact notes provided. 
Return ONLY a strictly valid JSON object with a single key "questions" containing an array of objects.
Do not wrap it in markdown block quotes. Do not include any plain text explanation.

Notes:
${notes}

JSON Format to strictly follow:
{
  "questions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}`
      : `You are an expert educational AI. Generate exactly ${count} high-quality flashcards based on the exact notes provided.
Return ONLY a strictly valid JSON object with a single key "flashcards" containing an array of objects.
Do not wrap it in markdown block quotes. Do not include any plain text explanation.

Notes:
${notes}

JSON Format to strictly follow:
{
  "flashcards": [
    {
      "front": "...",
      "back": "..."
    }
  ]
}`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a specialized API that outputs strictly correct, well-formed JSON objects.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.2, // low temperature for structured data
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq API");
  }

  try {
    const rawData = JSON.parse(content);
    if (mode === "quiz") {
      return rawData.questions || rawData;
    } else {
      return rawData.flashcards || rawData;
    }
  } catch (error) {
    throw new Error("Failed to parse JSON response from Groq API");
  }
}
