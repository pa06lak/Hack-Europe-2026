# Tech:Europe Hackathon — Team Brain 🧠

The shared map for our team at the **{Tech: Europe} London AI Hackathon**. Keeps the *idea*, the
*build*, and the *submission* aligned while the clock runs. Not the code repo, not a pitch deck —
the place everyone checks to know what we're building, who's doing what, and what's left.

> ⏱️ **6-hour sprint · hard deadline 19:00 · team of 3.** Submit by **18:30** for a buffer.
> 🎯 **Track: Attio — The Agentic CRM** (prize: iPad/member). North star: qualify + match + reach out with **no human in the loop**.
> 🛰️ **Provisional name: _Orbit_** — a **voice-first real-estate lead engine on Attio**: an SLNG voice agent
> qualifies a buyer/seller/renter, drops them into Attio, and **n8n** runs autonomous multichannel outreach
> (call · WhatsApp · Telegram · email) — with **Superlinked** matching listings to each lead.
> 🔁 **Idea v3 (2026-06-27)** — earlier iterations (event concierge → comms-CRM) are in [decisions](decisions.md).

This is an Obsidian-style wiki: pages cross-link with `[[wikilinks]]`. Conventions live in
[`CLAUDE.md`](CLAUDE.md). Open the folder in Obsidian for the graph view, or browse on GitHub.

## Read first (in order)
1. [`CLAUDE.md`](CLAUDE.md) — conventions, status tags, slug map
2. [`overview.md`](overview.md) — what we're building + current state
3. [`build/timeline.md`](build/timeline.md) — the 6-hour clock (the most important page)
4. [`build/tasks.md`](build/tasks.md) — what to pick up next

## Navigation

| Area | Pages |
|---|---|
| **Start here** | [overview](overview.md) · [canvas](canvas.md) *(one-screen summary)* |
| **The hackathon** | [rules](hackathon/rules.md) · [tracks & prizes](hackathon/tracks-and-prizes.md) · [judging](hackathon/judging.md) · [partners](hackathon/partners.md) *(≥3 to qualify)* |
| **The product** | [concept](product/concept.md) · [voice-intake](product/voice-intake.md) *(the questions)* · [architecture](product/architecture.md) · [data-model](product/data-model.md) |
| **The build** | [timeline](build/timeline.md) · [tasks](build/tasks.md) · [stack](build/stack.md) |
| **Shipping** | [demo](pitch/demo.md) *(2-min script)* · [submission](pitch/submission.md) *(checklist)* |
| **Running record** | [decisions](decisions.md) · [team](team.md) |
| **Source material** | [raw/hackathon-manual](raw/hackathon-manual.md) · [raw/idea-brief](raw/idea-brief.md) |

## The status tags (used everywhere)
✅ `decided` · 🔨 `building` · 🟢 `done` (works!) · 🤔 `assumption` · ❓ `open` · 💡 `idea` · ⏭️ `cut`

> The one rule: **separate what we're building from what we're hoping.** Cutting scope is good —
> name it `⏭️ cut` so we stop debating it. Protect the demo. Submit on time.

## First moves at kickoff
- [ ] Fill in [team](team.md) + claim owners in [tasks](build/tasks.md)
- [ ] Resolve the open forks in [decisions](decisions.md) — name, which channels to wire, the listings dataset, the lead schema / Attio object model
- [ ] **First 30 min, all 3 together:** agree the lead schema + Attio object model + channel list (see [team](team.md))
- [ ] Set up the [Attio](https://attio.com/) workspace + drop accounts/keys into [stack](build/stack.md), then start the clock on [timeline](build/timeline.md)
