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

**Owners:** P1 = Voice/Intake (Iason) · P2 = Attio/Data (Alex) · P3 = Orchestration/Outreach (Palak) · **🆕 Swipe app = Palak** (also P3). Names → `[[team]]`.

**Golden path = the demo:** buyer **calls SLNG** (buy/rent branch) → qualified → **Gemini structures a lead** → **written to Attio** → top **3–5 matched listings** → **n8n WhatsApps a link to the swipe app** → buyer **swipes interested/pass** → **swipes written back to Attio**. Anything off this path is `Later` or `⏭️ cut`. Protect `[[demo]]`.

**Dependency spine (build in this order):** Shared kickoff → Attio object model + write (P2) → Voice intake → lead JSON (P1) → **Attio's own filter surfaces the matches** (no custom matcher) → n8n WhatsApp swipe-link (P3) → **swipe app renders + PATCHes the Attio person directly** (Palak). **Attio is the spine, system of record, AND the matcher**; the **swipe app is the centrepiece**. ⏭️ Superlinked dropped (Attio does the matching); Tavily enrich hangs off the side as stretch.

---

## Shared — first 30 min (ALL three) *(Now)*
*Everything below depends on this. Don't start a slice until these are agreed.*

- ❓ Agree the **lead schema** — owner ALL — pin the fields the voice agent fills: intent (**buy/rent/let**), property type, area, budget, beds, timeline. ⏭️ sell dropped. The contract between P1 → P2 → P3. → `[[data-model]]`. — **Now**
- ❓ Agree the **Attio object model** — owner ALL — Lead/Contact (with `interested_listings` + `status`) + Requirements + a **Listings** object (with `photo_url`) + an outreach log. ⏭️ no separate Interest object (swipes PATCH the person). Pin attributes now. → `[[data-model]]`. — **Now**
- ✅ **Channel = WhatsApp only**; ✅ **write-back = swipe app PATCHes the Attio person directly** (no n8n hop). Pin **which person attributes** a swipe sets. ⚠️ **verify Attio CORS from `*.github.io`** now. → `[[decisions]]`. — **Now**
- ✅ **Swipe-app owner = Palak**, host = **GitHub Pages**. → `[[team]]`. — **Now**
- ❓ Set up **accounts + keys** — owner ALL — Attio workspace, SLNG, n8n, Gemini (Google account on site), **Twilio** (WhatsApp), **GitHub Pages repo** (Palak). Drop creds in `[[stack]]`. — **Now**
- ❓ Seed the **Listings dataset** (~15–30, **with photos**) — owner ALL (P2 lands it) — curated mock so the match + swipe cards are visible; agree shape now, load into Attio. `🤔 curated mock, not scraped`. Blocks the Attio match filter + a watchable swipe. — **Now**

---

## P1 — Voice / Intake
*Depends on: shared lead schema. Feeds: P2 (the lead JSON to write).*

- ❓ **SLNG voice agent** stood up — owner P1 — a callable agent that answers and runs the qualification script. `✅ SLNG = partner tech`. Dep: SLNG account. — **Now**
- ❓ **Conversation flow** — owner P1 — script the qualification: **branch buy vs rent/let** → property type → area → budget → beds → timeline; close with "WhatsApping you a swipe link". ⏭️ sell dropped. Dep: lead schema. — **Now**
- ❓ **Gemini → structured lead JSON** — owner P1 — turn the call answers into the agreed lead JSON (validate against schema). `✅ Gemini = partner tech`. Dep: flow + schema. — **Next**
- ❓ **Hand off to P2** — owner P1 — POST/emit the lead JSON to P2's Attio write client (agree the trigger/endpoint). Dep: lead JSON + P2 write client. — **Next**
- 💡 Confirm-back at end of call — owner P1 — agent reads the captured criteria back to the caller before hangup. Nice for the demo. — **Later**

## P2 — Attio / Data (the spine)
*Depends on: shared object model. Blocks: P3 (no outreach without a written lead). **Attio = system of record.***

