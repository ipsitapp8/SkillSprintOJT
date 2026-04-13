import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  let fallbackTopic = "General";
  let fallbackDifficulty = "Medium";
  let fallbackCount = 5;

  try {
    const body = await request.json();
    const { topic, difficulty, questionCount } = body;

    fallbackTopic = topic || fallbackTopic;
    fallbackDifficulty = ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : fallbackDifficulty;
    fallbackCount = Math.min(Math.max(Number(questionCount) || 5, 1), 15);

    if (!topic || !String(topic).trim()) {
      return NextResponse.json({ error: "Valid topic parameter is required" }, { status: 400 });
    }

    if (!genAI || !apiKey) {
      console.warn("FALLBACK MODE USED: Model unconfigured or API_KEY missing.");
      return NextResponse.json({ questions: getMockQuestions(fallbackTopic, fallbackDifficulty, fallbackCount) });
    }

    console.log("Calling real AI");

    const prompt = `
      You are an expert technical interviewer. Generate exactly ${fallbackCount} training questions about "${fallbackTopic}" at a "${fallbackDifficulty}" difficulty level.
      IMPORTANT: You must return ONLY raw JSON format. No markdown fences. No explanations outside the JSON array.
      
      Format the response exactly as this JSON structure:
      {
        "questions": [
          {
            "id": "q1",
            "type": "mcq",
            "prompt": "Question text here",
            "options": [
               { "id": "OPT_1", "text": "Option 1" },
               { "id": "OPT_2", "text": "Option 2" },
               { "id": "OPT_3", "text": "Option 3" },
               { "id": "OPT_4", "text": "Option 4" }
            ],
            "expectedAnswer": "OPT_2",
            "explanation": "Explanation for why OPT_2 is correct."
          }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL_NAME || "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    let output = result.response.text();

    console.log("AI response received");

    try {
      // Safely parse out any markdown blocks
      output = output.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(output);

      if (!parsedData || !Array.isArray(parsedData.questions)) {
         throw new Error("Missing questions array structurally");
      }

      // Re-map with secure IDs
      const normalizedQs = parsedData.questions.map((q: any, i: number) => ({
        ...q,
        id: `AI_SYNTH_LIVE_${Math.random().toString(36).substring(7)}_${i}`
      }));

      return NextResponse.json({ questions: normalizedQs });
    } catch (parseErr) {
      console.error("Parse Error:", parseErr);
      console.log("Using fallback");
      console.log("FALLBACK MODE USED");
      return NextResponse.json({ questions: getMockQuestions(fallbackTopic, fallbackDifficulty, fallbackCount) });
    }

  } catch (err: any) {
    console.error("[API Generate Network Error]", err);
    console.log("Using fallback");
    console.log("FALLBACK MODE USED");
    return NextResponse.json({ questions: getMockQuestions(fallbackTopic, fallbackDifficulty, fallbackCount) });
  }
}

function getMockQuestions(topic: string, activeDifficulty: string, numQuestions: number) {
   return Array.from({ length: numQuestions }).map((_, i) => ({
      id: `AI_SYNTH_ENDPOINT_${Math.random().toString(36).substring(7)}_${i}`,
      type: "mcq",
      prompt: `[ SERVER API MOCK ]: Given an advanced implementation utilizing ${activeDifficulty} patterns in ${topic}, which of the following isolates leakage best? (Variant ${i + 1})`,
      options: [
        { id: "OPT_1", text: "Standardized execution paradigm." },
        { id: "OPT_2", text: "Optimized heuristic data structures." },
        { id: "OPT_3", text: "Fallback logic branches." },
        { id: "OPT_4", text: "Kernel panic manual dump." }
      ],
      expectedAnswer: i % 2 === 0 ? "OPT_2" : "OPT_1",
      explanation: `In a ${activeDifficulty} server interacting with ${topic}, this response optimizes latency without producing breaking structural changes.`
   }));
}
