import "./env";

// SLNG Voice Agents client. Base + auth per the official slng-ai skill (.agents/skills/agents).
// Agents API is a SEPARATE base from the unified TTS/STT API. Auth = VOICEAI_API_KEY.
const AGENTS_BASE = process.env.VOICEAI_AGENTS_BASE_URL || "https://api.agents.slng.ai";
const KEY = process.env.VOICEAI_API_KEY;
export const SLNG_CONFIGURED = !!KEY;

export interface SlngModels {
  stt: string;
  llm: string;
  tts: string;
  tts_voice: string;
}

// llm MUST be one of the provisioned IDs (the agents skill lists exactly these — Gemini is
// not available, which is why we structure the lead with Gemini AFTER the call).
export const DEFAULT_MODELS: SlngModels = {
  stt: "slng/deepgram/nova:3-en",
  llm: process.env.SLNG_LLM || "groq/openai/gpt-oss-120b",
  tts: "slng/deepgram/aura:2-en",
  tts_voice: "aura-2-thalia-en",
};

export interface CreateAgentInput {
  name: string;
  greeting: string;
  system_prompt: string;
  language?: string;
  region?: string;
  models?: SlngModels;
  tools?: unknown[];
  template_defaults?: Record<string, string>;
  enable_interruptions?: boolean;
}

function authHeaders(): Record<string, string> {
  if (!KEY) throw new Error("VOICEAI_API_KEY not set — get one at https://slng.ai/dashboard/api-keys");
  return { authorization: `Bearer ${KEY}`, "content-type": "application/json" };
}

async function call(path: string, init: { method: string; body?: string }): Promise<any> {
  const res = await fetch(`${AGENTS_BASE}${path}`, { method: init.method, headers: authHeaders(), body: init.body });
  if (!res.ok) throw new Error(`SLNG ${res.status} ${init.method} ${path}: ${await res.text()}`);
  return res.status === 204 ? {} : res.json();
}

export function createAgent(input: CreateAgentInput): Promise<any> {
  const body = {
    language: "en",
    region: process.env.SLNG_REGION || "eu-central", // us-east | eu-central | ap-south
    models: DEFAULT_MODELS,
    ...input,
  };
  return call("/v1/agents", { method: "POST", body: JSON.stringify(body) });
}

/** Outbound call (used by P3's n8n callback). Requires telephony configured in the SLNG dashboard. */
export function dispatchCall(agentId: string, phoneNumber: string, args?: Record<string, string>): Promise<any> {
  return call(`/v1/agents/${agentId}/calls`, {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber, arguments: args }),
  });
}

/** Get a finished call — response includes `status`, `duration_seconds`, `transcript`, `tool_calls`. */
export function getCall(agentId: string, callId: string): Promise<any> {
  return call(`/v1/agents/${agentId}/calls/${callId}`, { method: "GET" });
}
