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
| 2026-06-27 | ✅ **IDEA v4 (current)** — outreach centrepiece pivots to a **WhatsApp → swipe-app ("Tinder for houses")** loop. n8n WhatsApps **one link** to a swipe UI of the lead's **top 3–5 matches**; the lead swipes interested/pass, or **opts out** via the WhatsApp bot; **both write back to Attio**. Supersedes the v3 multichannel blast. | More visceral + a single, phone-friendly wow moment; one channel = far less to break on stage. → `[[architecture]]` |
| 2026-06-27 | ✅ **We ARE building a front-end** — the swipe app is on the **critical path**, not a stretch. **Reverses** the v3 "Attio UI + voice, no front-end to build." | The swipe UI is now the centrepiece; it has to exist and be hosted at a URL WhatsApp can link to. |
| 2026-06-27 | ✅ **Single channel = WhatsApp** (carries the swipe link **and** the opt-out bot). Telegram, email, and the **SLNG outbound call** are **cut** from the demo. **Reverses** v3's "WhatsApp + one SLNG call." | Concentrate the build + the demo on one reliable channel; the swipe app replaces the outbound call as the payoff. |
| 2026-06-27 | ✅ **Intake branches = Buy vs Rent/Let; sell dropped** for the demo. | Two clean question sets; selling is a different (has-a-property) motion we're not showing. Updates `[[voice-intake]]` + the lead schema (`contracts/lead.schema.json`). |
| 2026-06-27 | ✅ **Swipe app: owner = Palak (also P3), host = GitHub Pages** (static `*.github.io`). | One owner for n8n + the swipe app keeps the WhatsApp→swipe→write-back seam in one head; GitHub Pages is free, public, zero-infra, and survives the account deletion (unlike Cloud Run). ⚠️ heavy load on Palak — watch it. |
| 2026-06-27 | ✅ **Write-back = the swipe app writes DIRECTLY to Attio** (PATCH the person/Lead record), not via an n8n webhook. | Fewer hops, one less flow to build. ⚠️ Two derisks (below): the Attio key ships in client-side JS, and Attio must allow CORS from `*.github.io`. → derisk notes. |
| 2026-06-27 | ✅ **IDEA v3 (committed)** — a **voice-first real-estate lead engine on Attio**: SLNG voice intake → Attio lead → match → n8n outreach. (Outreach surface revised by **v4** above.) | Genuine sales workflow = strongest Attio-track fit; closes the loop without a human on the agency side; uses 4–5 partner techs. |
| 2026-06-27 | ✅ **Team = 3** — **Iason** (Voice/Intake) · **Alex** (Attio/Data + matching) · **Palak** (n8n orchestration + the swipe app). | One owner per pipeline section; build in parallel against agreed interfaces. → `[[team]]` |
| 2026-06-27 | ✅ **Core partners = SLNG + Attio + n8n** (+ Gemini as the brain). | ≥3 to qualify, all load-bearing; SLNG & n8n also unlock side challenges. → `[[partners]]` |
| 2026-06-27 | ✅ **Match = Attio's native filtering** (area + beds + price) → top 3–5. **⏭️ Superlinked dropped** — it was only ever the matcher, and Attio already does it. | "Attio has the functionality inside already" — one fewer service, fewer hops, no separate index to build in 6h. We still clear ≥3 partners (SLNG+Attio+n8n+Gemini). ⚠️ trade-off: we lose the Superlinked side-challenge unless revived as pure bonus. |
| 2026-06-27 | ⏭️→ **Superseded: "Superlinked reranks before the outreach"** (the v3 decision). | Replaced by Attio-native matching above. Kept for history. |
| 2026-06-27 | ✅ **Attio is the system of record.** | The agent reads/writes Attio; "act on the CRM" is the track's north star. |
| 2026-06-27 | ✅ **Track = Attio — The Agentic CRM** (iPad/member). | Real-estate lead-to-deal is a real sales workflow; less crowded than Open Innovation. → `[[tracks-and-prizes]]` |
| 2026-06-27 | ⏭️→✅ **Superseded ideas** — (v1) personal event concierge, (v2) comms-ingestion relationship CRM. Kept in `raw/idea-brief.md` for history. | Real-estate intake is a cleaner, more demoable agentic-CRM story. |

*(Add a row the moment something gets committed in the room — date, decision, one-line rationale.)*

---

## Open questions (❓)

