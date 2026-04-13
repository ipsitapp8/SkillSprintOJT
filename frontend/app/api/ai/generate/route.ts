import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini safely, but DO NOT CRASH if the API key is missing
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  let fallbackTopic = "Default Training";
  let fallbackDifficulty = "Medium";
  let fallbackCount = 5;

  try {
    const body = await request.json();
    const { topic, difficulty, count } = body;

    // Normalizing parameters
    if (!topic || !String(topic).trim()) {
      return NextResponse.json({ error: "Valid topic parameter is required" }, { status: 400 });
    }
    
    fallbackTopic = topic;
    const numQuestions = Math.min(Math.max(Number(count) || 5, 1), 15);
    fallbackCount = numQuestions;
    const activeDifficulty = ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : "Medium";
    fallbackDifficulty = activeDifficulty;

    // 1. Check if AI Provider is properly configured
    if (!genAI || !apiKey) {
      console.warn("[AI Provider] Model unconfigured or GEMINI_API_KEY missing. Diverting to mock fallback.");
      return NextResponse.json({ 
        questions: getMockQuestions(fallbackTopic, activeDifficulty, numQuestions),
        isRealAI: false,
        provider: "Mock Fallback"
      });
    }

    // 2. Format systemic prompt
    const prompt = `
      You are an expert technical interviewer. Generate exactly ${numQuestions} training questions about "${topic}" at a "${activeDifficulty}" difficulty level.
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

    // 3. Request LLM execution
    console.log(`[AI Provider] Requesting ${numQuestions} questions for ${topic}`);
    const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL_NAME || "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    let output = result.response.text();

    // 4. Force parse JSON outputs
    try {
      // Clean accidental markdown fences that modern LLMs sometimes prepend 
      output = output.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(output);

      // Validate structural response shape
      if (!parsedData || !Array.isArray(parsedData.questions)) {
         throw new Error("Missing questions array in JSON response");
      }

      // Add guaranteed randomized IDs to normalized inputs preventing overlaps
      const normalizedQs = parsedData.questions.map((q: any, index: number) => ({
        ...q,
        id: `AI_SYNTH_${Math.random().toString(36).substring(7)}_${index}`
      }));

      return NextResponse.json({ 
        questions: normalizedQs,
        isRealAI: true,
        provider: "Google Gemini"
      });
    } catch (parseErr) {
      console.error("[AI Parser Error] Failed to reconstruct AI output strictly:", parseErr);
      // Failsafe immediately triggers
      return NextResponse.json({ 
        questions: getMockQuestions(fallbackTopic, fallbackDifficulty, fallbackCount),
        isRealAI: false,
        provider: "Mock Fallback (Parse Error)"
      });
    }

  } catch (err: any) {
    console.error("[AI Generation Network Error]:", err);
    // Absolute Failsafe triggers if rate limit exceeded or backend unreachable
    return NextResponse.json({ 
      questions: getMockQuestions(fallbackTopic, fallbackDifficulty, fallbackCount),
      isRealAI: false,
      provider: "Mock Fallback (Network Error)"
    });
  }
}

function getMockQuestions(topic: string, activeDifficulty: string, numQuestions: number) {
   // Generative AI Normalization Mock Loop
   return Array.from({ length: numQuestions }).map((_, i) => ({
      id: `AI_SYNTH_${Math.random().toString(36).substring(7)}`,
      type: "mcq", // Default normalized supported type
      prompt: `[ OFFLINE MOCK ]: Given an advanced architectural implementation utilizing ${activeDifficulty} patterns in ${topic}, which of the following best isolates process leakages? (Variant ${i + 1})`,
      options: [
        { id: "OPT_1", text: "Implement a standardized execution paradigm wrapper." },
        { id: "OPT_2", text: "Utilize an optimized heuristic data structure approach." },
        { id: "OPT_3", text: "Fallback to deprecated logic branches explicitly." },
        { id: "OPT_4", text: "Manually force a system kernel panic to dump logs." }
      ],
      expectedAnswer: i % 2 === 0 ? "OPT_2" : "OPT_1",
      explanation: `In a ${activeDifficulty} level system interacting with ${topic}, the chosen response optimizes for neural latency locally without generating breaking changes.`
   }));
}
