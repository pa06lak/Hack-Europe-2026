import { GoogleGenAI } from "@google/genai";
import type { Lead } from "./types"; // or wherever your Lead type lives

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You extract structured real-estate lead data from a call transcript.
Return ONLY valid JSON matching this shape:
{
  "intent": "buy" | "rent",
  "area": string,
  "propertyType": string,
  "beds": number,
  "budget": number,
  "mustHaves": string[]
}`;

export async function extractLead(transcript: string): Promise<Lead> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "user", parts: [{ text: transcript }] },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");

  return JSON.parse(text) as Lead;
}
