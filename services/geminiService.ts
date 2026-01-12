import { GoogleGenAI } from "@google/genai";

export async function getMathInsight(expression: string, result: string) {
  // Always initialize right before use with the correct property name
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very short (max 15 words) fun fact or interesting mathematical perspective about the result "${result}" from the calculation "${expression}". Keep it witty and scientific.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "Calculation complete.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Math is the language of the universe.";
  }
}