- ❓ **Workspace + entry point** — owner P2 — free Attio workspace, API key, pick **REST or MCP**. `✅ Attio = partner tech`. `❓ entry point open` → `[[stack]]`. — **Now**
- ❓ **Build the object model** — owner P2 — create Lead/Contact (+ `interested_listings`, `status`) + Requirements + Listings + interaction log in Attio per the agreed schema. Dep: shared object model. — **Now**
- ❓ **Write client (lead + requirements)** — owner P2 — function that takes P1's lead JSON and upserts Lead/Contact + Requirements (no dupes). Dep: object model. — **Next**
- ❓ **Match = Attio filtered query** — owner P2 — use **Attio's native filtering** to return a lead's top 3–5 listings (by area + beds + price range). No Superlinked, no custom matcher. Expose it (or hand n8n the filter). Dep: seeded listings. — **Next**
- ❓ **Confirm the swipe write-back attrs** — owner P2 — make sure the person has `interested_listings` (reference) + `status`; the **swipe app PATCHes them directly** (no P2 endpoint needed). Verify a browser PATCH works (CORS). Dep: object model. — **Next**
- ❓ **Seed Listings into Attio** — owner P2 — load the ~15–30 curated listings (price/beds/area/type/**photo_url**). Dep: shared seed dataset. — **Now**

## P3 — Orchestration / Outreach
*Depends on: **P2 Attio write + the shared schema**. The north star: act without an agent in the loop. **n8n routes; the swipe app is the centrepiece.***

- ❓ **n8n trigger on new Attio lead** — owner P3 — flow fires when a lead lands (webhook/poll). `✅ n8n = partner tech`. Dep: P2 write client. — **Next**
- ❓ **Build the per-lead swipe URL** — owner P3 — in-flow, run the **Attio match filter** for the lead → bake the top 3–5 into an unguessable swipe-app link (`/s/<token>`). Dep: trigger + Attio filter + swipe-app host. — **Next**
- ❓ **WhatsApp send (the swipe link)** — owner P3 — WhatsApp the lead their swipe link (to our own number) via Twilio. `✅ WhatsApp-only`. Dep: URL + Twilio. — **Next**
- ❓ **Log the send back to Attio** — owner P3 — write the outreach touchpoint onto the lead. Dep: send + P2 write. — **Next**
- 💡 **Opt-out bot** — owner P3 — inbound WhatsApp "stop" → flip `Lead.status=opted_out`. `💡 first to cut if behind`. Dep: Twilio inbound. — **Later**
- ⏭️ **~~Route swipe write-back via n8n~~** — cut: the **swipe app PATCHes Attio directly** (no n8n hop). Only revive as the **CORS fallback** if browser writes are blocked.
- ⏭️ **~~Superlinked rerank node~~** — cut: **Attio's native filtering does the matching** now. (Superlinked could return as pure bonus if wildly ahead, but it's off the path.)
- 💡 **Tavily area/market enrich** — owner P3 — fold neighbourhood/market context into the swipe cards. `💡 stretch`. — **Later**

## 🆕 Swipe app — the centrepiece (owner: **Palak**)
*Lives at **`index.html`** in the repo root (committed `98a7efe`). Static HTML/JS, no backend. **The UI is built; the data + write-back are not.** Depends on: matches baked into the URL (or an Attio GET) + the person attributes to PATCH.*

- 🟢 **UI built** — owner Palak — `index.html`: full Tinder-style deck (drag/swipe, like/nope/undo), a "saved homes" panel, a notes/preferences panel, and an **opt-out** toggle. Polished. This was the hard part. ✅
- 🟢 **Renders cards** — owner Palak — cards show photo + price + beds/baths/sqft. *But* off a **hardcoded mock `HOUSES` array**, not real data.
- 🔨 **Swap mock → real per-lead matches** — owner Palak — replace the hardcoded `HOUSES` with the lead's top 3–5 (from the URL payload n8n bakes in, else an Attio GET). Dep: match delivery decided + Attio listings seeded. — **Next**
- ❓ **Write-back → Attio** — owner Palak — a swipe "yes" must **PATCH the Attio person's `interested_listings`**, and opt-out → `status`. Today swipes only fill an **in-memory** list (lost on refresh). ⚠️ needs CORS + a client-side token. Dep: write-back attrs + CORS check. — **Next**
- ❓ **Enable GitHub Pages + per-lead link** — owner Palak — turn on Pages for the repo (serves root `index.html`) and read a `?lead=<token>` param. Dep: Pages enabled. — **Next**
- ✅→ **Polish the UI** — already done (see "UI built").

---

## Shared — last 1.5h (ALL) *(Later)*
*The deadline workstream. Drafts can start mid-sprint; final lock is the last hour. See `[[submission]]`.*

- ❓ **Integrate end-to-end** — owner ALL — run the full happy path (call → Attio → match → WhatsApp swipe-link → swipe → write-back) once, clean. Dep: P1+P2+P3+swipe app. — **Later**
- ❓ **Demo script** — owner P2 — exact words + clicks for the 2-min walkthrough. Draft mid-sprint, lock late. → `[[demo]]`. — **Next**
- ❓ **README** — owner ALL — setup + every API/framework/tool used (required): **SLNG, Attio, n8n, Gemini** (+ Tavily if wired; ⏭️ Superlinked dropped). Build as we go. — **Next**
- ❓ **2-min video** — owner P2 (demo owner) — Loom of the live walkthrough. Dep: working golden path + script. — **Later**
- ❓ **Public GitHub repo** — owner ALL — push code, ensure it's public. Dep: README. — **Later**
- ❓ **Submit by 18:30** — owner P2 (demo owner) — form URL `<fill in>` ❓ open. Buffer before the 19:00 hard stop. Dep: video + repo. **Hard stop.** — **Later**

> 💡 Nominate a **demo owner** now — suggest **P2** (closest to Attio, the on-screen surface). Confirm in `[[team]]`.

---

## Now / Next / Later at a glance
- **Now:** shared kickoff (schema + object model w/ `interested_listings` + **CORS check** + accounts + seed listings w/ photos); SLNG agent + conversation flow (P1); Attio workspace + object model + seed listings (P2); GitHub Pages repo (Palak).
- **Next:** Gemini lead JSON + hand-off (P1); Attio write client + **match filter** (P2); n8n trigger → Attio filter → build swipe URL → WhatsApp send → log (P3/Palak); **swipe-app UI 🟢 done — now swap mock→real matches + PATCH Attio + enable Pages** (Palak); demo script + README.
- **Later:** opt-out bot + Tavily enrich (stretch); UI polish; integrate; video; public repo; **submit by 18:30**.

> **Deps to watch:** P3's swipe-link depends on **P2 Attio write + the Attio match filter**; the **swipe app depends on the matches (baked in by n8n or an Attio GET) + the person attrs to PATCH + CORS working**; P1 hand-off depends on **P2 write client**. ≥3 partner techs covered by the core spine: **SLNG + Attio + n8n + Gemini** (4; ⏭️ Superlinked dropped, swipe app is our own front-end). → `[[partners]]`. Open forks (name, dataset size) live in `[[decisions]]`.
