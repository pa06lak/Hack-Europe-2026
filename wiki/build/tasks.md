---
title: "Tasks — the board"
type: build
status: working
date_updated: 2026-06-27
owner: shared
---

# Tasks — the board

> ⏱️ 6-hour sprint, hard deadline **19:00**, 3 people, **Attio track**. Tasks are small and demo-first. The plan-by-the-clock lives in `[[timeline]]`; the 3-way split in `[[team]]`; services/keys in `[[stack]]`; pipeline shape in `[[architecture]]`.

**Tag key:** ❓ open = not started · 🔨 building · 🟢 done · 🤔 assumption · 💡 idea · ⏭️ cut. Flip 🔨 → 🟢 only when it actually runs.

**Owners:** P1 = Voice/Intake · P2 = Attio/Data (spine) · P3 = Orchestration/Outreach. Names → `[[team]]` (❓ `<fill in>`).

**Golden path = the demo:** buyer **calls SLNG** → qualified → **Gemini structures a lead** → **written to Attio** → top **matched listings** → **n8n** sends **WhatsApp + an SLNG outbound call** → outcomes logged back to Attio. Anything off this path is `Later` or `⏭️ cut`. Protect `[[demo]]`.

**Dependency spine (build in this order):** Shared kickoff → Attio object model + write (P2) → Voice intake → lead JSON (P1) → n8n outreach (P3). **Attio is the spine and system of record**; **n8n is the centrepiece**. Superlinked rerank + Tavily enrich hang off the side and are stretch.

---

## Shared — first 30 min (ALL three) *(Now)*
*Everything below depends on this. Don't start a slice until these are agreed.*

- ❓ Agree the **lead schema** — owner ALL — pin the fields the voice agent fills: intent (buy/sell/rent), property type, area, budget, beds, timeline. This is the contract between P1 → P2 → P3. → `[[data-model]]`. — **Now**
- ❓ Agree the **Attio object model** — owner ALL — Lead/Contact + Requirements + a **Listings** object + an outreach/interaction log. Pin attributes now. → `[[data-model]]`. — **Now**
- ❓ Agree the **channel list** — owner ALL — `🤔 WhatsApp + one SLNG call` for the demo; Telegram/email `⏭️ stretch`. → `[[decisions]]`. — **Now**
- ❓ Set up **accounts + keys** — owner ALL — Attio workspace, SLNG, n8n, Gemini (Google account on site). Drop creds in `[[stack]]`. — **Now**
- ❓ Seed the **Listings dataset** (~15–30) — owner ALL (P2 lands it) — curated mock so the match is visible; agree shape now, load into Attio. `🤔 curated mock, not scraped`. Blocks Superlinked + a watchable match. — **Now**

---

## P1 — Voice / Intake
*Depends on: shared lead schema. Feeds: P2 (the lead JSON to write).*

- ❓ **SLNG voice agent** stood up — owner P1 — a callable agent that answers and runs the qualification script. `✅ SLNG = partner tech`. Dep: SLNG account. — **Now**
- ❓ **Conversation flow** — owner P1 — script the qualification: intent (buy/sell/rent) → property type → area → budget → beds → timeline. Dep: lead schema. — **Now**
- ❓ **Gemini → structured lead JSON** — owner P1 — turn the call answers into the agreed lead JSON (validate against schema). `✅ Gemini = partner tech`. Dep: flow + schema. — **Next**
- ❓ **Hand off to P2** — owner P1 — POST/emit the lead JSON to P2's Attio write client (agree the trigger/endpoint). Dep: lead JSON + P2 write client. — **Next**
- 💡 Confirm-back at end of call — owner P1 — agent reads the captured criteria back to the caller before hangup. Nice for the demo. — **Later**

## P2 — Attio / Data (the spine)
*Depends on: shared object model. Blocks: P3 (no outreach without a written lead). **Attio = system of record.***

