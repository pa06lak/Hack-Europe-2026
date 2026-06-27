---
title: "Data Model — intake → Attio → match"
type: product
status: working
date_updated: 2026-06-27
owner: shared
---

# Data Model — intake → Attio → match

The data model for idea v4 (✅ `[[decisions]]`): a **voice-first real-estate lead engine** with a
**WhatsApp → swipe-app** payoff. Centred on **Attio objects** (the system of record), with **Attio's own
filtering** picking the listings for a lead. Kept minimal for a 6-hour build. See `[[architecture]]` for the
pipeline, `[[concept]]` for the why, `[[stack]]` for services/keys.

> 🤔 assumption: one demo workspace, one seeded listings set (~15–30, `[[overview]]` scope). The model
> only has to demo the loop — **call → qualified lead → matched listings → swipe → write back** — not be complete.
> ❓ open: exact Attio object/attribute set, standard-vs-custom, entry point (REST vs MCP). ✅ decided:
> the **swipe app (GitHub Pages) PATCHes the Attio person/Lead record directly** — pin *which attributes* it sets. → `[[decisions]]`.
> 🔧 **Schema follow-up (no code yet):** `contracts/lead.schema.json` still has `intent ∈ {buy, sell, rent}`;
> v4 wants **`{buy, rent, let}`** (drop sell). It also needs a place for **swipe verdict + opt-out** (below).

## Attio objects

- **Leads / Contacts** (standard People, or a custom Lead object) — the caller. Attrs: `name`, `phone`,
  `email`, `intent` (select: `buy` / `rent` / `let`), and a v4 **`status`** (`active` / `opted_out`) so the
  opt-out is visible. The match key for upserts.
- **Requirements** — what they want: `property_type` (`house` / `apartment`), `area`, `budget_min`,
  `budget_max`, `beds`, `timeline`. 🤔 attributes **on the Lead** for speed; or a linked object if it's clean.
- **Listings / Properties** — **seeded** (~15–30). Attrs: `type`, `area`, `price`, `beds`, `features`,
  `description`, and a v4 **`photo_url`** (the swipe cards need an image). This is what gets matched + rendered as cards.
- **Interest (on the person)** — ✅ v4 writes swipe results **directly onto the person/Lead record**: an
  `interested_listings` reference (the homes they swiped yes) — simplest for a static app to PATCH. (A separate
  per-(Lead,Listing) object with a `verdict` is the cleaner long-term shape; ⏭️ skip it for the 6h build.)
- **Outreach / Interactions** — one record per touchpoint: `channel` (`whatsapp` only for the demo),
  `ts`, `status` (`sent` / `replied`), `message` (the swipe-link copy). Logged per lead — proves the agent acted.

## Relationships

- `Lead -WANTS-> Requirements`  (attributes on Lead, or a record-reference)
- `Lead -MATCHED-> Listing(s)`  (top 3–5, written back as references — these become the swipe cards)
- `Lead -INTERESTED-> Listing(s)`  (v4: swipe "yes", PATCHed onto the person record directly by the app; `pass` is just omitted)
- `Outreach -TO-> Lead`  (each touchpoint links to its lead)
- `Listing -IN-> Area`  (area as a categorical attr; the join the match leans on)

> 🤔 The riskiest joins are **attaching Requirements to the right Lead** (upsert on phone/email first) and
> **writing the MATCHED listings back** so outreach can read them. See the seams in `[[architecture]]`.

## Intake JSON → Attio mapping (the contract — pin first)

**All three of us depend on this — agree it in the first 30 min.** Gemini turns the SLNG voice intake into
this structured lead; Attio/Data writes it; Orchestration reads it for outreach.

```json
{
  "intent": "buy",
  "contact":  { "name": "", "phone": "", "email": "" },
  "requirements": {
    "type": "apartment",
    "area": "Shoreditch",
    "budget_min": 0,
    "budget_max": 600000,
    "beds": 2,
    "timeline": "3 months"
  }
}
```

| Intake JSON | → Attio object.attribute |
|---|---|
| `intent` | `Lead.intent` (select `buy`/`rent`/`let`; ⏭️ sell dropped) |
| `contact.name` | `Lead.name` |
| `contact.phone` | `Lead.phone` (match key) |
| `contact.email` | `Lead.email` (match key) |
| `requirements.type` | `Requirements.property_type` |
| `requirements.area` | `Requirements.area` |
| `requirements.budget_min` / `budget_max` | `Requirements.budget_min` / `budget_max` |
| `requirements.beds` | `Requirements.beds` |
| `requirements.timeline` | `Requirements.timeline` |

## Match via Attio's native filtering ✅

✅ decided: **Attio's own filter/list functionality picks the top 3–5** — no Superlinked, no custom matcher
(`[[decisions]]`). Filter the seeded **Listings** on the lead's **Requirements**; run it as an Attio query
(n8n when building the swipe URL, or a P2 read query).

