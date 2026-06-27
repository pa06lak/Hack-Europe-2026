# Orbit — a voice-first real-estate lead engine on Attio

> 🏆 {Tech: Europe} London AI Hackathon · **Attio track — The Agentic CRM**.
> North star: **close the loop without a human.** Name "Orbit" is provisional.

You **talk** to a voice agent, become a **qualified lead**, and within seconds get a **WhatsApp** with your
top-matched homes and a **callback** to book a viewing — no human touched it.

## How it works

```
[SLNG voice intake] → [Gemini → lead JSON] → [Attio: Lead + Requirements] → [n8n trigger]
        │                                              (system of record)          │
   qualify the caller                                                              ▼
   (intent · area · type ·                                  rank listings (Superlinked / filter)
    beds · budget · must-haves)                             → WhatsApp top matches + SLNG callback
                                                            → log outcomes back to Attio
```

Full pipeline + fallbacks: [`wiki/product/architecture.md`](wiki/product/architecture.md).

## Partner tech (≥3 to qualify — we use 4 core)
**SLNG** (voice in + out) · **Attio** (system of record) · **n8n** (orchestration) · **Gemini** (structuring).
Stretch: **Superlinked** (listing rerank), **Tavily** (area enrichment).

## Repo layout
```
contracts/        the lead JSON contract — schema + worked example (the spine everyone shares)
data/             ~22 curated London listings, seeded into Attio so the match is visible
voice/            P1 (Iason) — SLNG agent + Gemini structuring → lead JSON
attio/            P2 (Alex)  — object model + write/read client + listings seed
orchestration/    P3 (Palak) — n8n flow: trigger → rank → WhatsApp + SLNG call → log back
wiki/             the team brain (plan, decisions, demo script, submission checklist)
.env.example      all keys; copy to .env and fill in (never commit real keys)
```

## Setup (WIP)
1. `cp .env.example .env` and fill in keys (see `wiki/build/stack.md`).
2. Attio: create the object model + seed `data/listings.seed.json` (`attio/`).
3. Voice: SLNG agent + Gemini → lead JSON (`voice/`).
4. n8n: import the flow; wire WhatsApp + the SLNG call (`orchestration/`).
5. End-to-end: call in as a buyer → Attio lead appears → matched listings → WhatsApp + a callback.

## Status
Scaffolding stage. Demo path = the **buy** flow. Plan, hour-by-hour and cut-list live in
[`wiki/build/timeline.md`](wiki/build/timeline.md); decisions in [`wiki/decisions.md`](wiki/decisions.md).
