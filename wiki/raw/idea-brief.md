---
title: "Project Idea Brief (raw source)"
type: raw
source: "Team — Iason, verbatim framing of the idea"
date_ingested: 2026-06-27
---

> **Raw source — the founder's own words.** Curated pages in `product/` distil from this.
> Keep this faithful; if a curated page drifts from the intent here, fix the page.

## The idea, as stated

> "Our idea is to get data from WhatsApp and Instagram, then store that data in a graph-like
> structure, store it in a Postgres DB, store part of that info in LightRAG. The LightRAG can be
> the chat interface. Then we could use something like a voice agent to ask for cool events that
> match your interests for the day or the week."

## Hard constraint, as stated

> "Btw we only have **6 hours**."

## Implied components (from the brief)

1. **Ingest** personal social data — WhatsApp + Instagram.
2. **Structure** it as a graph (entities + relationships: people, events, places, interests, dates).
3. **Persist** the graph in **Postgres**.
4. **Index** part of it in **LightRAG** (graph-based RAG) — LightRAG doubles as the **chat interface**.
5. **Surface** via a **voice agent** — "what are the cool events that match my interests this day / this week?"

## Open framing questions (resolve in `[[decisions]]`)
- Working name for the project? (none given yet — provisional name chosen in the wiki)
- WhatsApp / Instagram access path: exported data files vs. live API? (biggest scoping risk)
- Track: Open Innovation vs. Attio? (idea is not a CRM → Open Innovation assumed)
- Which 3+ partner techs to commit to? (need ≥3 to qualify)
