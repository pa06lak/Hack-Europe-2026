---
title: "Architecture — end-to-end pipeline"
type: product
status: working
date_updated: 2026-06-27
owner: shared
---

# Architecture — end-to-end pipeline

> ⏱️ 6-hour sprint, hard deadline 19:00, 3 people. Everything here is sized to be buildable in time and to **protect the demo**. See `[[timeline]]`, `[[concept]]`, `[[stack]]`, `[[team]]`.
> 🔁 Re-pointed for **idea v3**: a **voice-first real-estate lead engine on Attio** — SLNG voice intake → Attio lead → match listings → n8n multichannel outreach → log back. Earlier ideas (event concierge → comms-ingestion CRM) are history only. See `[[decisions]]`.
> 🎯 Partner-tech rule: we need **≥3** to qualify. Core pipeline leans on **SLNG + Attio + n8n + Gemini** (4 ✅); Superlinked + Tavily are stretch. See `[[partners]]`.

## Data-flow (one-liner)
`Buyer calls SLNG → voice agent qualifies (intent·type·area·budget·beds·timeline) → Gemini structures a lead JSON → write to Attio (Lead+Requirements; Listings seeded; system of record) → Superlinked ranks listings vs criteria → n8n runs multichannel outreach (SLNG call / WhatsApp / Telegram / email) → log outcomes back to Attio → loop.`

## Pipeline (ASCII)

```
 [1] VOICE INTAKE              [2] WRITE TO ATTIO          [3] MATCH (Superlinked)
 SLNG voice agent         →    create Lead/Contact     →   rank seeded Listings
 qualifies the caller:         + Requirements              vs the lead's criteria
 intent (buy/sell/rent)        ★ Attio = system          (semantic + price/beds/area)
 type·area·budget·beds·         of record                 💡 STRETCH — runs BEFORE
 timeline                       (REST API or MCP)          outreach, ideally as an
   │  Gemini parses                  │                      HTTP node INSIDE n8n
   │  → lead JSON                    │                            │
   ▼                                 ▼                            ▼
 (fallback: form /          (fallback: pre-seed         (fallback: simple SQL /
  typed input if STT          workspace + a couple        attribute filter match)
  is shaky)                    live writes)                      │
                                                                 ▼
                              [5] LOOP                    [4] ORCHESTRATE (n8n)  ★ centrepiece
                              outcomes update Attio  ◀──   trigger: Attio new/updated lead
                              nurture continues           → multichannel outreach:
                              → re-trigger n8n               SLNG call · WhatsApp
                                                            · Telegram · email
                                                          → write outcomes back to Attio
                                                          (no human in the loop)
```

## Stages
Each stage: **what / tech / demo-safe fallback.**

### 1. Voice intake (SLNG + Gemini)
- **What:** conversational qualification — the agent asks for **intent (buy/sell/rent), property type (house/apartment), area, budget, beds, timeline** and **Gemini** drives/parses the answers into a structured **lead JSON**. This is the front door. → `[[concept]]`
- **Tech:** **SLNG** (voice in, partner ✅, side-challenge eligible) + **Gemini** (parse → structured lead, partner ✅).
- **Fallback (demo-safe):** 🤔 if voice STT is shaky, drop to a **simple form / typed input** that produces the same lead JSON — every downstream stage still runs.

### 2. Write to Attio
- **What:** create **Lead/Contact + Requirements** from the lead JSON. **Attio = system of record** — the agent acts *on* it. A **Listings** object is **seeded** ahead of time. → `[[data-model]]`
- **Tech:** **Attio** (partner ✅) via **REST API or Attio MCP** (entry point ❓ open — see `[[stack]]`).
- **Fallback:** 🤔 **pre-seed the Attio workspace** (listings + a sample lead); on stage do a **couple of live writes** so judges see the agent mutate the CRM. Free Attio workspaces are available on the day.

