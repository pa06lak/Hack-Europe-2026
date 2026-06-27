---
title: "Overview — read first"
type: overview
status: working
date_updated: 2026-06-27
owner: shared
---

# Orbit — Overview

> ⚠️ **Name "Orbit" is provisional** — may not fit the real-estate idea. See `[[decisions]]`.
> 🔁 **Idea v4 (2026-06-27):** a **voice-first real-estate lead engine on Attio**, now with a **WhatsApp → swipe-app ("Tinder for houses")** payoff. Earlier iterations (event concierge → comms-ingestion CRM → v3 multichannel blast) are in `raw/idea-brief.md` + `[[decisions]]`.
> ⏱️ **6-hour sprint · hard deadline 19:00 · team of 3.** Read `[[CLAUDE]]` for conventions, then `[[timeline]]` for the clock.
> 🎯 **Track: Attio — The Agentic CRM** (prize: iPad/member). **North star: close the loop without a human.**

## In one line
A **voice agent (SLNG)** qualifies a real-estate lead — **buy** or **rent/let** + property criteria — drops them
into **Attio** as a lead, then an **n8n** orchestrator **WhatsApps a link to a swipe app** of their top-matched
homes; the lead **swipes interested/pass** (or opts out), and those choices **write back to Attio**. **Attio's own
filtering** picks the matches (no Superlinked).

## The problem (🤔 assumption)
Real-estate lead handling is slow and manual: someone fills a form, an agent eventually calls back, leads go
cold, and matching people to the right properties is ad-hoc. **Speed-to-lead wins deals** — and the human is
the bottleneck. Attio's premise fits exactly: the CRM shouldn't just hold the lead, it should *act* on it.

## What we're building
1. **Voice intake** (SLNG + Gemini) — conversational qualification that **branches buy vs rent/let**, capturing property type
   (house/apartment), area, budget, beds, timeline. Gemini turns the speech into a structured lead. ⏭️ sell dropped. → `[[architecture]]`
2. **Write to Attio** (CRM) — Lead/Contact + Requirements; a **Listings** object is seeded. **Attio = system of record.** → `[[data-model]]`
3. **Match** — top **3–5 listings** against the lead's criteria (area + beds + price) via **Attio's native filtering**. ⏭️ no Superlinked, no custom matcher.
4. **Orchestrate → Swipe app** (n8n + our front-end) ★ — triggered from Attio → n8n **WhatsApps one link** to the **swipe app** ("Tinder for houses"); the lead swipes **interested/pass** through the matched homes, or **opts out** via the WhatsApp bot.
5. **Write back** — **both** the swipes and the opt-out **update Attio**, closing the loop both ways.

The wow: you *talk* to it, become a qualified lead, and within seconds you're **swiping your best-matched homes on WhatsApp** —
and every swipe lands back in the CRM. **No agent touched it.** → `[[demo]]`

## Why it can win (🤔 assumption)
- **Strongest Attio-track fit:** a real sales workflow (real-estate lead-to-deal), agentic, closes the loop without a human. → `[[tracks-and-prizes]]`
- **Partner tech:** **SLNG + Attio + n8n** core (≥3 ✅), + **Gemini** as the brain — lines up SLNG / n8n side challenges. ⏭️ Superlinked dropped (Attio matches). → `[[partners]]`
- **Creativity + complexity:** voice intake → CRM → Attio-native matching → a **swipe app that writes back to the CRM**. → `[[judging]]`

## Scope for 6 hours / 3 people (the bet)
Ship **one killer happy-path demo**:
- 🤔 One path: a **buyer calls → qualified → Attio lead → top 3–5 matched → n8n WhatsApps a swipe link → swipe live → choices write back to Attio**.
- 🤔 Seed a small **listings dataset** (~15–30) so the match (and the swipe cards) are visible; WhatsApp goes to **our own** number.
- ✅ **WhatsApp-only** (swipe link + opt-out bot); ⏭️ Telegram/email/outbound-call cut.
- ⚠️ **The swipe app is on the critical path now** — it's the centrepiece, not a stretch. It needs a host/URL WhatsApp can link to.
- 💡 Tavily (area/market enrichment) is **stretch**, not critical path. ⏭️ Superlinked dropped — Attio does the matching.
See the cut list + hour-by-hour in `[[timeline]]`; the 3-way split in `[[team]]`.

## Current state
- ✅ `decided` (2026-06-27): **Idea v4 — voice-first lead engine on Attio with a WhatsApp → swipe-app payoff.** → `[[decisions]]`
- ✅ `decided`: **team = 3**; partners core = **SLNG + Attio + n8n** (+ Gemini; ⏭️ Superlinked dropped — Attio matches).
- ✅ `decided`: **WhatsApp-only** channel; **swipe app is the centrepiece** (we ARE building a front-end); intake branches **buy vs rent/let**, sell dropped.
- ✅ `decided`: swipe app = **Palak** on **GitHub Pages**, writes **directly to the Attio person**; match = **Attio's native filtering**.
- 🟢 `built`: the **swipe-app UI** — `index.html` at the repo root (commit `98a7efe`): full Tinder-style deck, saved panel, notes + opt-out. Polished. **But** it runs on mock data with **no Attio data and no write-back yet**.
- ❓ `open`: project name; **Attio CORS from `*.github.io`** (verify); how many listings to seed. → `[[decisions]]`
- 🔨 next: wire the built UI to real data — **swap the mock `HOUSES` for the lead's matched listings + PATCH the Attio person on swipe** + enable Pages. Then the spine (P1→P2→P3). Build plan in `[[tasks]]`/`[[timeline]]`.

## Navigation
The idea → `[[concept]]`, `[[architecture]]`, `[[data-model]]`. The rules → `[[rules]]`,
`[[tracks-and-prizes]]`, `[[judging]]`, `[[partners]]`. The sprint → `[[timeline]]`, `[[tasks]]`,
`[[stack]]`, `[[team]]`. Shipping → `[[demo]]`, `[[submission]]`. Decisions → `[[decisions]]`.

## Open questions
- What do we call it? ("Orbit" is a leftover placeholder.)
- **Swipe-app stack + hosting** — what we build it in, and where it lives so WhatsApp can link to a public URL.
- Does **Attio allow CORS** from `*.github.io` so the swipe app can PATCH directly? (Verify early; else fall back to an n8n webhook.)
- How many listings to seed, and from where (curated mock vs a scraped/sample set)?
