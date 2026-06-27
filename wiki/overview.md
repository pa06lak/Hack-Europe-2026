---
title: "Overview — read first"
type: overview
status: working
date_updated: 2026-06-27
owner: shared
---

# Orbit — Overview

> ⚠️ **Name "Orbit" is provisional** — may not fit the real-estate idea. See `[[decisions]]`.
> 🔁 **Idea v3 (2026-06-27):** a **voice-first real-estate lead engine on Attio**. Earlier iterations (event concierge → comms-ingestion CRM) are in `raw/idea-brief.md` + `[[decisions]]`.
> ⏱️ **6-hour sprint · hard deadline 19:00 · team of 3.** Read `[[CLAUDE]]` for conventions, then `[[timeline]]` for the clock.
> 🎯 **Track: Attio — The Agentic CRM** (prize: iPad/member). **North star: close the loop without a human.**

## In one line
A **voice agent (SLNG)** qualifies a real-estate lead — buy / sell / rent + property criteria — drops them
into **Attio** as a lead, and an **n8n** orchestrator runs **autonomous multichannel outreach** (calls,
WhatsApp, Telegram, email), with **Superlinked** matching listings to each lead.

## The problem (🤔 assumption)
Real-estate lead handling is slow and manual: someone fills a form, an agent eventually calls back, leads go
cold, and matching people to the right properties is ad-hoc. **Speed-to-lead wins deals** — and the human is
the bottleneck. Attio's premise fits exactly: the CRM shouldn't just hold the lead, it should *act* on it.

## What we're building
1. **Voice intake** (SLNG + Gemini) — conversational qualification: intent (buy/sell/rent), property type
   (house/apartment), area, budget, beds, timeline. Gemini turns the speech into a structured lead. → `[[architecture]]`
2. **Write to Attio** (CRM) — Lead/Contact + Requirements; a **Listings** object is seeded. **Attio = system of record.** → `[[data-model]]`
3. **Match** (Superlinked) — rerank listings against the lead's criteria (semantic + price/beds/area). **Before** the outreach, ideally as a node inside n8n. 💡 stretch/bonus.
4. **Orchestrate** (n8n) — triggered from Attio → **multichannel outreach**: SLNG outbound call, WhatsApp, Telegram, email → log outcomes back to Attio.
5. **Loop** — outcomes update Attio; nurture continues.

The wow: you *talk* to it, become a qualified lead, and within seconds it's calling/messaging you with your
best-matched properties — **no human touched it.** → `[[demo]]`

## Why it can win (🤔 assumption)
- **Strongest Attio-track fit:** a real sales workflow (real-estate lead-to-deal), agentic, closes the loop without a human. → `[[tracks-and-prizes]]`
- **Partner tech:** **SLNG + Attio + n8n** core (≥3 ✅), + **Gemini** as the brain, + **Superlinked** rerank — lines up SLNG / n8n / Superlinked side challenges. → `[[partners]]`
- **Creativity + complexity:** voice intake → CRM → reranked matching → autonomous multichannel outreach. → `[[judging]]`

## Scope for 6 hours / 3 people (the bet)
Ship **one killer happy-path demo**:
- 🤔 One path: a **buyer calls → qualified → Attio lead → top-matched listings → n8n WhatsApps them + books a viewing call**.
- 🤔 Seed a small **listings dataset** (~15–30) so the match is visible; send outreach to **our own** numbers/inboxes.
- 🤔 Wire **WhatsApp + one SLNG call** for the demo; ⏭️ Telegram/email "if time".
- 💡 Superlinked + Tavily (area/market enrichment) are **stretch**, not critical path.
See the cut list + hour-by-hour in `[[timeline]]`; the 3-way split in `[[team]]`.

## Current state
- ✅ `decided` (2026-06-27): **Idea v3 — voice-first real-estate lead engine on Attio.** → `[[decisions]]`
- ✅ `decided`: **team = 3**; partners core = **SLNG + Attio + n8n** (+ Gemini; Superlinked stretch).
- ✅ `decided`: **Superlinked reranks before the outreach** (ideally a node inside n8n), not after.
- ❓ `open`: project name; which channels to actually wire; rerank target (listings-for-lead vs lead-scoring); how many listings to seed. → `[[decisions]]`
- 🔨 next: **first 30 min, all 3** — agree the lead schema + Attio object model + channel list, then build the slices.

## Navigation
The idea → `[[concept]]`, `[[architecture]]`, `[[data-model]]`. The rules → `[[rules]]`,
`[[tracks-and-prizes]]`, `[[judging]]`, `[[partners]]`. The sprint → `[[timeline]]`, `[[tasks]]`,
`[[stack]]`, `[[team]]`. Shipping → `[[demo]]`, `[[submission]]`. Decisions → `[[decisions]]`.

## Open questions
- What do we call it? ("Orbit" is a leftover placeholder.)
- Which channels do we actually wire for the demo (recommend WhatsApp + one SLNG call)?
- Superlinked reranks **listings for a lead** (buyer-facing) or **leads by priority** (agent-facing)? Lean listings-for-a-lead.
- How many listings to seed, and from where (curated mock vs a scraped/sample set)?
