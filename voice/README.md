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

## First hour
1. Stand up the SLNG account + a callable agent that answers and runs the 6-question script.
2. Build the **Gemini → lead JSON** step in isolation against `lead.example.json` (force structured output).
3. Agree the hand-off trigger/endpoint with P2 (how the lead JSON reaches the Attio write client).
