---
title: "Voice Intake — the questions"
type: product
status: working
date_updated: 2026-06-27
owner: iason
---

# Voice Intake — the questions

> 🎙️ Owner: **Iason** (P1, `[[team]]`). The SLNG voice agent's conversation flow — what it asks to qualify a lead.
> 🔗 **The answers ARE the lead schema** — this is the contract with **Alex's** Attio model (`[[data-model]]`). Agree it together in the first 30 min, or P1 and P2 drift.
> 🎯 ~6–8 questions, **one per turn**, ~75-second call. Protect the demo (`[[demo]]`).

## Conversation flow

### 0 · Greeting + name
- 🗣️ "Hi! I'm Orbit, your property assistant. I can help you buy, sell, or rent — a few quick questions and I'll text you some matches. Who am I speaking with?"
- → `contact.name` · (phone auto-captured from the call)

### 1 · Intent — the branch
- 🗣️ "Are you looking to **buy**, **sell**, or **rent**?" → `intent` ∈ {buy, sell, rent}
- if rent: 🗣️ "A place to live, or letting one out?" → tenant vs landlord (🤔 for the demo, treat as tenant)

### 2 · Criteria — **BUY / RENT** (looking for a property → feeds Superlinked 🔎)

| Ask | Captures | 🔎 Superlinked |
|---|---|---|
| "Which area or neighbourhood?" | `req.area` | ✅ |
| "House or flat?" | `req.property_type` | ✅ |
| "How many bedrooms?" | `req.beds` | ✅ |
| "What's your budget?" (buy: max/range · rent: pcm) | `req.budget_max` (+`budget_min`) | ✅ |
| "Any must-haves? Garden, parking, pet-friendly, near a station…" | `req.must_haves` (free text) | ✅✅ **the semantic signal** |
| "When are you hoping to move?" | `req.timeline` | — qualifier |
| *(buy, optional)* "Cash or mortgage — agreement in principle?" | `lead.financing` | — hot/cold |

### 2 · Criteria — **SELL / LET** (has a property)

| Ask | Captures |
|---|---|
| "Where's the property — area/postcode?" | `property.area` |
| "What type, and how many bedrooms?" | `property.type`, `property.beds` |
| "Any standout features or recent work?" | `property.features` |
| "A price in mind?" | `property.asking_price` |
| "How soon, and what's prompting the move?" | `property.timeline`, `lead.motivation` |

### 3 · Contact + consent + close (all paths)
- 🗣️ "Best email to send these to?" → `contact.email`
- 🗣️ "OK if we follow up by WhatsApp and a quick call?" → `lead.consent` ✅ (cues Palak's n8n outreach, `[[architecture]]` stage 4)
- 🗣️ **Echo back:** "So that's a 2-bed flat in Shoreditch up to £600k — perfect." (validation + a great demo beat)
- 🗣️ Close: "Got everything, [name]. Sending your top matches to WhatsApp now, and we'll book viewings. Thanks!"

## The core 6 for the demo (BUY path)
`name → buy → area → property_type → beds → budget → must_haves` + (email + consent). ~75 sec. Everything else optional — **don't let the on-stage call run long.**

## Voice-design rules
- 🔨 One question per turn; **confirm-and-advance**.
- 🔨 **Detect intent early and branch** — never ask buy-questions to a seller.
- 🤔 "Not sure" never blocks — offer ranges/examples, leave the field null, move on.
- 💡 `must_haves` is the field that makes **Superlinked** look smart vs. a dumb filter — ask it openly ("anything else that matters?").
- 🔨 End with the handoff line ("sending to WhatsApp now") — the seam into `[[architecture]]` stage 4 (Palak / n8n).

## Open questions
- ❓ Demo on the **buy** path? (recommended — it leads cleanly to listing matches + outreach.)
- ❓ Confirm the field names **with Alex** so they match the Attio attributes exactly. → `[[data-model]]`

## Related
`[[data-model]]` (the schema contract) · `[[architecture]]` · `[[concept]]` · `[[team]]` · `[[demo]]`
