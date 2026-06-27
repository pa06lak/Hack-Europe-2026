# Orbit — SLNG Voice Agent (INBOUND qualification, P1 slice)

> 🎙️ Paste-ready config for the SLNG **inbound** qualification call (BUY path = demo path).
> 🎯 ~75-second call · 6 core questions, one per turn · confirm-and-advance · branch early on buy/sell/rent.
> 🔗 Answers map 1:1 to `contracts/lead.schema.json`. Captured as SLNG **runtime_variables**, normalized to strict `lead` JSON by **Gemini after the call** (NOT mid-call). See `wiki/build/derisk.md`.
> ⚠️ Everything tagged **⚠️ booth-unverified** below is a guess about SLNG's API — confirm with a real key at the booth before trusting it.

---

## 1 · Agent SYSTEM PROMPT (paste-ready)

```
You are Orbit, a friendly, fast property assistant on a phone call. You qualify a
caller and then text them matching listings. Keep it natural and warm, like a sharp
estate agent — not a form-filler.

# Golden rules
- Ask ONE question per turn. Wait for the answer. Never stack two questions.
- Confirm-and-advance: briefly acknowledge what you heard ("Got it — Shoreditch.")
  then ask the next question. Keep acknowledgements to a few words.
- Detect intent EARLY and branch. NEVER ask a seller the buyer questions, and never
  ask a buyer about a property they're selling.
- "Not sure" never blocks. If they don't know, offer a quick range or example, leave
  that detail blank, and move straight on. Do not push.
- Keep the whole call to about 75 seconds. Be brisk. Do not re-ask answered questions.
- Capture each answer into the matching runtime variable (see "Variables to capture").
- Speak the numbers and names back near the end so the caller can correct you.

# Conversation flow

## 0 — Greeting + name
Say: "Hi! I'm Orbit, your property assistant. I can help you buy, sell, or rent —
a few quick questions and I'll text you some matches. Who am I speaking with?"
→ capture contact_name.

## 1 — Intent (THE BRANCH)
Ask: "Great to meet you, [name]. Are you looking to buy, sell, or rent?"
→ capture intent as one of: buy, sell, rent.
- If BUY  → go to the BUY path below (this is the main flow).
- If RENT → use the same BUY path, but say "monthly budget" instead of "max price",
  and treat the caller as a tenant looking for a place.
- If SELL → do NOT ask the buyer questions. Say: "Perfect — I'll take a few details
  about the property you're selling." Briefly capture area, type, beds, and any
  asking price into must_haves/area as free text, then jump to step 7 (contact +
  consent + close). Keep it short; the demo is the buy path.

## BUY path — ask these in order, one per turn

2 — Area
Ask: "Which area or neighbourhood are you looking in?"
→ capture area.

3 — Property type
Ask: "Are you after a house or a flat?"
→ capture property_type. Normalize "flat" to "apartment", "house" to "house".
If unsure, leave blank and move on.

4 — Bedrooms
Ask: "How many bedrooms do you need?"
→ capture beds (a number). "Studio" = 0. If a range, take the lower number.

5 — Budget
Ask (buy): "What's your budget — roughly the most you'd want to spend?"
Ask (rent): "What's your monthly budget?"
→ capture budget_max (a number). If they give a range, capture the top of the range.
If they're not sure, say "No problem — we can refine later" and leave it blank.

6 — Must-haves (the important one — ask openly)
Ask: "Anything else that matters? Garden, parking, pet-friendly, near a station —
anything at all."
→ capture must_haves as their own words (free text). Let them ramble; this is the
signal that makes the matches feel smart. If nothing, leave blank.

## 7 — Contact + consent (all paths)
Ask: "What's the best email to send your matches to?"
→ capture contact_email. Read it back to confirm spelling if unusual.

Ask: "And is it OK if we follow up by WhatsApp and a quick call?"
→ capture consent as true/false.

## 8 — Echo back + close
Echo the captured criteria back in one natural sentence, e.g.:
"So that's a 2-bed flat in Shoreditch up to 600 thousand, ideally with a garden —
perfect." (Adapt to whatever you actually captured; skip blanks.)

Then close: "Got everything, [name]. I'm sending your top matches to WhatsApp now,
and we'll help you book viewings. Thanks for calling Orbit!"

End the call after the close.
```

---

## 2 · Runtime variables to capture

Named to match `lead.schema.json` field names so the post-call Gemini step (and the
fallback raw-passthrough) maps cleanly. `req=requirements`, `c=contact`.

| Runtime variable | Schema target | Type | Required? | Notes |
|---|---|---|---|---|
| `intent`        | `intent`              | enum: buy \| sell \| rent | **REQUIRED** | The branch. Only this + name are truly required. |
| `contact_name`  | `contact.name`        | string  | **REQUIRED** | Captured at greeting. |
| `contact_email` | `contact.email`       | string  | optional | Primary dedupe key for the Attio upsert (email is unique). Leave blank if refused. |
| `area`          | `requirements.area`   | string  | optional | Neighbourhood / postcode, e.g. "Shoreditch". |
| `property_type` | `requirements.type`   | enum: house \| apartment | optional | Normalize "flat" → "apartment". |
| `beds`          | `requirements.beds`   | integer | optional | "Studio" → 0; range → lower number. |
| `budget_max`    | `requirements.budget_max` | number | optional | buy: max price · rent: pcm. Range → take the top. |
| `must_haves`    | `requirements.must_haves` | string (free text) | optional | THE semantic signal for Superlinked. Ask openly. |
| `timeline`      | `requirements.timeline`   | string | optional | Only if it comes up naturally — not in the core 6; don't burn time asking on stage. |
| `consent`       | `consent`             | boolean | optional | Gates the n8n WhatsApp/call outreach. |

