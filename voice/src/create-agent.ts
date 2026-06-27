import "./env";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createAgent, DEFAULT_MODELS, SLNG_CONFIGURED } from "./slng";

// Creates the Orbit INBOUND qualification agent in SLNG, with a System webhook that fires
// on call_end and POSTs the transcript + caller number to our /slng/call-end service.
// Dry-runs (prints the agent definition) without VOICEAI_API_KEY or with --dry.

const AGENT_DIR = path.resolve(__dirname, "../agent");
const SYSTEM_PROMPT = fs.readFileSync(path.join(AGENT_DIR, "system-prompt.txt"), "utf8").trim();
const GREETING = fs.readFileSync(path.join(AGENT_DIR, "greeting.txt"), "utf8").trim();

const WEBHOOK_URL = process.env.SLNG_WEBHOOK_URL || "https://<your-public-host>/slng/call-end";

// System webhook tool: on call_end, send the transcript + caller number to our service.
// Source types per .agents/skills/agent-prompt (transcript_messages, phone_number, call_id).
const callEndTool = {
  type: "webhook",
  id: randomUUID(),
  name: "log_lead_on_call_end",
  description: "Sends the full call transcript and caller number to the Orbit lead service when the call ends.",
  url: WEBHOOK_URL,
  source: "system",
  execution_policy: { pre_action_message: { enabled: false, text: "" } },
  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      transcript: { type: "object", description: "Full call transcript" },
      phone_number: { type: "string", description: "Caller phone number" },
      call_id: { type: "string", description: "Call identifier" },
    },
    required: ["transcript", "call_id"],
  },
  system: {
    triggers: [{ event: "call_end", source_tool_id: null }],
    arguments: [
      {
        name: "transcript",
        type: "transcript_messages",
        required: true,
        description: "Full call transcript",
        source: { type: "transcript_messages", max_messages: 2000, max_chars: 200000 },
      },
      { name: "phone_number", type: "string", required: false, description: "Caller number", source: { type: "phone_number" } },
      { name: "call_id", type: "string", required: true, description: "Call identifier", source: { type: "call_id" } },
    ],
  },
  timeout_seconds: 2,
  wait_for_response: false,
  show_results_to_llm: false,
};

// The greeting + system prompt reference {{agency_name}}; provide a default so it
// resolves on inbound calls (override per-deployment with AGENCY_NAME).
const agentDef = {
  name: "Orbit — Property Intake",
  greeting: GREETING,
  system_prompt: SYSTEM_PROMPT,
  language: "en",
  region: process.env.SLNG_REGION || "eu-central",
  models: DEFAULT_MODELS,
  template_defaults: { agency_name: process.env.AGENCY_NAME || "Marlowe Estates" },
  tools: [callEndTool],
};

async function main() {
  const dry = !SLNG_CONFIGURED || process.argv.includes("--dry");
  if (dry) {
    console.error(`[create-agent] DRY RUN ${SLNG_CONFIGURED ? "(--dry)" : "(no VOICEAI_API_KEY)"} — would POST /v1/agents:`);
    console.log(JSON.stringify(agentDef, null, 2));
    if (!process.env.SLNG_WEBHOOK_URL)
      console.error("\n⚠️  Set SLNG_WEBHOOK_URL to your public /slng/call-end URL (e.g. an ngrok tunnel) before creating for real.");
    return;
  }
  const agent = await createAgent(agentDef);
  console.error(`[create-agent] ✓ created agent ${agent.id}  (${agent.name})`);
  console.error(`  → put SLNG_AGENT_ID=${agent.id} in .env for outbound calls`);
  console.log(JSON.stringify({ id: agent.id, name: agent.name }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
