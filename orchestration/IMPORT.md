# Importing `orbit-flow.json` into self-hosted n8n

> ⚠️ **This is a STARTER.** It imports and runs, but **node versions may need adjusting on import** —
> if n8n flags a node, open it, re-pick the operation/fields, and re-save. Treat the Code nodes as the
> source of truth and the credentials/URLs below as placeholders to fill in.

This is the **P3 orchestration slice** (architecture.md stage 4): a webhook fires from Attio →
extract lead → match listings → build a WhatsApp message → send via Twilio → log an outreach record
back to Attio.

---

## 1. Import the workflow

1. Run **self-hosted** n8n (Cloud is locked to native nodes + a 14-day trial — see `../wiki/build/derisk.md`).
   Quick start: `docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n`
2. Open n8n → top-right **⋮ → Import from File** → choose `orchestration/orbit-flow.json`.
3. The canvas should show 6 nodes wired left-to-right:
   `Webhook → Extract Lead Fields → Match Listings → Build WhatsApp Message → Send WhatsApp (Twilio) → Log Outreach to Attio`.

The nodes used (all current `n8n-nodes-base`):
`webhook@2`, `code@2` (×3), `twilio@1`, `httpRequest@4.2`. If your n8n version differs and a node shows a
version warning, just open it and re-confirm the fields.

---

## 2. Credentials & placeholders to fill

| Where | Placeholder | What to put |
|---|---|---|
| **Send WhatsApp (Twilio)** node → Credential | `Twilio Sandbox (PLACEHOLDER)` | Create an **n8n Twilio credential**: Twilio **Account SID** + **Auth Token** (from the Twilio console). |
| **Send WhatsApp (Twilio)** node → `From` | `+14155238886` | The **Twilio WhatsApp sandbox** number. Replace only if yours differs. `toWhatsapp` is ON, so n8n adds the `whatsapp:` prefix to both From and To for you. |
| **Log Outreach to Attio** node → header `Authorization` | `Bearer REPLACE_WITH_ATTIO_BEARER_TOKEN` | Your **Attio API bearer token** (scopes: record read-write + object-config read). For the real demo, prefer moving it into an **HTTP Header Auth** credential rather than a literal header. |
| **Log Outreach to Attio** node → URL / body | `https://api.attio.com/v2/objects/outreach/records` | Confirm the **`outreach` object slug** exists in your Attio workspace and that the `values` keys (`name`, `channel`, `lead_email`, …) match your real attribute slugs. Some Attio attribute types want **arrays** — verify the exact `data.values` shape with one real call (see derisk.md step 4). To upsert idempotently, switch to **PUT** `…/records?matching_attribute=<slug>`. |

The **lead phone** flows automatically from the webhook body (`contact.phone`, E.164) through the Code
nodes into the Twilio `To` field via `{{ $('Build WhatsApp Message').item.json.phone }}` — no manual edit needed.

---

## 3. Wire the Attio trigger → this webhook

1. **Activate** the workflow in n8n (toggle top-right). Only an active workflow exposes its **PRODUCTION**
   webhook URL.
2. Open the **Webhook — Attio New Lead** node → copy the **Production URL**
   (looks like `https://<your-n8n-host>/webhook/orbit-lead`).
   - The **Test URL** (`/webhook-test/orbit-lead`) only works while the editor is listening — use Production for Attio.
3. In **Attio** → **Automations/Workflows** → create **"Record created"** on **Leads** →
   action **"HTTP request"** → method **POST** → paste the n8n **Production URL** → send the lead
   **field values** in the JSON body (shape = `contracts/lead.schema.json`: `intent`, `contact{name,email,phone}`,
   `requirements{type,area,budget_min,budget_max,beds,must_haves,timeline}`, …).
   - We use the Attio **Workflow "HTTP request"** action (not a raw dev webhook) because it carries the
     actual **field VALUES**; raw webhooks are thin (IDs only). See `../wiki/build/derisk.md`.

The Extract node reads `$json.body` (where webhook v2 puts the POST body) and falls back to `$json`,
so you can also test by pasting a sample lead with **Execute Workflow**.

---

## 4. Demo caveat — Twilio sandbox join (do NOT skip)

- Every recipient phone **must first text `join <code>` to the Twilio sandbox number** (the `<code>` is shown
  in your Twilio console, e.g. `join velvet-tiger`). Until they join, sends fail.
- The sandbox session **lapses (~3 days)** → you'll hit **Error 63015**. **Re-join right before the demo.**
- For the demo, send to **our own** joined numbers only.

---

## 5. Swap-in points (optional, post-demo upgrades)

- **Superlinked ranking:** the **Match Listings** Code node is a price/beds/area filter standing in for
  semantic ranking. Replace it with an **HTTP Request** node → `POST https://<superlinked>/query` and map the
  ranked results into the same `matches` array shape (`id, title, type, area, price, beds, features`). The
  swap-in comment is inside that node. (architecture.md stage 3.)
- **Live listings:** the inline `LISTINGS` array (a subset of `data/listings.seed.json`) can be replaced by an
  HTTP Request to Attio `POST /v2/objects/listings/records/query`.
- **More channels:** add SLNG outbound call / Telegram / email after the Twilio node — keep each independently
  togglable so one failing channel can't sink the demo.
