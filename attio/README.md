# Attio / Data — P2 (Alex) · the spine

**Attio = system of record.** Owns the object model + the write/read client + the seeded listings.
Everything else depends on this. Wiki: `../wiki/product/data-model.md`.

## Object model (create in Attio first)
- **Lead** (custom object, or standard People) — `name`, `phone`, `email`, `intent` (select: buy/sell/rent).
  Match key for upserts = `phone` (fallback `email`).
- **Requirements** — fold onto the Lead for speed: `property_type` (house/apartment), `area`,
  `budget_min`, `budget_max`, `beds`, `must_haves` (text), `timeline`. (Linked object only if it stays clean.)
- **Listings** — seed from [`../data/listings.seed.json`](../data/listings.seed.json) (~22):
  `type`, `area`, `price`, `beds`, `features`, `description`.
- **Outreach** — one row per touch: `channel` (call/whatsapp/telegram/email), `status` (sent/replied),
  `message`, link → Lead. (Fallback: Attio notes on the Lead.)

## Contract
Consume `../contracts/lead.schema.json`. Mapping table is in the data-model wiki page.

## Riskiest joins
- Upsert Requirements onto the **right** Lead (match on phone/email — no dupes).
- Write **MATCHED** listings back so P3's outreach can read them.

## Open (⏳ research in flight)
- **REST vs MCP** entry point — recommendation coming from the de-risk brief. Lean REST for n8n compatibility.
- **Attio → n8n trigger** — does an Attio automation webhook POST straight to n8n on new lead? (the P2↔P3 seam.)

## First hour
1. Free Attio workspace → create the objects above.
2. Seed the ~22 listings from `data/listings.seed.json`.
3. Write client: take a `lead` JSON, upsert Lead + Requirements (no dupes). Smoke-test read+write before anything downstream.