### 3. Match (Superlinked) — 💡 STRETCH
- **What:** rank the **seeded Listings** against the lead's criteria (**semantic + price / beds / area**) so we know *what to send* before reaching out.
- **Placement (✅ decided):** run it **before the outreach — ideally as an HTTP node inside the n8n flow** (rank, then act). **NOT after n8n** — that only ranks responses, which is out of scope. See `[[decisions]]`.
- **Tech:** **Superlinked** (partner ✅, side-challenge eligible) — stretch/bonus, off the critical path.
- **Fallback:** 🤔 a **simple SQL / attribute filter** (price range + beds + area) returns top listings. The demo must work without Superlinked.

### 4. Orchestrate (n8n) ★ centrepiece
- **What:** the north star. **Triggered from Attio** (new/updated lead) → run **multichannel outreach** — **SLNG outbound call, WhatsApp, Telegram, email** — then **write outcomes back to Attio**. n8n is the action layer. **No human in the loop.** → `[[demo]]`
- **Tech:** **n8n** (partner ✅, side-challenge eligible) orchestrating **SLNG (outbound) + channel APIs + Attio (read/write)**; Superlinked called as a node here (stage 3).
- **Fallback:** ⏭️ wire **WhatsApp + one SLNG call** only; Telegram/email are stretch. Outreach goes to **our own** numbers/inboxes for the demo.

### 5. Loop
- **What:** outreach **outcomes update Attio** (called / messaged / replied), and nurture continues — an updated lead can re-trigger n8n.
- **Tech:** **Attio** writes from n8n; same trigger as stage 4.
- **Fallback:** ⏭️ for the demo, one pass is enough — log outcomes; don't build a real nurture scheduler.

## Partner-tech map
| Stage | Partner tech | Role | Counts toward ≥3? |
|---|---|---|---|
| 1. Intake / 4. Outreach | **SLNG** | voice in + out | ✅ |
| 2. Write / 5. Loop | **Attio** | store + act (system of record) | ✅ |
| 4. Orchestrate | **n8n** | orchestrate multichannel outreach | ✅ |
| 1. Parse / drafts | **Gemini** | structure lead + draft messages | ✅ |
| 3. Match | **Superlinked** | rank listings vs criteria | 💡 stretch |
| (enrich) | **Tavily** | area/market enrichment | 💡 stretch |

Four partners are load-bearing (**SLNG, Attio, n8n, Gemini**) → we clear ≥3 comfortably. **Superlinked + Tavily** are bonus, not critical path. → `[[partners]]`

## Integration seams (riskiest joins)
- 🤔 **1 → 2 (intake JSON → Attio schema):** the lead JSON shape must map exactly onto Attio's **Lead/Contact + Requirements** attributes. Pin the object model first so intake can't drift. → `[[data-model]]`
- 🤔 **2 → 4 (Attio → n8n trigger):** new/updated lead must reliably fire the n8n flow (webhook/poll). Highest demo-visibility join — build and prove it early.
- 🤔 **3 inside 4 (Superlinked call inside n8n):** the HTTP node calling Superlinked (or the filter fallback) and feeding ranked listings into the outreach step — keep its request/response contract identical for both paths so swapping is free.
- 🤔 **4 channels (credentials / sends):** WhatsApp / SLNG-outbound / Telegram / email creds and send calls — the touchiest live join. Send to **our own** endpoints; have each channel independently togglable so one failing channel can't sink the demo.

## Risks & cut-lines (drop in this order if behind)
- ⏭️ **All four channels → WhatsApp + one SLNG call.** Wire the two highest-impact channels; Telegram/email only if time.
- ⏭️ **Superlinked → simple filter.** Keep ranking visible via a price/beds/area filter; Superlinked is bonus.
- ⏭️ **Voice intake → form / typed input.** Same lead JSON, so the rest of the pipeline is unaffected.
- ⏭️ **Outbound SLNG call → skip.** If outbound voice is shaky, a WhatsApp message alone still closes the loop.
- ⏭️ **Live listings → seeded mock (~15–30).** Already the default; the seeded set is the bedrock that makes the match visible.

> Rule of thumb: every stage has a **fallback that keeps the happy path alive**. Build on **seeded listings + a known lead + WhatsApp first**, then upgrade live (voice intake, outbound call, Superlinked) as time allows. → `[[timeline]]`

## Related
`[[data-model]]` · `[[stack]]` · `[[partners]]` · `[[timeline]]` · `[[team]]` · `[[concept]]` · `[[decisions]]`
