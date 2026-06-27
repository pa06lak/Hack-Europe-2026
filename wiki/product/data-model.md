---
title: "Data Model — intake → Attio → match"
type: product
status: working
date_updated: 2026-06-27
owner: shared
---

# Data Model — intake → Attio → match

The data model for idea v3 (✅ `[[decisions]]`): a **voice-first real-estate lead engine**. Centred on
**Attio objects** (the system of record) + the **Superlinked index** that ranks listings for a lead.
Kept minimal for a 6-hour build. See `[[architecture]]` for the pipeline, `[[concept]]` for the why,
`[[stack]]` for services/keys.

> 🤔 assumption: one demo workspace, one seeded listings set (~15–30, `[[overview]]` scope). The model
> only has to demo the loop — **call → qualified lead → matched listings → outreach** — not be complete.
> ❓ open: exact Attio object/attribute set, standard-vs-custom, and entry point (REST vs MCP) — `[[decisions]]`.

## Attio objects

- **Leads / Contacts** (standard People, or a custom Lead object) — the caller. Attrs: `name`, `phone`,
  `email`, `intent` (select: `buy` / `sell` / `rent`). The match key for upserts.
- **Requirements** — what they want: `property_type` (`house` / `apartment`), `area`, `budget_min`,
  `budget_max`, `beds`, `timeline`. 🤔 attributes **on the Lead** for speed; or a linked object if it's clean.
- **Listings / Properties** — **seeded** (~15–30). Attrs: `type`, `area`, `price`, `beds`, `features`,
  `description`. This is what Superlinked ranks and what outreach sends.
- **Outreach / Interactions** — one record per touchpoint: `channel` (`call` / `whatsapp` / `telegram` /
  `email`), `ts`, `status` (`sent` / `replied`), `message`. Logged per lead — this proves the agent acted.

## Relationships

- `Lead -WANTS-> Requirements`  (attributes on Lead, or a record-reference)
- `Lead -MATCHED-> Listing(s)`  (top-N from Superlinked, written back as references)
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
| `intent` | `Lead.intent` (select `buy`/`sell`/`rent`) |
| `contact.name` | `Lead.name` |
| `contact.phone` | `Lead.phone` (match key) |
| `contact.email` | `Lead.email` (match key) |
| `requirements.type` | `Requirements.property_type` |
| `requirements.area` | `Requirements.area` |
| `requirements.budget_min` / `budget_max` | `Requirements.budget_min` / `budget_max` |
| `requirements.beds` | `Requirements.beds` |
| `requirements.timeline` | `Requirements.timeline` |

## Superlinked index (💡 stretch)

Ranks the seeded **Listings** against a lead's **Requirements**. 💡 stretch / bonus — the core demo must
work without it (`[[decisions]]`); ideally an HTTP node **inside** n8n (rank, then act).

- **Semantic:** `description`, `features` (the lead's free-text wants → the listing prose).
- **Numeric:** `price` (within `budget_min`–`budget_max`), `beds` (≈ requested).
- **Categorical:** `type` (`house`/`apartment`), `area`.
- **Query** built from the Requirements: e.g. "2-bed apartment in Shoreditch under £600k" → top-N listings,
  written back as `Lead -MATCHED-> Listing(s)`.

## Attio write shape (illustrative)

Upsert the Lead (match on phone/email so we don't duplicate), then log an outreach record:

```http
PUT /v2/objects/leads/records?matching_attribute=phone
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
    "message": "Hi Alex — 3 Shoreditch 2-beds under £600k matched. Want a viewing?"
} } }
```

> 🤔 assumption: REST upsert via `matching_attribute` (or Attio MCP) — entry point is ❓ open (`[[stack]]`).
> Notes fallback: `POST /v2/notes` on the Lead if a custom Outreach object isn't ready.

## Worked example

Voice intake: *"Looking for a 2-bed flat in Shoreditch, budget around 600k, I'm buying."*

Gemini structures it → we write:

- **Lead** `Alex Carter` — `intent="buy"`, `phone`/`email` from the call (`<fill in>` ❓ if not captured;
  send the demo outreach to our own number).
- **Requirements** — `property_type="apartment"`, `area="Shoreditch"`, `budget_max=600000`, `beds=2`,
  `timeline="3 months"` (on the Lead).
- **Matched Listings** — Superlinked ranks the seeded set → top-3 Shoreditch 2-bed apartments ≤ £600k,
  written back as `Lead -MATCHED-> Listing(s)`. (💡 stretch; if cut, do a simple filter on `area`+`beds`+`price`.)
- **Outreach** — `channel="whatsapp"`, `status="sent"`, `message=<the 3 matches + viewing offer>`, plus an
  SLNG outbound call. Logged `-TO-> Alex`. That's the demo — **no human in the loop**. → `[[concept]]`

## Minimal-viable cut

Smallest model that still demos **call → qualified → matched → reached out**:

- 🟢 keep: **Lead** + **Requirements** + a **seeded Listings set** + **one outreach channel** (WhatsApp).
- ⏭️ cut: a separate **Requirements** object → fold the fields onto the **Lead** if it stalls.
- ⏭️ cut: a custom **Outreach** object → use **Attio notes/activity** on the Lead instead.
- ⏭️ cut: **Superlinked match** off the critical path → filter listings by `area`+`beds`+`price` (💡 stretch).
- ❓ open: Requirements on the Lead vs a linked object — lean **on the Lead** for the 6h. → `[[decisions]]`

## Related
`[[architecture]]` · `[[concept]]` · `[[stack]]` · `[[overview]]` · `[[decisions]]`