- **Numeric:** `price` within `budget_min`–`budget_max`; `beds` ≈ requested.
- **Categorical:** `type` (`house`/`apartment`), `area`.
- **Query** built from the Requirements: e.g. "2-bed apartment in Shoreditch under £600k" → top 3–5 listings →
  baked into the swipe link (or written back as `Lead -MATCHED-> Listing(s)`).
- ⏭️ **Superlinked dropped** — it was the semantic ranker; Attio's attribute filter is enough for the demo.
  (`must_haves` free-text just shows on the card; we don't semantically rank on it anymore.)

## Attio write shape (illustrative)

Upsert the Lead (match on **email** — Attio email is unique by default; phone is **not**, so dedupe on email or add a unique phone attr first → `[[derisk]]`), then log an outreach record:

```http
PUT /v2/objects/leads/records?matching_attribute=email
{ "data": { "values": {
    "name": "Alex Carter",
    "phone": "+44...",
    "email": "alex@example.com",
    "intent": "buy",
    "property_type": "apartment",
    "area": "Shoreditch",
    "budget_max": 600000,
    "beds": 2,
    "timeline": "3 months"
} } }
```
```http
POST /v2/objects/outreach/records
{ "data": { "values": {
    "lead":    ["<lead_id>"],
    "channel": "whatsapp",
    "status":  "sent",
    "message": "Hi Alex — 5 Shoreditch 2-beds under £600k matched. Swipe them here: https://orbit.app/s/<token>"
} } }
```

**v4 write-back — the swipe app PATCHes the person record directly** (a swipe "yes" appends a listing):
```http
PATCH /v2/objects/leads/records/<lead_id>          # called from the browser (GitHub Pages)
{ "data": { "values": {
    "interested_listings": ["<listing_id_1>", "<listing_id_2>"]   # the homes swiped yes
} } }
```
**v4 opt-out — lead replies "stop" in WhatsApp:**
```http
PATCH /v2/objects/leads/records/<lead_id>
{ "data": { "values": { "status": "opted_out" } } }
```

> ✅ decided: the **static swipe app calls Attio REST directly** (no n8n hop). ⚠️ needs **CORS allowed from `*.github.io`** and ships an **Attio token client-side** — contained for a throwaway demo workspace (`[[decisions]]`). If CORS blocks it, fall back to an n8n webhook.
> 🤔 assumption: REST entry point (key vs MCP) is ❓ open (`[[stack]]`); the lead's matches can be **baked into the swipe URL by n8n** so the app only needs to *write*, not read.
> Notes fallback: `POST /v2/notes` on the Lead if a custom `interested_listings` attribute isn't ready.

## Worked example

Voice intake: *"Looking for a 2-bed flat in Shoreditch, budget around 600k, I'm buying."*

Gemini structures it → we write:

- **Lead** `Alex Carter` — `intent="buy"`, `phone`/`email` from the call (`<fill in>` ❓ if not captured;
  send the demo outreach to our own number).
- **Requirements** — `property_type="apartment"`, `area="Shoreditch"`, `budget_max=600000`, `beds=2`,
  `timeline="3 months"` (on the Lead).
- **Matched Listings** — the seeded set is ranked → **top 3–5** Shoreditch 2-bed apartments ≤ £600k,
  written back as `Lead -MATCHED-> Listing(s)`. (Via **Attio's filter** on `area`+`beds`+`price` — no Superlinked.)
- **Outreach** — `channel="whatsapp"`, `status="sent"`, `message=<top matches + swipe link>`. Logged `-TO-> Alex`.
- **Swipe back** — Alex opens the GitHub Pages link and swipes; the page **PATCHes his Attio person record**,
  appending the swiped-yes homes to `interested_listings`. (If he replies "stop", `status → opted_out`.) That's the
  demo — **no agent in the loop**. → `[[concept]]`

## Minimal-viable cut

Smallest model that still demos **call → qualified → matched → swipe → write back**:

- 🟢 keep: **Lead** + **Requirements** + a **seeded Listings set** (with `photo_url`) + the **WhatsApp swipe link** + **interested write-back**.
- ⏭️ cut: a separate **Requirements** object → fold the fields onto the **Lead** if it stalls.
- ⏭️ cut: a custom **Outreach/Interest** object → write `interested` listings + opt-out as **Attio notes/activity** on the Lead instead.
- ⏭️ cut: **opt-out** first if behind — the swipe write-back alone closes the loop visibly.
- ✅ match = **Attio's native filter** on `area`+`beds`+`price` (⏭️ Superlinked dropped — no separate matcher).
- ❓ open: Requirements on the Lead vs a linked object — lean **on the Lead** for the 6h. → `[[decisions]]`

## Related
`[[architecture]]` · `[[concept]]` · `[[stack]]` · `[[overview]]` · `[[decisions]]`