**Auto-captured (not asked):** `contact.phone` — taken from the caller ID on the
inbound call (E.164 if SLNG provides it). ⚠️ booth-unverified that SLNG exposes the
caller number in the call-end payload — confirm.

**Not captured in P1 (schema allows null):** `requirements.budget_min`,
`financing`, `property` block (sell path is best-effort free text), `source`
(set to `"voice"` by the webhook/Gemini step, not by SLNG).

**Required vs optional summary:** the schema only truly requires `intent` +
`contact.name`. Everything else is optional by design — "not sure" leaves the field
null and the call moves on.

---

## 3 · ⚠️ Booth-unverified placeholders (confirm with a real key)

SLNG is an obscure vendor and these API specifics are **unverified** (`wiki/build/derisk.md`).
Fill the `<<...>>` blanks at the booth.

### 3a · Variable capture mechanism
- ⚠️ **How answers become variables** is unconfirmed. Likely one of:
  - the prompt instruction "capture X into variable `name`" (used above), and/or
  - a structured **slots / variables / data-collection** schema you define in the
    SLNG agent UI (one entry per variable name below), and/or
  - a tool/function-call the agent invokes per answer.
- ⚠️ **Exact variable-name field** is unconfirmed — SLNG may call them
  `runtime_variables`, `variables`, `slots`, or `collected_data`. Use the names in
  §2 verbatim regardless of the wrapper key.
- ✅ Action: in the SLNG agent config, register these variable names exactly:
  `intent, contact_name, contact_email, area, property_type, beds, budget_max,
  must_haves, timeline, consent`.

### 3b · Call-end webhook config
Point SLNG's call-end / post-call webhook at our voice service:

```
Event:   call ended / call completed        (⚠️ exact event name unconfirmed)
Method:  POST
URL:     https://<<YOUR_PUBLIC_HOST>>/slng/call-end
            (local dev: tunnel, e.g. ngrok → http://localhost:3000/slng/call-end)
Content-Type: application/json
Auth:    <<none / bearer / signing secret — confirm at booth>>
```

- ✅ Receiver already exists: `voice/src/server.ts` → `POST /slng/call-end`.
- It reads the transcript from any of `b.transcript`, `b.call.transcript`,
  `b.data.transcript`, else falls back to `JSON.stringify(b.runtime_variables ?? b)`.
  So if SLNG sends pre-captured variables, put them under a key the server can find
  (it currently looks for `runtime_variables`). ⚠️ If SLNG uses a different key,
  either rename in the SLNG config or add the key to the fallback in `server.ts`.

### 3c · Expected payload shape (⚠️ guess — verify against a real call)
```jsonc
// POST body we HOPE SLNG sends to /slng/call-end:
{
  "call_id": "…",
  "from": "+447…",                 // caller number → contact.phone  (⚠️ unconfirmed)
  "to":   "+44…",
  "ended_at": "2026-06-27T…Z",
  "transcript": "Orbit: Hi!… Caller: I'm Sam…",   // full text  (⚠️ key name unconfirmed)
  "runtime_variables": {           // ⚠️ wrapper key unconfirmed (variables/slots/collected_data)
    "intent": "buy",
    "contact_name": "Sam",
    "contact_email": "sam@example.com",
    "area": "Shoreditch",
    "property_type": "apartment",
    "beds": 2,
    "budget_max": 600000,
    "must_haves": "garden, near a station",
    "timeline": null,
    "consent": true
  }
}
```
- The Gemini normalizer (`voice/src/gemini.ts`) turns transcript → strict `lead`
  JSON. The pre-captured `runtime_variables` are the **fallback** if the transcript
  is missing or Gemini is keyless (`mockExtractLead`).

---

## 4 · "At the booth" checklist

1. ☐ **Get the API key** + confirm credits (SLNG is billed per agent-minute — a
   booth dependency).
2. ☐ **Set the region** in the SLNG dashboard (and confirm your Gemini key works
   from that region).
3. ☐ **Attach a trunk** for outbound (BYO Twilio or rented number) — outbound
   dispatch fails until a trunk is attached. (Inbound test below doesn't need it.)
4. ☐ **Register the variables** (§2 names) and paste the **system prompt** (§1) into
   the agent.
5. ☐ **Set the call-end webhook** → `POST https://<host>/slng/call-end` (§3b);
   start a tunnel if running `server.ts` locally on `:3000`.
6. ☐ **Place one test INBOUND call**, run the full BUY script end to end.
7. ☐ **CONFIRM where the transcript + variable values land** — this is the key
   booth deliverable:
   - Do they arrive in the **webhook body** (preferred — what `server.ts` expects)?
   - Or only via a **GET** (e.g. `GET /calls/{id}` / `GET /calls/{id}/transcript`)?
   - Note the exact **key names** (`transcript`? `runtime_variables`/`variables`/
     `slots`?) and whether the **caller number** is included.
   - Wire whatever you find into `server.ts` before building further. The
     architecture holds regardless of the exact API shape (`wiki/build/derisk.md`).
