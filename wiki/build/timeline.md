---
title: "Timeline — the 6-hour plan"
type: build
status: working
date_updated: 2026-06-27
owner: shared
---

# Timeline — the 6-hour plan

> ⏱️ **Hard deadline 19:00.** Submit by **18:30** to keep a 30-min buffer. See `[[submission]]`.
> The whole point of this page: keep us on **one happy path** and protect the demo (`[[demo]]`).
> 🎯 Track = **Attio — The Agentic CRM**. North star: qualify + match + **swipe-to-shortlist** **with no agent in the loop**.

- **Kickoff:** `<fill in>` ❓ open — assume **~13:00** (6h before 19:00). All H-offsets are from kickoff.
- Tasks + owners live in `[[tasks]]`; the 3-way split in `[[team]]`; pipeline shape in `[[architecture]]`.
- Owners below are placeholders: `<fill in>` ❓ open — assign at H+0:00.
- **Slices** (one owner each, see `[[team]]`) — ⚠️ **Palak carries two: P3 + the swipe app**:
  - **P1 — Voice/Intake** (SLNG + Gemini): voice call (buy/rent branch) → structured lead JSON.
  - **P2 — Attio/Data**: object model (+ `interested_listings` on the person) + write/read client + seeded listings (with photos). **Attio = system of record.**
  - **P3 — Orchestration/Outreach** (n8n, **Palak**): Attio trigger → **WhatsApp the swipe-link** (+ opt-out).
  - **🆕 Swipe app** (**Palak**): "Tinder for houses" on **GitHub Pages** (static) — renders cards, captures swipe, **PATCHes the Attio person directly**.
- Core partners (4) = **SLNG + Attio + n8n + Gemini** (≥3 to qualify, `[[partners]]`). Stretch: **Tavily** (enrich). ⏭️ **Superlinked dropped** — Attio's own filter does the matching. The swipe app is **our own front-end**, not a partner tech.

---

## 🔴 CUT LINE: feature freeze at **H+4:30 (~17:30)**
After this point we only **demo, polish, and ship**. No new features, no refactors. If it isn't working at H+4:30, it drops to the **fallback ladder** (below) — we do not chase it.

---

## Hour-by-hour

### 🔨 H+0:00–0:30 — Setup · ALL THREE TOGETHER (~13:00–13:30)
**GOAL:** the contract is agreed and nobody can block anyone. **THE most important 30 min** — get the interfaces right, then split.
- Together (no splitting yet):
  - Agree the **lead schema** (intent **buy/rent/let** · property type · area · budget · beds · timeline) — the JSON P1 emits, P2 stores, P3 reads. ⏭️ sell dropped.
  - Agree the **Attio object model** — Lead/Contact + Requirements + a **Listings** object (with `photo_url`) + an **Interest** object (swipe verdict) + outreach log (`[[data-model]]`).
  - ✅ **Channel = WhatsApp only** (swipe link + opt-out). ✅ **Write-back = app PATCHes the Attio person directly.** Pin **which person attributes** a swipe sets (`interested_listings`, `status`).
  - ⚠️ **Verify Attio CORS from `*.github.io` now** (one-line `fetch` test) — if blocked, the write-back routes through an n8n webhook instead. → `[[decisions]]`
  - Set up accounts/keys → drop in `[[stack]]`: **Attio** free workspace, **SLNG**, **n8n**, **Gemini** (`goo.gle/hackathon-account`), **Twilio** (WhatsApp), + a **GitHub Pages repo** for the swipe app (Palak).
  - Seed a **small Listings set** (~15–30, **with photos**) so the match + swipe cards are visible — owner P2 ❓.
  - Confirm slices (P1=Iason · P2=Alex · P3+swipe=Palak) and repo init.
- **done =** lead schema + object model (+ `interested_listings`) + the swipe→Attio write-back contract written in `[[tasks]]`; CORS verified (or webhook fallback chosen); every member has repo + keys; ~15–30 listings (with photos) seeded; each person owns a slice.

### H+0:30–2:00 — Build slices in parallel (~13:30–15:00)
**GOAL:** each slice works standalone against a **mock of its input**. No cross-blocking.
- Parallel:
  - **P1 (Voice/Intake):** SLNG voice agent branches buy/rent + qualifies → **Gemini** structures answers → emits the **lead JSON** (to console/file for now) — owner `<fill in>` ❓ open.
  - **P2 (Attio/Data):** stand up the **object model** (+ Interest) + a small **write/read client**; load the seeded **listings**; expose "create lead + requirements", "list listings", and **accept a swipe/opt-out write-back** — owner `<fill in>` ❓ open.
  - **P3 (Orchestration/Outreach):** **n8n** flow with a trigger → **WhatsApp send** of a (hardcoded) **swipe URL** to our own number, off a **mock Attio record** — owner `<fill in>` ❓ open.
  - **🆕 Swipe app (Palak):** 🟢 **UI already built** — `index.html` (repo root) has the full swipe deck, saved panel, notes + opt-out, off a mock `HOUSES` array. Remaining: swap mock→real matches, PATCH Attio on swipe, enable Pages.
