---
title: "Tracks, Side Challenges & Prizes"
type: hackathon
status: working
date_updated: 2026-06-27
owner: shared
---

# Tracks, Side Challenges & Prizes

> What we can win, and what we're aiming at — for **idea v3** (voice-first real-estate
> lead engine on Attio). Facts from [[hackathon-manual]]; our picks are flagged and
> belong in [[decisions]].

## Tracks

- **Attio — The Agentic CRM** — prize: **iPad per team member**. Build an agent /
  headless system that automates a meaningful chunk of a sales, recruiting, or customer
  workflow (follow up on leads, research contacts, update deal status from a call, draft
  outreach). **North star: close the loop without a human in it.**
- **Open Innovation** — prize: **qualification for the Finalist Stage (3x)**. Build anything.

## Our track pick

- ✅ **Attio track — DECIDED 2026-06-27** (see [[decisions]]). Real-estate lead-to-deal is
  a genuine sales workflow, so we land on-track instead of in the crowded Open Innovation pool.
- Our pipeline — **voice intake → Attio lead → autonomous multichannel outreach** — maps
  straight onto two of Attio's own suggested directions:
  - **Inbound Lead Router** — SLNG voice agent qualifies a buyer/seller/renter, Gemini
    structures it, we write the lead to Attio. The CRM *receives and routes* a fresh lead. → [[architecture]]
  - **Outbound Email Agent** — n8n picks up the new lead and runs outreach (SLNG call,
    WhatsApp, + email/Telegram as stretch), logging outcomes back to Attio.
- 🤔 The track explicitly invites off-list problems too ("automate a meaningful chunk of a
  sales/recruiting/customer workflow"), so the named directions are a fit, not a cage.
- Why this wins on-track: we hit the north star — **qualify + match + reach out with no
  human in the loop**, with Attio as the system of record. → [[overview]]

## Side challenges

- **SLNG** — best use of SLNG.
- **Aikido** — most secure build.
- **Superlinked** — best use of Superlinked.
- **n8n** — best use of n8n.

## Side challenges we chase

These ride on partner tech that's already load-bearing in the build — see [[partners]].
Only chase once the core loop is 🟢; don't let a side prize cost us the demo.

- 💡 **SLNG** — it's the **front door (voice intake) and an outbound channel (the call)**.
  Two strong uses in one build, not bolted on.
- 💡 **n8n** — the **orchestrator IS the entry point**: it drives the whole outreach loop
  off the Attio lead. Best-use case is baked in.
- 💡 **Superlinked** — **listing rerank** against the lead's criteria, ideally a node inside
  the n8n flow. Stretch, but a clean, demoable use.
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
