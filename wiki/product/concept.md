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
> 🔁 Idea v3 (2026-06-27): a **voice-first real-estate lead engine on Attio**. Earlier ideas (event concierge → comms-ingestion CRM) are pivot history only. → [[decisions]]

## Problem (🤔 assumption)
- Real-estate lead handling is **slow and manual** — a form gets filled, then sits unanswered.
- Agents **call back late** (or never), so leads **go cold** before anyone qualifies them.
- Matching a person to the right property is **ad-hoc** — gut feel, manual list-scrolling.
- **Speed-to-lead wins deals.** The human is the bottleneck — Attio's premise is the CRM should *act* on the lead, not just store it.

## Who it's for (🤔 assumption)
- **The buyer of the product:** real-estate **agencies / agents / brokers / property managers** — they have inbound leads and listings, and lose deals to slow follow-up.
- **Who benefits downstream:** **buyers & renters**, who get instant, qualified service instead of a callback days later.

## The solution narrative
- A **voice agent (SLNG)** qualifies the lead **in conversation** — intent (buy/sell/rent), property type, area, budget, beds, timeline.
- **Gemini** structures the speech into a clean lead; it's written to **Attio** (Lead + Requirements; Attio = system of record). → [[data-model]]
- An **n8n** orchestrator instantly reaches out **across channels** with the **best-matched listings** — autonomously, no human in the loop. → [[architecture]]

## The wow moment
- You **talk to it**, become a **qualified lead**, and within **seconds** get a **WhatsApp** with your **top-matched homes** + a **booked viewing call**.
- **No human touched it** — voice in → Attio lead → matched listings → multichannel outreach out. That's the whole demo. → [[demo]]

## Why now (💡 idea)
- 💡 **Good voice infra** — SLNG makes conversational intake (and outbound calls) a few hours of work, not a project.
- 💡 **Cheap LLM structuring** — Gemini turns messy speech into a clean, typed lead reliably.
- 💡 **Agentic CRM primitives** — Attio (Workflows / MCP / REST) is a CRM you can program an agent against.
- 💡 **Workflow automation** — n8n wires the multichannel outreach without bespoke glue code.
- 💡 **Multi-attribute ranking** — Superlinked ranks listings on semantics + price/beds/area in one query. → [[partners]]

## Differentiation
- **vs web lead forms** — slow, no qualification; a form just captures, it doesn't act.
- **vs portals (Rightmove / Zillow)** — they make *you* search; ours is **proactive**, it reaches out to you.
- **vs manual agent follow-up** — slow and inconsistent; ours is instant and uniform.
- **Ours =** voice intake **+** reranked matching **+** autonomous multichannel outreach. No one above is all three.

## A concrete scenario
1. 🤔 A **buyer calls** the line.
2. They answer the voice agent: **buy / area / budget / beds** (+ timeline).
3. Gemini structures it → an **Attio lead** is created with Requirements.
4. **Superlinked ranks** the seeded listings against those criteria. 💡 stretch.
5. **n8n WhatsApps the top 3** listings and **books a viewing call** (SLNG outbound) — all autonomous.

## Non-goals / what this is NOT (⏭️ cut)
- ⏭️ **Not a property portal** — no search UI; the agent does the matching and the reaching-out.
- ⏭️ **Not messaging real strangers** — outreach goes to **our own** numbers/inboxes for the demo.
- ⏭️ **Not the full transaction** — we **draft + dispatch** outreach and book viewings; we don't close legals/contracts.

## Open questions (❓ open → [[decisions]])
- ❓ **Name** — "Orbit" is a leftover placeholder from v1; may not fit real estate. `<fill in>`
- ❓ **Rerank target** — **listings-for-a-lead** (buyer-facing, most visceral) vs **lead-scoring** (agent-facing). Lean listings-for-a-lead.
- ❓ **Which channels we actually wire** — recommend **WhatsApp + one SLNG call**; Telegram/email stretch.

## Related
[[overview]] · [[architecture]] · [[data-model]] · [[demo]] · [[decisions]] · [[partners]]
