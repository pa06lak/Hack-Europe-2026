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

## Run it (TypeScript) — seeder + REST client
Runs as a **dry run** (logs the requests) with no key, so you can see the exact write shapes first.

```bash
cd attio
npm install
npm run seed          # upsert data/listings.seed.json into Attio Listings (dry-run w/o key)
npm run typecheck
```

- Set `ATTIO_API_KEY` in the repo-root `.env` to write for real.
- Dedupe needs a **unique** attribute: create `listing_id` (text, unique) on Listings, or override
  `ATTIO_LISTINGS_OBJECT` / `ATTIO_LISTING_MATCH`. Lead upsert dedupes on **email** (`../voice/src/attio.ts`).
- `src/client.ts` exposes `assertRecord` / `createRecord` / `listRecords` — reuse for the lead write + P3's reads.

## First hour
1. Free Attio workspace → create the objects above (+ a unique `listing_id` on Listings).
2. `npm run seed` (dry-run first to confirm shapes, then with `ATTIO_API_KEY`).
3. Confirm the attribute slugs back to P1/P3 so `voice/src/attio.ts` + the n8n flow write the right fields.
