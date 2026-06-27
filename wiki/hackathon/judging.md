---
title: "Judging — criteria & how we win points"
type: hackathon
status: working
date_updated: 2026-06-27
owner: shared
---

# Judging — criteria & how we win points

How we're judged, and how we optimise for it — for **idea v3**: a **voice-first real-estate lead engine on
Attio** (qualify → match → reach out, no human in the loop). Official criteria:
https://techeurope.notion.site/judgin-criteria → `[[overview]]`

## Stage 1 — Pre-selection (criteria)
- **Creativity** — judged on the idea.
- **Technical complexity** — judged on the build.
- **Bonus: effective use of partner technologies** — extra points, our easiest lever. See `[[partners]]`.
- Outcome: 5 finalist teams advance (4 Open Track + 1 Track winner).

## Attio track north star
- The agent **automates a real workflow and acts WITHOUT a human in the loop.** → `[[tracks-and-prizes]]`
- Judges want **genuine autonomy** — qualify → match → reach out — **not a form** or CRUD UI.
- Our proof: a buyer *talks* to the voice agent, Attio populates itself, and matched listings go out by WhatsApp + an SLNG call — no human touched it. → `[[demo]]`

## Stage 2 — Finalist Stage
- Live **5-minute presentation** before jury + audience.
- After all presentations, the jury picks the **top 3**.
- So: Stage 1 is the wiki/video sell, Stage 2 is a live talk — different muscle, plan for both. → `[[demo]]`

## How we maximise each
**Creativity** 🤔
- Angle: a **voice real-estate agent that qualifies you and instantly reaches out with matched homes.**
- The hook: *you talk to it, and seconds later your phone rings/pings with your best-matched properties.* Lead with that line. 💡

**Technical complexity** 🤔
- A *real* autonomous pipeline, not one API call: **voice intake (SLNG) → Gemini structuring → Attio → Superlinked rerank → n8n multichannel outreach.** → `[[architecture]]`
- Show the architecture for ~10 seconds (one diagram), then get back to the demo. 💡
- Name the stages out loud so judges register the depth.

**Partner-tech bonus** ✅
- 4 core: **SLNG** (voice) + **Attio** (system of record) + **n8n** (orchestration) + **Gemini** (structuring), + **Superlinked** (rerank). → `[[partners]]`
- **Name them out loud** in the demo and **show the logos** on screen — bonus points only count if the judge notices. 🤔
- Lines up for the **SLNG** and **n8n** side challenges too (both load-bearing, not bolted on). 💡

**Track fit** 🤔
- Show the **loop close**: lead qualified by voice → Attio updates itself → WhatsApp + a call go out → outcome logged back, **no human in the loop.**
- Maps onto Attio's own suggested directions — *Inbound Lead Router* + *Outbound Email/Outreach Agent*. → `[[tracks-and-prizes]]`

## Practical realities 🤔
- Judges spend **little time per project** — lead with the **voice call**.
- **Show Attio populating live** and the **WhatsApp landing on a real phone** — make the autonomy obvious and legible on screen.
- Keep the demo to **one happy path** (buyer calls → qualified → matched → WhatsApp + SLNG call), no detours, no jargon walls.
- **Demo legibility beats feature completeness.** A clean story where the loop visibly closes wins over a broad-but-confusing build.

## Anti-patterns to avoid ⏭️
- **A demo that's just a form + CRUD on Attio** — that's a glorified spreadsheet; the autonomy is the whole point.
- **Hiding the autonomy** — if the judge can't *see* the agent act on its own, we get no credit for it.
- **Trying to show all 4 channels and breaking** — wire WhatsApp + one SLNG call; Telegram/email are stretch only. → `[[overview]]`
- **A demo that needs setup** — pre-seed listings, pre-warm services, send to our own numbers; never live-auth on stage.

## Related
`[[demo]]` · `[[partners]]` · `[[tracks-and-prizes]]` · `[[overview]]`
