---
title: "Architecture — end-to-end pipeline"
type: product
status: working
date_updated: 2026-06-27
owner: shared
---

# Architecture — end-to-end pipeline

> ⏱️ 6-hour sprint, hard deadline 19:00, 3 people. Everything here is sized to be buildable in time and to **protect the demo**. See `[[timeline]]`, `[[concept]]`, `[[stack]]`, `[[team]]`.
> 🔁 Re-pointed for **idea v3** (voice-first real-estate lead engine on Attio), then **idea v4 (2026-06-27)**: the outreach centrepiece becomes a **WhatsApp → swipe-app ("Tinder for houses")** loop instead of a multichannel blast. n8n WhatsApps **one link** to a swipe UI of the lead's top matches; the lead swipes interested/pass or opts out via the WhatsApp bot; **both write back to Attio.** Telegram/email/outbound-call are **cut**; intake branches **buy vs rent/let** (sell dropped). See `[[decisions]]`.
> 🎯 Partner-tech rule: we need **≥3** to qualify. Core pipeline leans on **SLNG + Attio + n8n + Gemini** (4 ✅); ⏭️ **Superlinked dropped** (Attio's own filtering does the matching), Tavily stays stretch. The swipe app is our **own front-end**, not a partner tech. See `[[partners]]`.

## Data-flow (one-liner)
`Buyer calls SLNG → voice agent qualifies & branches (buy vs rent/let) → Gemini structures a lead JSON → write to Attio (Lead+Requirements; Listings seeded; system of record) → match top 3–5 listings vs criteria → n8n WhatsApps a link to the SWIPE APP → lead swipes interested/pass (or opts out via the bot) → both write back to Attio → loop.`

## Pipeline (ASCII)

```
 [1] VOICE INTAKE              [2] WRITE TO ATTIO          [3] MATCH
 SLNG voice agent         →    create Lead/Contact     →   rank seeded Listings
 qualifies + BRANCHES:         + Requirements              vs the lead's criteria
   • BUY      (purchase)       ★ Attio = system          (semantic + price/beds/area)
   • RENT/LET (rental)          of record                 → top 3–5 matches
 type·area·budget·beds·         (REST API or MCP)         via Attio's own filter
 timeline                            │                      (no Superlinked needed)
   │  Gemini parses                  │                            │
   │  → lead JSON                    │                            ▼
   ▼                                 ▼                     top 3–5 written back to
 (fallback: form /          (fallback: pre-seed          Lead -MATCHED-> Listing(s)
  typed input if STT          workspace + a couple              │
  is shaky)                    live writes)                     ▼
                                                          [4] ORCHESTRATE (n8n)  ★
                              [5] WRITE BACK              trigger: Attio new/updated lead
                              ┌─ swipe: interested/pass   → n8n sends ONE WhatsApp:
                              └─ opt-out: "stop"             a LINK to the SWIPE APP
                              both update Attio  ◀────────────────┐
                                    ▲                             ▼
                                    │                   ┌──────────────────────────┐
                                    │                   │  SWIPE APP ("Tinder for  │
                                    └───────────────────┤  houses") on GitHub Pages│
                                   (app PATCHes the      │  — top 3–5, yes/no, info │
                                    Attio person, direct)│  + WhatsApp opt-out bot  │
                                                         └──────────────────────────┘
```

## Stages
Each stage: **what / tech / demo-safe fallback.**

### 1. Voice intake (SLNG + Gemini)
- **What:** conversational qualification — the agent detects intent and **branches into one of two question sets** (v4): **BUY** (looking to purchase) or **RENT/LET** (the rental market). It captures **property type (house/apartment), area, budget, beds, timeline**, and **Gemini** parses the answers into a structured **lead JSON**. This is the front door. ⏭️ **sell** is cut for the demo. → `[[concept]]`, `[[voice-intake]]`
- **Tech:** **SLNG** (voice in, partner ✅, side-challenge eligible) + **Gemini** (parse → structured lead, partner ✅).
- **Fallback (demo-safe):** 🤔 if voice STT is shaky, drop to a **simple form / typed input** that produces the same lead JSON — every downstream stage still runs.

### 2. Write to Attio
- **What:** create **Lead/Contact + Requirements** from the lead JSON. **Attio = system of record** — the agent acts *on* it. A **Listings** object is **seeded** ahead of time. → `[[data-model]]`
- **Tech:** **Attio** (partner ✅) via **REST API or Attio MCP** (entry point ❓ open — see `[[stack]]`).
- **Fallback:** 🤔 **pre-seed the Attio workspace** (listings + a sample lead); on stage do a **couple of live writes** so judges see the agent mutate the CRM. Free Attio workspaces are available on the day.

### 3. Match (Attio's native filtering) ✅
- **What:** pick the lead's **top 3–5 listings** by filtering the seeded **Listings** object on the lead's criteria (**area + beds + price range**), so we know *what to put in the swipe app*.
- **Tech (✅ decided):** **Attio's own filter/list functionality** does the matching — no Superlinked, no custom matcher. Run the filter via Attio (an n8n Attio query when building the swipe URL, or a P2 read query). The match is just an Attio query.
- **Placement:** **before** the WhatsApp send — bake the matched 3–5 into the swipe link.
- **⏭️ Superlinked dropped:** it was only ever the matcher; Attio covers it. (Could return as a *pure side-challenge bonus* if wildly ahead — off the board for now.) → `[[decisions]]`, `[[partners]]`.

### 4. Orchestrate (n8n) → Swipe app ★ centrepiece
- **What (v4):** **Triggered from Attio** (new/updated lead), n8n sends **one WhatsApp message: a link to the swipe app** ("Tinder for houses"). The app shows the lead's **top 3–5 matched listings** (from stage 3) one at a time with photos + key info; the lead **swipes interested / pass**. The same WhatsApp thread also runs an **opt-out bot** — reply to stop ("no longer looking"). n8n is the action layer; the human on the **agency side never touches it.** → `[[demo]]`
- **Tech:** **n8n** (partner ✅, side-challenge eligible) — Attio trigger → build the per-lead swipe URL (carries an unguessable lead token) → **WhatsApp send** (Twilio sandbox); the **swipe app** is our own front-end reading the matched listings; Superlinked (stage 3) feeds it.
- **Demo target:** WhatsApp lands on **our own** phone on camera; tap the link, swipe the matches live. The swipe UI **is the money shot** (replaces the v3 callback). → `[[demo]]`
- **Fallback:** ⏭️ if WhatsApp send is flaky, open the swipe-app URL directly on the phone; if the app backend is shaky, pre-load it with the known lead's matches.

### 5. Write back (both paths) — the loop
- **What (v4):** **two** signals flow back into Attio — **(a) swipe results** (`interested` / `pass` per listing) and **(b) opt-out** (lead replies "stop" → mark inactive / not-distressed). Both update the lead so the CRM reflects real intent; an updated lead can re-trigger n8n.
- **Tech (✅ decided):** the **swipe app (static, GitHub Pages) PATCHes the Attio person/Lead record directly** — `interested` listings onto the person, opt-out as `status`. No n8n hop for the write-back. ⚠️ two derisks: Attio must allow **CORS** from `*.github.io`, and the **Attio token is client-side** — both contained for a throwaway demo workspace (see seam below + `[[decisions]]`).
- **Fallback:** ⏭️ if CORS blocks the direct write, route it through an **n8n webhook** (server-side) instead. For the demo, write back **interested** swipes + opt-out only; don't build a nurture scheduler. One pass closes the loop.

## Partner-tech map
| Stage | Partner tech | Role | Counts toward ≥3? |
|---|---|---|---|
| 1. Intake | **SLNG** | voice in (⏭️ outbound call cut in v4) | ✅ |
| 2. Write / 5. Write-back | **Attio** | store + act (system of record) | ✅ |
| 4. Orchestrate | **n8n** | Attio trigger → WhatsApp swipe-link + opt-out | ✅ |
| 1. Parse / drafts | **Gemini** | structure lead + draft the WhatsApp copy | ✅ |
| 3. Match | **Attio** | native filtering picks the top 3–5 (feeds the swipe app) | ✅ (already counted) |
| 4. Swipe UI | *(our front-end)* | "Tinder for houses" on GitHub Pages — **not** a partner tech | — |
| (enrich) | **Tavily** | area/market enrichment | 💡 stretch |

Four partners are load-bearing (**SLNG, Attio, n8n, Gemini**) → we clear ≥3 comfortably. ⏭️ **Superlinked dropped** (Attio's own filtering does the matching); **Tavily** is the remaining bonus. → `[[partners]]`

## Integration seams (riskiest joins)
- 🤔 **1 → 2 (intake JSON → Attio schema):** the lead JSON shape must map exactly onto Attio's **Lead/Contact + Requirements** attributes. Pin the object model first so intake can't drift. → `[[data-model]]`
- 🤔 **2 → 4 (Attio → n8n trigger):** new/updated lead must reliably fire the n8n flow (webhook/poll). Highest demo-visibility join — build and prove it early.
- 🤔 **3 → swipe app (matched listings → UI):** the top 3–5 (Superlinked or filter) must land in a shape the swipe app reads. Keep that contract identical for both match paths so swapping is free.
- 🤔 **4 (WhatsApp link send):** n8n builds a per-lead swipe URL (unguessable token) and sends it via WhatsApp (Twilio sandbox — re-join right before the demo). Send to **our own** number.
- 🤔 **5 (swipe → Attio write-back) — the new highest-risk join:** ✅ decided the **app PATCHes the Attio person directly**, so pin **which person attributes a swipe sets** (e.g. `interested_listings`, `status`). ⚠️ **verify CORS from `*.github.io` early** (a one-line `fetch` test) — if blocked, fall back to an **n8n webhook**. Token is client-side; use a scoped throwaway key. → `[[decisions]]`

## Risks & cut-lines (drop in this order if behind)
- ⏭️ **Already cut in v4:** Telegram, email, and the SLNG **outbound call** — channel = **WhatsApp only**; **sell** intake.
- ⏭️ **Opt-out bot → skip.** If the WhatsApp opt-out is shaky, the **swipe app alone** still closes the loop; opt-out is the first thing to drop.
- ⏭️ **Write-back → interested-only.** Log just `interested` swipes (and opt-out if it works); skip `pass`. The CRM still visibly updates.
- ⏭️ **Superlinked → simple filter.** Keep ranking visible via a price/beds/area filter feeding the app; Superlinked is bonus.
- ⏭️ **Voice intake → form / typed input.** Same lead JSON, so the rest of the pipeline (incl. the swipe app) is unaffected.
- ⏭️ **WhatsApp send → open the URL directly.** If Twilio is flaky, just open the per-lead swipe URL on the phone on camera.
- ⏭️ **Live listings → seeded mock (~15–30).** Already the default; the seeded set is the bedrock that makes the match (and the swipe cards) visible.

> Rule of thumb: every stage has a **fallback that keeps the happy path alive**. The non-negotiable spine is **seeded listings → a known lead → matched top 3–5 → the swipe app opens on a phone**. Build that first; layer on live voice intake, the WhatsApp send, opt-out, and Superlinked as time allows. → `[[timeline]]`

## Related
`[[data-model]]` · `[[stack]]` · `[[partners]]` · `[[timeline]]` · `[[team]]` · `[[concept]]` · `[[decisions]]`