- ❓ **Project name?** — "Orbit" is a leftover placeholder from v1. Options: keep / rename (real-estate-flavoured). Owner: `<fill in>`
- ✅→ **Which channels?** — **resolved by v4: WhatsApp only** (swipe link + opt-out bot). Telegram/email/outbound-call cut.
- ✅→ **Swipe-app stack + hosting** — **resolved: static page on GitHub Pages (`*.github.io`), owner Palak.** Build in plain HTML/JS (no backend). → `[[stack]]`
- ✅→ **Swipe + opt-out write-back path** — **resolved: the app writes directly to Attio** (PATCH the person/Lead record). See the two derisks below. → `[[architecture]]`
- ✅→ **What feeds the swipe app** — **resolved: Attio's native filter** returns the top 3–5 (area + beds + price). n8n runs it and bakes the results into the swipe link. Owner: Palak
- ❓ **How the app reads a lead's matches** — does the static page GET them from Attio client-side (same CORS/key caveats as the write), or does n8n bake the matches into the URL / a per-lead JSON? Lean **bake-in** to avoid a second client-side Attio call. Owner: Palak → `[[architecture]]`
- ⏭️→ **Superlinked rerank target?** — **moot: Superlinked dropped** (Attio's filter matches `listings-for-a-lead`).
- ❓ **Listings dataset** — how many (~15–30 to make the match visible) and from where (curated mock vs sample/scraped)? Owner: `<fill in>`
- ❓ **Attio object model** — Leads/Contacts + Requirements + a **Listings** object + outreach/interaction log. Pin attributes early — intake, match, and outreach all depend on it. → `[[data-model]]`. Owner: `<fill in>`
- ❓ **Attio entry point** — REST API vs Attio MCP vs Workflows. Recommend **MCP or REST** for speed. → `[[stack]]`. Owner: `<fill in>`

---

## Research-informed recommendations (2026-06-27 — confirm at kickoff/booth → `[[derisk]]`)

From a background partner-tech deep-dive. Tagged 🤔 (recommended default) until the team confirms in the room.
**SLNG API specifics are unverified — confirm at the booth with a real key.**

- 🤔 **Gemini = POST-CALL normalizer, NOT SLNG's brain** — SLNG's conversation LLM is a fixed set; Gemini can't drive the call. SLNG captures the 6 answers; Gemini turns them into the `lead` JSON after the call (or skip Gemini, ship raw variables). Resolves the v3 "SLNG + Gemini" framing.
- 🤔 **n8n = self-host** — the community SLNG + Attio nodes need it; Cloud is locked + 14-day trial. Write to Attio via the generic **HTTP Request** node (no native Attio node).
- 🤔 **Attio → n8n trigger = Attio Workflow "Record created → HTTP request"** — carries field values in the body; raw developer webhooks are thin (IDs only).
- 🤔 **Lead dedupe key = email** (Attio email is unique by default; **phone is not**). Updated the contract + `[[data-model]]`.
- 🤔 **WhatsApp = Twilio sandbox** (`join <code>`, native n8n Twilio node) — no business verification. Re-join right before the demo (session lapses ~3 days).
- 🤔 **Gemini model = `gemini-2.5-flash`** + `generateContent` with `responseMimeType: application/json` + `responseSchema` (proven). Use a newer flash if the booth/docs confirm one.
- ⚠️ **Swipe-app derisk 1 — CORS.** A static `*.github.io` page can only write to Attio **if Attio's REST API allows cross-origin browser requests** from that origin. **Verify early** (a one-line `fetch` test). If it's blocked, the write-back must go through an **n8n webhook** (server-side) instead — keep that flow as the fallback.
- ⚠️ **Swipe-app derisk 2 — key exposure.** Writing directly from the browser means the **Attio token is visible in client-side JS**. Acceptable for the demo *only* because it's a **throwaway demo workspace + link to our own phone**; use the most-scoped token available and treat it as burned after the event. (Mirrors the hackathon's "don't leak keys" rule — this one is deliberate and contained.)

---

## Cut list (⏭️)

Cutting is good — naming it here means we stop debating it. **Settled as cut** for the 6h:

- ⏭️ **Telegram, email, AND the SLNG outbound call** — **v4 cut all of them**; the only channel is **WhatsApp** (swipe link + opt-out). The swipe app replaces the callback as the payoff.
- ⏭️ **Sell / let-as-landlord intake** — **v4** keeps **buy** + **rent/let-as-tenant**; selling is out for the demo.
- ⏭️ **Real recipient targeting** — outreach goes to **our own** number for the demo (open the swipe link on a phone on camera).
- ⏭️ **Superlinked — dropped entirely** (Attio's native filter does the matching). **Tavily** remains a stretch/bonus, off the critical path.
- ⏭️ **"After n8n" reranking / response-ranking loop** — second-order; not for the hackathon.
- ⏭️ **Multi-user / auth / accounts** — one demo workspace, no login; the swipe link is unguessable-token, not authed.
- ⏭️ **Robustness / error handling** — happy path only. (Note: a **polished swipe UI is now in scope** — it's the centrepiece; ⏭️ reverses the old "no front-end".)
- ⏭️ **Live property-portal scraping** — seed a curated listings set instead.
