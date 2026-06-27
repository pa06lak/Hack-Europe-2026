# Orchestration / Outreach — P3 (Palak) · the centrepiece

The north star: **act on the lead with no human in the loop.** An **n8n** flow triggers off a new Attio
lead and runs multichannel outreach, then logs outcomes back. Wiki: `../wiki/product/architecture.md` (stage 4).

## The flow
`Attio new lead (trigger) → fetch lead + requirements + candidate listings → [rank: Superlinked node OR
price/beds/area filter] → WhatsApp the top matches → SLNG outbound call → write outcomes back to Attio.`

Export the finished flow to JSON in this folder so it's in the submission repo.

## Channels (demo)
- **WhatsApp** — top-matched listings to **our own** number. (Twilio sandbox is likely the fastest path —
  confirm in the de-risk brief.)
- **SLNG outbound call** — a callback to our own number.
- Telegram / email = ⏭️ stretch only.

## Build against a mock first
Until P2's write client is live, fire the flow off a **mock Attio record** so you're never blocked.
Keep each channel independently togglable — one failing channel can't sink the demo.

## Open (⏳ research in flight)
- **Trigger mechanism:** Attio automation webhook → n8n webhook URL vs n8n polling Attio. (Highest-visibility seam — prove it early.)
- **Native Attio node in n8n?** else generic HTTP Request node.
- **Superlinked as an in-flow HTTP node** (rank before send) — 💡 stretch; keep request/response identical to the filter fallback so swapping is free.

## First hour
1. n8n cloud instance → a flow with a webhook trigger → one **WhatsApp** send to our number on a mock record.
2. Stand up the WhatsApp credential (sandbox join etc.) — provisioning is the long pole, start now.
3. Sketch the "fetch lead + listings" and "log outcome back" HTTP calls against P2's API shape.
