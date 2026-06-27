---
title: "Decisions & Open Questions"
type: decisions
status: working
date_updated: 2026-06-27
owner: shared
---

# Decisions & Open Questions

The decision log + the live open-questions queue. Nothing is `✅ decided` unless it lands here with a
date and a one-sentence why. See `[[overview]]` for the idea, `[[timeline]]` for the clock,
`[[partners]]` for the tech menu, `[[architecture]]` for how it fits together, `[[team]]` for the split.

---

## Decisions (✅)

| date | decision | why |
|---|---|---|
| 2026-06-27 | ✅ **IDEA v3 (committed)** — a **voice-first real-estate lead engine on Attio**: SLNG voice intake → Attio lead → Superlinked match → n8n multichannel outreach. | Genuine sales workflow = strongest Attio-track fit; closes the loop without a human; uses 4–5 partner techs. |
| 2026-06-27 | ✅ **Team = 3** — **Iason** (Voice/Intake) · **Alex** (Attio/Data, + Superlinked pending) · **Palak** (n8n orchestration + downstream). | One owner per pipeline section; build in parallel against agreed interfaces. → `[[team]]` |
| 2026-06-27 | ✅ **Core partners = SLNG + Attio + n8n** (+ Gemini as the brain). | ≥3 to qualify, all load-bearing; SLNG & n8n also unlock side challenges. → `[[partners]]` |
| 2026-06-27 | ✅ **Superlinked reranks BEFORE the outreach** — ideally as an HTTP node inside the n8n flow (rank, then act). | You decide *what to send* before n8n executes; "after n8n" only ranks responses (out of scope). 💡 stretch. |
| 2026-06-27 | ✅ **Attio is the system of record.** | The agent reads/writes Attio; "act on the CRM" is the track's north star. |
| 2026-06-27 | ✅ **Track = Attio — The Agentic CRM** (iPad/member). | Real-estate lead-to-deal is a real sales workflow; less crowded than Open Innovation. → `[[tracks-and-prizes]]` |
| 2026-06-27 | ⏭️→✅ **Superseded ideas** — (v1) personal event concierge, (v2) comms-ingestion relationship CRM. Kept in `raw/idea-brief.md` for history. | Real-estate intake is a cleaner, more demoable agentic-CRM story. |

*(Add a row the moment something gets committed in the room — date, decision, one-line rationale.)*

---

## Open questions (❓)

- ❓ **Project name?** — "Orbit" is a leftover placeholder from v1. Options: keep / rename (real-estate-flavoured). Owner: `<fill in>`
- ❓ **Which channels do we actually wire?** — Recommend **WhatsApp + one SLNG call** for the demo; Telegram/email "if time". Owner: `<fill in>`
- ❓ **Superlinked rerank target?** — **listings for a lead** (buyer-facing, most visceral) vs **leads by priority** (agent-facing scoring). Lean **listings-for-a-lead**. Owner: `<fill in>`
- ❓ **Listings dataset** — how many (~15–30 to make the rerank visible) and from where (curated mock vs sample/scraped)? Owner: `<fill in>`
- ❓ **Attio object model** — Leads/Contacts + Requirements + a **Listings** object + outreach/interaction log. Pin attributes early — intake, match, and outreach all depend on it. → `[[data-model]]`. Owner: `<fill in>`
- ❓ **Attio entry point** — REST API vs Attio MCP vs Workflows. Recommend **MCP or REST** for speed. → `[[stack]]`. Owner: `<fill in>`

---

## Cut list (⏭️)

Cutting is good — naming it here means we stop debating it. **Settled as cut** for the 6h:

- ⏭️ **All four channels** — wire WhatsApp + one SLNG call; Telegram/email are stretch only.
- ⏭️ **Real recipient targeting** — outreach goes to **our own** numbers/inboxes for the demo.
- ⏭️ **Superlinked / Tavily on the critical path** — both are stretch/bonus; the core demo must work without them.
- ⏭️ **"After n8n" reranking / response-ranking loop** — second-order; not for the hackathon.
- ⏭️ **Multi-user / auth / accounts** — one demo workspace, no login.
- ⏭️ **Robustness / error handling / polished UI** — happy path only; Attio's UI + voice is the surface.
- ⏭️ **Live property-portal scraping** — seed a curated listings set instead.
