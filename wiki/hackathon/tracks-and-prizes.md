---
title: "Tracks, Side Challenges & Prizes"
type: hackathon
status: working
date_updated: 2026-06-27
owner: shared
---

# Tracks, Side Challenges & Prizes

> What we can win, and what we're aiming at — for **idea v4** (voice-first real-estate
> lead engine on Attio with a WhatsApp → swipe-app payoff). Facts from [[hackathon-manual]];
> our picks are flagged and belong in [[decisions]].

## Tracks

- **Attio — The Agentic CRM** — prize: **iPad per team member**. Build an agent /
  headless system that automates a meaningful chunk of a sales, recruiting, or customer
  workflow (follow up on leads, research contacts, update deal status from a call, draft
  outreach). **North star: close the loop without a human in it.**
- **Open Innovation** — prize: **qualification for the Finalist Stage (3x)**. Build anything.

## Our track pick

- ✅ **Attio track — DECIDED 2026-06-27** (see [[decisions]]). Real-estate lead-to-deal is
  a genuine sales workflow, so we land on-track instead of in the crowded Open Innovation pool.
- Our pipeline — **voice intake → Attio lead → match → WhatsApp swipe app → write back** — maps
  straight onto two of Attio's own suggested directions:
  - **Inbound Lead Router** — SLNG voice agent qualifies a buyer/renter (buy/rent/let), Gemini
    structures it, we write the lead to Attio. The CRM *receives and routes* a fresh lead. → [[architecture]]
  - **Outbound Outreach Agent** — n8n picks up the new lead and **WhatsApps a link to the swipe app**;
    the buyer's swipes (and opt-out) log straight back to Attio. (⏭️ email/Telegram/call cut in v4.)
- 🤔 The track explicitly invites off-list problems too ("automate a meaningful chunk of a
  sales/recruiting/customer workflow"), so the named directions are a fit, not a cage.
- Why this wins on-track: we hit the north star — **qualify + match + reach out (swipe-to-shortlist) with no
  agent in the loop**, with Attio as the system of record. → [[overview]]

## Side challenges

- **SLNG** — best use of SLNG.
- **Aikido** — most secure build.
- **Superlinked** — best use of Superlinked.
- **n8n** — best use of n8n.

## Side challenges we chase

These ride on partner tech that's already load-bearing in the build — see [[partners]].
Only chase once the core loop is 🟢; don't let a side prize cost us the demo.

- 💡 **SLNG** — it's the **front door (voice intake)** that branches buy/rent and qualifies the lead.
  The whole demo starts here. (⏭️ v4 cut the outbound call.)
- 💡 **n8n** — the **orchestrator IS the entry point**: it runs the Attio match filter, builds the
  swipe link, and WhatsApps it off the Attio lead. Best-use case is baked in.
- ⏭️ **Superlinked** — **dropped**; Attio's native filter does the matching now, so there's no
  load-bearing Superlinked use to enter. (Would only return as a pure bonus if wildly ahead.)
- ⏭️ **Aikido** (most secure build) — not our focus; security hardening isn't where our
  points are in 6h.

## Prizes

- **Attio track** — **iPad per team member** (our target).
- **Finalist Stage** — credits + hardware, on top of the track prize. Total pool **>20k€**.
  Top 5 teams advance (4 Open Track + 1 Track Winner); jury then picks top 3.
  - **1st** — $5k Gemini credits · €5k SLNG credits · 10k Tavily credits · free Superlinked
    cluster credits · $50K credits + Mubit merch
  - **2nd** — $2.5k Gemini credits · €2K SLNG credits · 5k Tavily credits · free Superlinked
    cluster credits · $30K credits + Mubit merch
  - **3rd** — $1k Gemini credits · €1k SLNG credits · 3k Tavily credits · free Superlinked
    cluster credits · $10K credits + Mubit merch

## Related

[[partners]] · [[judging]] · [[decisions]] · source: [[hackathon-manual]]
