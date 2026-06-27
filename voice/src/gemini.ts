import "./env";
import type { Lead } from "./lead";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Gemini uses an OpenAPI-subset schema (uppercase types, `nullable`, not JSON-Schema
// type-arrays). We constrain generation with this, then validate the OUTPUT against the
// strict contract in lead.ts — loose generate, strict verify.
export const geminiLeadSchema = {
  type: "OBJECT",
  properties: {
    intent: { type: "STRING", enum: ["buy", "sell", "rent"] },
    contact: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        phone: { type: "STRING", nullable: true },
        email: { type: "STRING", nullable: true },
      },
      required: ["name"],
    },
    requirements: {
      type: "OBJECT",
      properties: {
        type: { type: "STRING", enum: ["house", "apartment"], nullable: true },
        area: { type: "STRING", nullable: true },
        budget_min: { type: "NUMBER", nullable: true },
        budget_max: { type: "NUMBER", nullable: true },
        beds: { type: "INTEGER", nullable: true },
        must_haves: { type: "STRING", nullable: true },
        timeline: { type: "STRING", nullable: true },
      },
    },
    financing: { type: "STRING", nullable: true },
    consent: { type: "BOOLEAN", nullable: true },
  },
  required: ["intent", "contact", "requirements"],
} as const;

export function buildExtractionPrompt(transcript: string): string {
  return `You are extracting a UK real-estate lead from a phone call transcript.
Return ONLY data supported by the transcript, matching the provided schema. Rules:
- intent: "buy" or "rent" if they want to find a property; "sell" if they have one to sell.
- Use null for anything not clearly stated. Do NOT invent names, phones, emails, areas, or budgets.
- budget_max: top of budget as a GBP number ("around 600k" -> 600000). budget_min only if a range is given.
- beds: integer count of bedrooms ("two-bed" -> 2).
- property_type: "house" or "apartment" (treat "flat" as "apartment").
- must_haves: short free-text of extra wants (garden, parking, balcony, near a station, pet-friendly...). null if none.

Transcript:
"""
${transcript}
"""`;
}

export async function extractLeadWithGemini(transcript: string): Promise<Lead> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set (cp .env.example .env and fill it in)");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
    key
  )}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: buildExtractionPrompt(transcript) }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiLeadSchema,
      temperature: 0,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

  const data: any = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content: " + JSON.stringify(data).slice(0, 400));

  const lead = JSON.parse(text) as Lead;
  lead.source = "voice";
  return lead;
}
