---
title: "Canvas — one screen"
type: canvas
status: working
date_updated: 2026-06-27
owner: shared
---

# Canvas — one screen

> ⏱️ 6-hour sprint, hard deadline **19:00**, team of 3. One screen, the whole project. Read `[[overview]]` first; build along `[[timeline]]`.
> 🎯 Track: **Attio — The Agentic CRM** (iPad/member). North star: qualify + match + reach out **with no human in the loop**.

## Problem
- 🤔 Real-estate lead handling is slow and manual — form comes in, an agent eventually calls back.
- 🤔 **Speed-to-lead wins deals**; the human is the bottleneck, so leads go cold while they wait.
- 🤔 Matching a buyer/renter to the right properties is ad-hoc and inconsistent. → `[[concept]]`

## Target user
- 🤔 Real-estate **agencies / agents / brokers** drowning in inbound leads.
- 🤔 Buyers / renters get **instant** service instead of a callback that never comes.
- 🤔 Attio's premise: a CRM shouldn't just *hold* the lead, it should *act* on it.

## Solution / what we demo
- A **voice agent qualifies a lead → Attio → matched listings → autonomous multichannel outreach.**
- You *talk* to it, become a qualified lead, and within seconds it's messaging/calling you with your best-matched properties — **no human touched it.** → `[[demo]]`

## How it works
- **SLNG voice intake** — qualifies intent (buy/sell/rent) + property type, area, budget, beds, timeline. → `[[architecture]]`
- **Gemini structures** the conversation into a clean lead record.
- **Write to Attio** — Lead + Requirements; a **Listings** object is seeded. **Attio = system of record.** → `[[data-model]]`
- **Superlinked ranks** seeded listings against the lead's criteria — before outreach, ideally a node inside n8n. 💡 stretch.
- **n8n orchestrates** outreach: SLNG outbound call / WhatsApp / Telegram / email → log outcomes back to Attio.

## Partner tech
- ✅ **CORE (4):** **SLNG** (voice) · **Attio** (system of record) · **n8n** (orchestrator) · **Gemini** (brain). Well past the ≥3 to qualify.
- 💡 **STRETCH:** **Superlinked** (rerank listings) · **Tavily** (area/market enrich) — each opens a side challenge if time allows. → `[[partners]]`

## Judging fit
- **Track north star** — qualify → match → reach out, **closing the loop without a human**. → `[[tracks-and-prizes]]`
- **Creativity** — voice as the *front door* into an agentic CRM.
- **Technical complexity** — voice intake → CRM write → reranked matching → autonomous multichannel outreach. → `[[judging]]`

## In scope
- 🤔 One happy path: a **buyer calls → qualified → Attio lead → top-matched listings → WhatsApp + an SLNG call**.
- 🤔 Seed a small **listings dataset** (~15–30) so the match is visible.
- 🤔 Attio's UI + voice as the surface — no front-end to build.

## Cut (⏭️)
- ⏭️ **All four channels** — wire **WhatsApp + one SLNG call**; Telegram/email stretch only. → `[[decisions]]`
- ⏭️ **Superlinked / Tavily on the critical path** — both stretch; core demo works without them.
- ⏭️ **Real recipients** — outreach goes to **our own** numbers/inboxes.
- ⏭️ **Live property-portal scraping** — seed a curated listings set instead.

## The demo in one sentence
- You call it, get qualified out loud, and seconds later it WhatsApps you your best-matched listings and rings you back to book a viewing — all hands-off, all logged in Attio.

## Status
- ⚠️ Provisional name **Orbit** (leftover from the old events idea — may not fit real estate). → `[[decisions]]`
- ✅ team = **3**; split Voice/Intake · Attio/Data · Orchestration/Outreach. → `[[team]]`
- ❓ open: project name; which channels we actually wire; Superlinked rerank target (listings-for-lead vs lead-scoring); how many listings to seed.
- ❓ open: team members + roles `<fill in>`; kickoff time `<fill in>`; Attio API keys/workspace `<fill in>`; submission form URL `<fill in>`. → `[[timeline]]`
