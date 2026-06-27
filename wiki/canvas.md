---
title: "Canvas — one screen"
type: canvas
status: working
date_updated: 2026-06-27
owner: shared
---

# Canvas — one screen

> ⏱️ 6-hour sprint, hard deadline **19:00**, team of 3. One screen, the whole project. Read `[[overview]]` first; build along `[[timeline]]`.
> 🎯 Track: **Attio — The Agentic CRM** (iPad/member). North star: qualify + match + **swipe-to-shortlist** **with no agent in the loop**.

## Problem
- 🤔 Real-estate lead handling is slow and manual — form comes in, an agent eventually calls back.
- 🤔 **Speed-to-lead wins deals**; the human is the bottleneck, so leads go cold while they wait.
- 🤔 Matching a buyer/renter to the right properties is ad-hoc and inconsistent. → `[[concept]]`

## Target user
- 🤔 Real-estate **agencies / agents / brokers** drowning in inbound leads.
- 🤔 Buyers / renters get **instant** service instead of a callback that never comes.
- 🤔 Attio's premise: a CRM shouldn't just *hold* the lead, it should *act* on it.

## Solution / what we demo
- A **voice agent qualifies a lead → Attio → matched listings → WhatsApp link → swipe app → choices back in Attio.**
- You *talk* to it, become a qualified lead, and within seconds you're **swiping your best-matched homes on WhatsApp** — every swipe lands in the CRM, **no agent touched it.** → `[[demo]]`

## How it works
- **SLNG voice intake** — qualifies + **branches buy vs rent/let** (⏭️ sell dropped) + property type, area, budget, beds, timeline. → `[[architecture]]`
- **Gemini structures** the conversation into a clean lead record.
- **Write to Attio** — Lead + Requirements; a **Listings** object is seeded. **Attio = system of record.** → `[[data-model]]`
- **Match top 3–5** listings against the lead's criteria via **Attio's native filtering** (area + beds + price). ⏭️ no Superlinked.
- **n8n WhatsApps a link** to the **swipe app** ("Tinder for houses"); the lead swipes interested/pass or **opts out** → both **write back to Attio**.

## Partner tech
- ✅ **CORE (4):** **SLNG** (voice) · **Attio** (system of record) · **n8n** (orchestrator) · **Gemini** (brain). Well past the ≥3 to qualify.
- 💡 **STRETCH:** **Tavily** (area/market enrich) — opens a side challenge if time allows. ⏭️ Superlinked dropped (Attio's filter does the matching). → `[[partners]]`

## Judging fit
- **Track north star** — qualify → match → reach out, **closing the loop without a human**. → `[[tracks-and-prizes]]`
- **Creativity** — voice as the *front door* into an agentic CRM.
- **Technical complexity** — voice intake → CRM write → Attio-native matching → a **swipe app that writes back to the CRM**. → `[[judging]]`

## In scope
- 🤔 One happy path: a **buyer calls → qualified → Attio lead → top 3–5 matched → WhatsApp swipe link → swipe live → choices back in Attio**.
- 🤔 Seed a small **listings dataset** (~15–30) so the match (and the swipe cards) are visible.
- ⚠️ **We ARE building a front-end** — the swipe app is the centrepiece (reverses the old "no front-end"). It needs a host/URL.

## Cut (⏭️)
- ⏭️ **Telegram, email, AND the SLNG outbound call** — channel = **WhatsApp only** (swipe link + opt-out). → `[[decisions]]`
- ⏭️ **Sell / landlord-let intake** — demo runs buy + rent-as-tenant.
- ⏭️ **Superlinked dropped** — Attio's own filtering does the matching. **Tavily** stays a stretch bonus, off the critical path.
- ⏭️ **Real recipients** — the WhatsApp link goes to **our own** number.
- ⏭️ **Live property-portal scraping** — seed a curated listings set instead.

## The demo in one sentence
- You call it, get qualified out loud, and seconds later it WhatsApps you a link to **swipe your best-matched homes Tinder-style** — every swipe logged in Attio, all hands-off on the agency side.

## Status
- ⚠️ Provisional name **Orbit** (leftover from the old events idea — may not fit real estate). → `[[decisions]]`
- ✅ team = **3**; split Voice/Intake · Attio/Data · Orchestration/Outreach. → `[[team]]`
- ✅ v4: **WhatsApp-only**; **swipe app = centrepiece** (Palak, GitHub Pages, writes **directly to the Attio person**); match = **Attio's native filtering** (⏭️ Superlinked dropped); intake **buy vs rent/let** (sell dropped). → `[[decisions]]`
- ❓ open: project name; **Attio CORS from `*.github.io`** (verify); how many listings to seed.
- ❓ open: team members + roles `<fill in>`; kickoff time `<fill in>`; Attio API keys/workspace `<fill in>`; submission form URL `<fill in>`. → `[[timeline]]`
