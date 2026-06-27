# Orbit — SLNG Voice Agent (P1)

> ✅ **Verified** against the official `slng-ai/skills` package (`.agents/skills/agents`). The earlier
> booth-guesses are resolved. **Source of truth for the prompt:** `voice/agent/system-prompt.txt` +
> `greeting.txt`. Provision the agent with `npm run create-agent` (dry-runs without a key).

## What SLNG is
- Voice Agents API. **Base:** `https://api.agents.slng.ai` · **Auth:** `Authorization: Bearer $VOICEAI_API_KEY`.
- SLNG runs the **whole call** (STT + LLM + TTS). The agent **LLM is a fixed list** — **Gemini is not one** —
  so we structure the lead with Gemini **after** the call. Provisioned LLMs: `groq/openai/gpt-oss-120b`
  (default), `bedrock-mantle/nvidia.nemotron-super-3-120b`, `bedrock-mantle/nvidia.nemotron-nano-3-30b`.

## How it's wired (verified)
1. `npm run create-agent` → `POST /v1/agents` with our greeting + system prompt + models + **one System webhook tool**.
2. The System webhook fires on **`call_end`** and POSTs to `SLNG_WEBHOOK_URL` (our `/slng/call-end`) with:
   `transcript` (source `transcript_messages`), `phone_number` (caller ID), `call_id`.
3. `server.ts` receives it → **Gemini** structures the transcript → `lead` JSON → **Attio**.
   Fallback: `GET /v1/agents/{id}/calls/{id}` returns the transcript if the webhook didn't carry it.
4. **Outbound callback (P3):** `POST /v1/agents/{id}/calls {phone_number}` via `slng.dispatchCall` — needs a
   telephony number connected in the SLNG dashboard.

## Why a System webhook (not an LLM tool) for capture
The voice LLM is small and unreliable at triggering tool calls; **lifecycle-event System webhooks fire
regardless of the conversation**. `transcript_messages` delivers the whole conversation; `phone_number`
gives caller ID. The full tool JSON is built in `src/create-agent.ts` — run it to see/emit it.

## Template variables
`{{vars}}` personalize **outbound** calls (passed as `arguments` at dispatch) or set inbound defaults —
they are **not** how we capture answers. Inbound qualification needs none; we capture via the transcript.

## At the booth — checklist
1. ☐ Get `VOICEAI_API_KEY` → https://slng.ai/dashboard/api-keys → into repo-root `.env`.
2. ☐ Validate (no credits used):
   `curl -sS -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $VOICEAI_API_KEY" https://api.slng.ai/v1/me` → `200`.
3. ☐ Set `SLNG_REGION` (`eu-central`) and `SLNG_WEBHOOK_URL` = a public tunnel to `/slng/call-end`
   (`ngrok http 3000` → use the https URL + `/slng/call-end`).
4. ☐ `npm run dev` (server) + tunnel up, then `npm run create-agent` → copy the agent id → `SLNG_AGENT_ID` in `.env`.
5. ☐ Connect a **telephony number** in the dashboard (Telephony) for inbound (and outbound).
6. ☐ Place one test call; confirm `/slng/call-end` logs a transcript + `phone_number`, and the lead writes to Attio.

## Still confirm hands-on
- The exact JSON **envelope** of the `call_end` webhook body (where `transcript` / `phone_number` sit).
  `server.ts` reads them tolerantly (`b.arguments` / `b.parameters` / top-level) — tweak if the real shape differs.
- Telephony number provisioning (rent in dashboard vs BYO trunk). Outbound needs it; the inbound test does not.

## Related
`voice/src/slng.ts` · `voice/src/create-agent.ts` · `voice/src/server.ts` · `voice/agent/` · `wiki/build/derisk.md`