- **done =** P1 prints a valid lead JSON from a spoken call; P2 creates a lead + reads listings (+ the person has an `interested_listings` attr) in the real Attio workspace; P3 sends a WhatsApp swipe-link from n8n on a mock record; the swipe app renders mock cards and captures swipes.

### H+2:00–3:30 — First integration (~15:00–16:30)
**GOAL:** connect the spine — P1 → P2 → P3 with real data, not mocks.
- Parallel → converge:
  - **P1 → P2:** the real **lead JSON writes a Lead + Requirements** into Attio — owner `<fill in>` ❓ open.
  - **P2 → P3:** **n8n triggers off the new Attio lead**, reads the matched listings, builds the **per-lead swipe URL**, and WhatsApps it — owner `<fill in>` ❓ open.
  - **Swipe app (Palak):** the page reads the lead's **real matched listings** (baked into the URL by n8n, or a client-side Attio GET) and **PATCHes the swipes onto the Attio person directly**.
  - **P3:** wire the **Attio match filter** into the flow (area+beds+price → top 3–5) before building the URL. ⏭️ no Superlinked.
- **done =** writing a lead to Attio (from P1) makes n8n fire, a WhatsApp swipe-link lands, the app opens showing that lead's real matches, and a swipe writes back to Attio. The loop is connected both ways.

### H+3:30–4:30 — End-to-end happy path (~16:30–17:30)
**GOAL:** the whole loop runs from a real voice call; polish the **one** path.
- Together on the seam:
  - **P1:** buyer **calls** → qualified → lead written to Attio — owner `<fill in>` ❓ open.
  - **P2:** lead + requirements land; **top 3–5 matched listings** resolve via **Attio's native filter** (area+beds+price) — owner `<fill in>` ❓ open.
  - **P3:** n8n fires → **WhatsApp swipe-link** reaches our phone — owner `<fill in>` ❓ open.
  - **Swipe app (Palak):** open the link → **swipe the matches** → **interested listings PATCHed onto the Attio person** (opt-out 💡 if time).
- **done =** one clean run: speak to the agent → Attio lead appears → matched listings → WhatsApp swipe-link on our phone → swipe → interested listings land on the Attio lead. No agent touched it.

> **⬆️ Hits the CUT LINE here. Feature freeze at H+4:30.**

### H+4:30–5:15 — Demo prep (~17:30–18:15)
**GOAL:** a repeatable, clean 2-minute demo recorded.
- Parallel:
  - **P2:** pre-seed the **demo lead + listings** that show the match best — owner `<fill in>` ❓ open.
  - **All:** lock the **scripted happy path** (`[[demo]]`); dry-run it twice — owner `<fill in>` ❓ open.
  - **P1/P3:** record the **2-min Loom** (solution explanation + live walkthrough — required, `[[submission]]`) — owner `<fill in>` ❓ open.
- **done =** the 2-min video is recorded and saved; the live script runs twice without a hitch.

### H+5:15–6:00 — Ship (~18:15–19:00)
**GOAL:** submitted, with buffer.
- Parallel:
  - **README + repo docs:** setup steps + APIs/tools used — **SLNG · Attio · n8n · Gemini** (+ Tavily if used; ⏭️ Superlinked dropped) (`[[submission]]`) — owner `<fill in>` ❓ open.
  - Fill the **submission form** (`<fill in>` form URL ❓ open) — owner `<fill in>` ❓ open.
  - **BUFFER** for the inevitable last-minute break.
- **done = SUBMITTED BY 18:30.** Public GitHub repo + 2-min video + README + form. Anything after is bonus.

---

## "If behind" fallback ladder
Drop down a rung the moment a stage misses its `done` check. A demoed fallback beats a broken feature.
- **Opt-out bot → skip.** 🤔 Drop the WhatsApp opt-out first; the swipe write-back alone closes the loop.
- **Write-back → interested-only.** 🤔 Log just `interested` swipes; skip `pass`. The CRM still visibly updates.
- **Match = Attio's own filter** (price/beds/area → top 3–5). 🤔 No Superlinked, no custom matcher; if the filter query is fiddly, hardcode the demo lead's 3–5.
- **WhatsApp send → open the URL directly.** 🤔 If Twilio is flaky, just open the per-lead swipe URL on the phone on camera.
- **Voice intake → typed form.** 🤔 If SLNG intake won't land by H+4:30, capture the same lead via a typed form → same JSON → same pipeline (incl. the swipe app).
- **Live listings → seeded mock.** 🤔 Never scrape live; the seeded ~15–30 listings (with photos) are the plan (`[[overview]]`).

## Reminders
- Protect the demo: every choice answers "does this get us to the 2-min demo?" If not → ⏭️ cut.
- Build against a **mock of your input** until H+2:00 so the three slices never block each other.
- Flip task tags 🔨 → 🟢 only when it actually *works*, not when code is written.
- Submit early (18:30), polish in the buffer. Don't gamble the deadline. → `[[submission]]`