- ❓ **Workspace + entry point** — owner P2 — free Attio workspace, API key, pick **REST or MCP**. `✅ Attio = partner tech`. `❓ entry point open` → `[[stack]]`. — **Now**
- ❓ **Build the object model** — owner P2 — create Lead/Contact + Requirements + Listings + interaction log in Attio per the agreed schema. Dep: shared object model. — **Now**
- ❓ **Write client (lead + requirements)** — owner P2 — function that takes P1's lead JSON and upserts Lead/Contact + Requirements (no dupes). Dep: object model. — **Next**
- ❓ **Read queries for P3** — owner P3 — expose "get lead + its requirements" and "list listings" so P3/Superlinked can rank. Dep: write client + seeded listings. — **Next**
- ❓ **Seed Listings into Attio** — owner P2 — load the ~15–30 curated listings (price/beds/area/type). Dep: shared seed dataset. — **Now**

## P3 — Orchestration / Outreach
*Depends on: **P2 Attio write + the shared schema**. The north star: act without a human in the loop. **n8n = centrepiece.***

- ❓ **n8n trigger on new Attio lead** — owner P3 — flow fires when a lead lands (webhook/poll). `✅ n8n = partner tech`. Dep: P2 write client. — **Next**
- ❓ **Pull lead + listings** — owner P3 — in-flow, fetch the lead + requirements + candidate listings. Dep: P2 read queries. — **Next**
- ❓ **WhatsApp send** — owner P3 — message the lead their top-matched listings (to our own number). Dep: trigger + listings. — **Next**
- ❓ **SLNG outbound call** — owner P3 — trigger an SLNG call back to the lead (to our own number). Dep: trigger + SLNG. — **Next**
- ❓ **Log outcomes back to Attio** — owner P3 — write what was sent/called onto the lead record (closes the loop). Dep: sends + P2 write. — **Next**
- 💡 **Superlinked rerank node** — owner P3 — HTTP node *inside* n8n that reranks listings against the lead's criteria **before** the sends. `💡 stretch/bonus`. `✅ Superlinked = partner tech`. Dep: **seeded listings** + read queries. — **Later**
- ⏭️ **Telegram / email channels** — owner P3 — `⏭️ stretch only`; wire after WhatsApp + call work. — **Later**
- 💡 **Tavily area/market enrich** — owner P3 — fold neighbourhood/market context into the outreach. `💡 stretch`. — **Later**

---

## Shared — last 1.5h (ALL) *(Later)*
*The deadline workstream. Drafts can start mid-sprint; final lock is the last hour. See `[[submission]]`.*

- ❓ **Integrate end-to-end** — owner ALL — run the full happy path (call → Attio → match → WhatsApp + call) once, clean. Dep: P1+P2+P3. — **Later**
- ❓ **Demo script** — owner P2 — exact words + clicks for the 2-min walkthrough. Draft mid-sprint, lock late. → `[[demo]]`. — **Next**
- ❓ **README** — owner ALL — setup + every API/framework/tool used (required): **SLNG, Attio, n8n, Gemini** (+ Superlinked/Tavily if wired). Build as we go. — **Next**
- ❓ **2-min video** — owner P2 (demo owner) — Loom of the live walkthrough. Dep: working golden path + script. — **Later**
- ❓ **Public GitHub repo** — owner ALL — push code, ensure it's public. Dep: README. — **Later**
- ❓ **Submit by 18:30** — owner P2 (demo owner) — form URL `<fill in>` ❓ open. Buffer before the 19:00 hard stop. Dep: video + repo. **Hard stop.** — **Later**

> 💡 Nominate a **demo owner** now — suggest **P2** (closest to Attio, the on-screen surface). Confirm in `[[team]]`.

---

## Now / Next / Later at a glance
- **Now:** shared kickoff (schema + object model + channels + accounts + seed listings); SLNG agent + conversation flow (P1); Attio workspace + object model + seed listings (P2).
- **Next:** Gemini lead JSON + hand-off (P1); Attio write client + read queries (P2); n8n trigger → pull → WhatsApp + SLNG call → log outcomes (P3); demo script + README.
- **Later:** Superlinked rerank node + Tavily enrich + Telegram/email (P3 stretch); integrate; video; public repo; **submit by 18:30**.

> **Deps to watch:** P3 outreach depends on **P2 Attio write + the agreed schema**; Superlinked depends on **seeded listings**; P1 hand-off depends on **P2 write client**. ≥3 partner techs covered by the core spine: **SLNG + Attio + n8n + Gemini** (4). → `[[partners]]`. Open forks (name, channels, rerank target, dataset size) live in `[[decisions]]`.
