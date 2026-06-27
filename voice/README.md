# Voice / Intake — P1 (Iason)

The front door. An **SLNG** voice agent qualifies a caller; **Gemini** turns the conversation into a
`lead` JSON that matches [`../contracts/lead.schema.json`](../contracts/lead.schema.json).

- **In:** a phone/voice call.
- **Out:** a validated `lead` JSON (see `../contracts/lead.example.json`), handed to P2's Attio write.
- **Wiki:** the full conversation flow is in `../wiki/product/voice-intake.md`; the schema mapping in `../wiki/product/data-model.md`.

## The core 6 (BUY path, ~75s)
`name → buy/sell/rent → area → house/flat → beds → budget → must_haves` + (email + consent).
One question per turn, confirm-and-advance, echo back at the end ("So that's a 2-bed flat in
Shoreditch up to £600k — perfect."). Detect intent early and branch; never ask a seller buy-questions.

## Open architecture question (⏳ research in flight)
**Where does Gemini sit relative to SLNG?** Two shapes:
1. **Gemini = SLNG's brain** — SLNG drives the call using Gemini as the configured LLM; we read out
   extracted variables / a transcript via webhook.
2. **Gemini = post-call parser** — SLNG handles the conversation, then we POST the transcript to Gemini
   with `responseSchema` = the lead schema, get back strict JSON.

Don't hard-block on this — see the de-risk brief (coming from the background research). Either way the
**output is the same lead JSON**, so build the Gemini→JSON step against `lead.example.json` first.

## Demo-safe fallback
If SLNG intake is shaky by the freeze (17:30), capture the same answers via a **typed form** → emit the
**same `lead` JSON** (`source: "form"`). Every downstream stage is unaffected.

## Run it (TypeScript) — ✅ working offline
Pipeline: **SLNG call-end → Gemini → validated lead JSON → Attio upsert.** Runs with **no keys** (offline mock).

```bash
cd voice
npm install
npm run extract                      # extract a lead from sample-transcript.txt
npm run extract -- --file my.txt     # ...from your own transcript
npm run create-agent                 # create the SLNG inbound agent (dry-run w/o VOICEAI_API_KEY)
npm run dev                          # webhook server on :3000  (POST /slng/call-end)
npm run typecheck
```

- Set `GEMINI_API_KEY` in the repo-root `.env` to switch extraction from the offline mock to real
  **Gemini** (`gemini-2.5-flash`, structured output via `responseSchema`).
- Set `ATTIO_API_KEY` to switch the Attio write from **dry-run** (logs the payload) to a live upsert.
  ⚠️ Attribute slugs + value shapes in `src/attio.ts` must match Alex's Attio model — confirm with one real PUT.
- `src/`: `cli.ts` (extract) · `server.ts` (call_end webhook) · `gemini.ts` (extractor) · `mock.ts` (offline) ·
  `slng.ts` (SLNG client) · `create-agent.ts` (provision the agent) · `attio.ts` (write, dedupe on email) ·
  `lead.ts` (types + contract validation). Agent prompt lives in `agent/system-prompt.txt` + `greeting.txt`.
- **SLNG setup:** see `slng-agent.md`. Docs vendored via `npx skills add slng-ai/skills` → `.agents/skills/` (gitignored).

## First hour
1. Stand up the SLNG account + a callable agent that answers and runs the 6-question script.
2. Build the **Gemini → lead JSON** step in isolation against `lead.example.json` (force structured output). ✅ done — `npm run extract` with a key.
3. Agree the hand-off trigger/endpoint with P2 (how the lead JSON reaches the Attio write client). ✅ seam built — `POST /slng/call-end` → `upsertLead`.
4. **At the booth:** confirm SLNG's call-end payload shape and wire it into `server.ts` (the `transcript` extraction). → `../wiki/build/derisk.md`.
