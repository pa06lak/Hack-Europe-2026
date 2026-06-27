---
title: "Concept — problem, user, solution"
type: product
status: working
date_updated: 2026-06-27
owner: shared
---

# Concept — problem, user, solution

> The product thinking behind [[overview]], one level deeper. If this drifts from [[overview]], fix this page.
> ⏱️ 6-hour sprint, hard deadline 19:00, 3 people. Everything here serves one working demo — see [[demo]].
> 🔁 Idea v3 → **v4 (2026-06-27)**: still a **voice-first real-estate lead engine on Attio**, but the payoff is now a **WhatsApp → swipe-app ("Tinder for houses")** loop, not a multichannel blast. Earlier ideas (event concierge → comms-ingestion CRM) are pivot history only. → [[decisions]]

## Problem (🤔 assumption)
- Real-estate lead handling is **slow and manual** — a form gets filled, then sits unanswered.
- Agents **call back late** (or never), so leads **go cold** before anyone qualifies them.
- Matching a person to the right property is **ad-hoc** — gut feel, manual list-scrolling.
- **Speed-to-lead wins deals.** The human is the bottleneck — Attio's premise is the CRM should *act* on the lead, not just store it.

## Who it's for (🤔 assumption)
- **The buyer of the product:** real-estate **agencies / agents / brokers / property managers** — they have inbound leads and listings, and lose deals to slow follow-up.
- **Who benefits downstream:** **buyers & renters**, who get instant, qualified service instead of a callback days later.

## The solution narrative
- A **voice agent (SLNG)** qualifies the lead **in conversation** and **branches** — **buy** or **rent/let** — capturing property type, area, budget, beds, timeline.
- **Gemini** structures the speech into a clean lead; it's written to **Attio** (Lead + Requirements; Attio = system of record). → [[data-model]]
- An **n8n** orchestrator instantly **WhatsApps a link to a swipe app** showing the **best-matched listings** — the lead **swipes interested/pass** (or opts out), and **those choices flow straight back into Attio**. No one on the agency side lifts a finger. → [[architecture]]

## The wow moment
- You **talk to it**, become a **qualified lead**, and within **seconds** get a **WhatsApp link**. Tap it and you're **swiping your top-matched homes like Tinder** — yes/no, with photos and the key details.
- Every swipe **updates the CRM in real time**, and you can **reply "stop"** to opt out. Voice in → Attio lead → matched listings → swipe app → choices back in Attio — **no agent touched it.** That's the whole demo. → [[demo]]

## Why now (💡 idea)
- 💡 **Good voice infra** — SLNG makes conversational intake a few hours of work, not a project.
- 💡 **Cheap LLM structuring** — Gemini turns messy speech into a clean, typed lead reliably.
- 💡 **Agentic CRM primitives** — Attio (Workflows / MCP / REST) is a CRM you can program an agent against.
- 💡 **Workflow automation** — n8n wires Attio-trigger → WhatsApp swipe-link → write-back without bespoke glue code.
- 💡 **The CRM can already filter** — Attio's native list/filter picks the matching listings on price/beds/area, so we don't need a separate matcher. → [[partners]]

## Differentiation
- **vs web lead forms** — slow, no qualification; a form just captures, it doesn't act.
- **vs portals (Rightmove / Zillow)** — they make *you* search and scroll endless lists; ours is **proactive** — the agent curates your **top 3–5** and sends them to you to swipe.
- **vs manual agent follow-up** — slow and inconsistent; ours is instant, uniform, and **interactive** (your swipes refine the CRM).
- **Ours =** voice intake **+** CRM-native matching **+** a **swipe-to-shortlist app** that feeds straight back into the CRM. No one above is all three.

## A concrete scenario
1. 🤔 A **buyer calls** the line.
2. They answer the voice agent: **buy / area / budget / beds** (+ timeline). (A renter would hit the **rent/let** branch instead.)
3. Gemini structures it → an **Attio lead** is created with Requirements.
4. The top **3–5 listings** are matched against those criteria by **Attio's own filtering** (area + beds + price).
5. **n8n WhatsApps a link** to the **swipe app**; the buyer swipes **interested/pass** on each home, and every choice **writes back to Attio** — all autonomous on the agency side.

## Non-goals / what this is NOT (⏭️ cut)
- ⏭️ **Not a search portal** — the swipe app shows **only the agent-curated top 3–5**; there's no search bar, filters, or full catalogue to browse. The agent does the matching; you just swipe.
- ⏭️ **Not messaging real strangers** — the WhatsApp link goes to **our own** number for the demo.
- ⏭️ **Not the full transaction** — we **qualify, match, and capture interest** via the swipe; we don't book viewings, do legals, or close contracts.
- ⏭️ **Not multichannel** — v4 is **WhatsApp-only** (the swipe link + opt-out). Telegram/email/outbound-call are cut. → [[decisions]]

## Open questions (❓ open → [[decisions]])
- ❓ **Name** — "Orbit" is a leftover placeholder from v1; may not fit real estate. `<fill in>`
- ❓ **Rerank target** — **listings-for-a-lead** (buyer-facing, most visceral) vs **lead-scoring** (agent-facing). Lean listings-for-a-lead.
- ✅→ **Channels** — resolved: **WhatsApp only** (swipe link + opt-out). New open Qs: swipe-app hosting + the swipe→Attio write-back path. → `[[decisions]]`

## Related
[[overview]] · [[architecture]] · [[data-model]] · [[demo]] · [[decisions]] · [[partners]]
