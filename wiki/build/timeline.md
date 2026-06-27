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
> 🎯 Track = **Attio — The Agentic CRM**. North star: qualify + match + reach out **with no human in the loop**.

- **Kickoff:** `<fill in>` ❓ open — assume **~13:00** (6h before 19:00). All H-offsets are from kickoff.
- Tasks + owners live in `[[tasks]]`; the 3-way split in `[[team]]`; pipeline shape in `[[architecture]]`.
- Owners below are placeholders: `<fill in>` ❓ open — assign at H+0:00.
- **Three slices** (one owner each, see `[[team]]`):
  - **P1 — Voice/Intake** (SLNG + Gemini): voice call → structured lead JSON.
  - **P2 — Attio/Data**: object model + write/read client + seeded listings. **Attio = system of record.**
  - **P3 — Orchestration/Outreach** (n8n): trigger → channel send (WhatsApp + one SLNG call).
- Core partners (4) = **SLNG + Attio + n8n + Gemini** (≥3 to qualify, `[[partners]]`). Stretch: **Superlinked** (rerank), **Tavily** (enrich).

---

## 🔴 CUT LINE: feature freeze at **H+4:30 (~17:30)**
After this point we only **demo, polish, and ship**. No new features, no refactors. If it isn't working at H+4:30, it drops to the **fallback ladder** (below) — we do not chase it.

---

## Hour-by-hour

### 🔨 H+0:00–0:30 — Setup · ALL THREE TOGETHER (~13:00–13:30)
**GOAL:** the contract is agreed and nobody can block anyone. **THE most important 30 min** — get the interfaces right, then split.
- Together (no splitting yet):
  - Agree the **lead schema** (intent buy/sell/rent · property type · area · budget · beds · timeline) — the JSON P1 emits, P2 stores, P3 reads.
  - Agree the **Attio object model** — Lead/Contact + Requirements + a **Listings** object + outreach log (`[[data-model]]`).
  - Agree **which channels** — recommend **WhatsApp + one SLNG call** (Telegram/email ⏭️ stretch).
  - Set up accounts/keys → drop in `[[stack]]`: **Attio** free workspace, **SLNG**, **n8n**, **Gemini** (`goo.gle/hackathon-account`).
  - Seed a **small Listings set** (~15–30) so the match is visible — owner `<fill in>` ❓ open.
  - Assign the 3 slices (P1/P2/P3) and repo init.
- **done =** lead schema + Attio object model + channel list written in `[[tasks]]`; every member has repo + keys; ~15–30 listings seeded; each person owns a slice.

### H+0:30–2:00 — Build slices in parallel (~13:30–15:00)
**GOAL:** each slice works standalone against a **mock of its input**. No cross-blocking.
- Parallel:
  - **P1 (Voice/Intake):** SLNG voice agent qualifies a caller → **Gemini** structures answers → emits the **lead JSON** (to console/file for now) — owner `<fill in>` ❓ open.
  - **P2 (Attio/Data):** stand up the **object model** + a small **write/read client**; load the seeded **listings**; expose "create lead + requirements" and "list listings" — owner `<fill in>` ❓ open.
  - **P3 (Orchestration/Outreach):** **n8n** flow with a trigger → **one channel send** (WhatsApp) firing off a **mock Attio record** to our own number — owner `<fill in>` ❓ open.
- **done =** P1 prints a valid lead JSON from a spoken call; P2 creates a lead + reads listings in the real Attio workspace; P3 sends a WhatsApp to us from n8n on a mock record.

### H+2:00–3:30 — First integration (~15:00–16:30)
**GOAL:** connect the spine — P1 → P2 → P3 with real data, not mocks.
- Parallel → converge:
  - **P1 → P2:** the real **lead JSON writes a Lead + Requirements** into Attio — owner `<fill in>` ❓ open.
  - **P2 → P3:** **n8n triggers off the new Attio lead**, reads matching listings, and sends the outreach — owner `<fill in>` ❓ open.
  - **P3 (stretch, if ahead):** add a **Superlinked rerank node** inside n8n (rank listings before the send). 💡 stretch — `[[partners]]`.
- **done =** writing a lead to Attio (from P1) makes n8n fire and a WhatsApp lands with listings pulled from Attio. The spine is connected.

### H+3:30–4:30 — End-to-end happy path (~16:30–17:30)
**GOAL:** the whole loop runs from a real voice call; polish the **one** path.
- Together on the seam:
  - **P1:** buyer **calls** → qualified → lead written to Attio — owner `<fill in>` ❓ open.
  - **P2:** lead + requirements land; **matched listings** resolve (Superlinked rerank if wired, else simple filter) — owner `<fill in>` ❓ open.
  - **P3:** n8n fires → **WhatsApp + an SLNG outbound call** reach us with the matches; **outcomes logged back to Attio** — owner `<fill in>` ❓ open.
- **done =** one clean run: speak to the agent → Attio lead appears → matched listings → WhatsApp + an SLNG call land on our own numbers → outcome logged. No human touched it.

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
  - **README + repo docs:** setup steps + APIs/tools used — **SLNG · Attio · n8n · Gemini** (+ Superlinked/Tavily if used) (`[[submission]]`) — owner `<fill in>` ❓ open.
  - Fill the **submission form** (`<fill in>` form URL ❓ open) — owner `<fill in>` ❓ open.
  - **BUFFER** for the inevitable last-minute break.
- **done = SUBMITTED BY 18:30.** Public GitHub repo + 2-min video + README + form. Anything after is bonus.

---

## "If behind" fallback ladder
Drop down a rung the moment a stage misses its `done` check. A demoed fallback beats a broken feature.
- **All channels → WhatsApp + 1 call.** 🤔 Drop Telegram/email first; keep WhatsApp + one SLNG call.
- **Superlinked rerank → simple filter.** 🤔 If the rerank node is flaky, match listings with a plain price/beds/area filter.
- **Voice intake → typed form.** 🤔 If SLNG intake won't land by H+4:30, capture the same lead via a typed form → same JSON → same pipeline.
- **Outbound SLNG call → skip.** 🤔 If the outbound call is unreliable, demo WhatsApp-only outreach.
- **Live listings → seeded mock.** 🤔 Never scrape live; the seeded ~15–30 listings are the plan (`[[overview]]`).

## Reminders
- Protect the demo: every choice answers "does this get us to the 2-min demo?" If not → ⏭️ cut.
- Build against a **mock of your input** until H+2:00 so the three slices never block each other.
- Flip task tags 🔨 → 🟢 only when it actually *works*, not when code is written.
- Submit early (18:30), polish in the buffer. Don't gamble the deadline. → `[[submission]]`
