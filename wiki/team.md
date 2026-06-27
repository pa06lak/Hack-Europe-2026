---
title: "Team & Roles"
type: team
status: working
date_updated: 2026-06-27
owner: shared
---

# Team & Roles

> ✅ **Team = 3** (decided 2026-06-27). Rule allows max **5**; we run lean, 3 vertical slices, one owner each. → `[[overview]]`
> 🔁 Re-pointed to **idea v4**: voice intake → Attio → n8n **WhatsApps a swipe-app link** → swipes write back to Attio. Old comms-CRM / event-concierge splits are dead — history only. → `[[decisions]]`
> ✅ **Swipe app owner = Palak** (who also owns P3/n8n) — host on **GitHub Pages**. Keeps the WhatsApp→swipe→write-back seam in one head. ⚠️ Palak now carries two builds; if behind, the n8n flow is thin (one WhatsApp send) so the swipe app gets the hours.
> ⏱️ The clock is the constraint, not headcount: 6h, hard deadline **19:00**. → `[[timeline]]`

## The three slices

One person owns each section of the pipeline (intake → spine → outreach). Everyone holds the key for their own slice.

| Person | Builds | Partner tech | Interface (in → out) | Demo moment | Key/account held |
|---|---|---|---|---|---|
| **P1 — Voice & Intake** — **Iason** | 🔨 SLNG voice agent that branches **buy vs rent/let** and qualifies (type/area/budget/beds/timeline); Gemini structures speech → lead JSON | **SLNG** (+ Gemini) → SLNG side challenge | in: a phone/voice call · out: emits the **`lead`** JSON | "I talk to it and become a qualified lead." | SLNG account/key ❓ open · Gemini account ❓ open |
| **P2 — Attio & Data (the spine)** — **Alex** | 🔨 Attio workspace + object model (Leads/Requirements/Listings/**Interest**) + write/read client; seeds the ~15–30 listings (with photos); **owns the schema + write-back contract** everyone depends on | **Attio** → the track | in: consumes **`lead`** (write) · out: exposes queries (read) + accepts swipe/opt-out write-back | "the CRM fills itself — and updates as I swipe." | Attio workspace + API key ❓ open |
| **P3 — Orchestration & Outreach** — **Palak** | 🔨 n8n flow triggered off Attio → builds the per-lead swipe URL → **WhatsApps the link** (Twilio) + opt-out bot; Superlinked rerank node (💡 stretch); routes swipe/opt-out write-back to Attio | **n8n** + (Superlinked) → n8n & Superlinked side challenges | in: reads Attio · out: WhatsApp send + write-back | "no agent — it WhatsApps me a swipe app of my top matches." | n8n account ❓ open · Twilio ❓ open · Superlinked key ❓ open |
| **🆕 Swipe app** — **Palak** (also P3) | 🟢 **UI built** (`index.html`, repo root): Tinder deck + saved panel + notes + opt-out. 🔨 **left:** swap mock `HOUSES` → real matches, **PATCH the Attio person** on swipe, enable Pages | *(our own front-end — not a partner tech)* | in: a per-lead match list · out: PATCH the Attio person | "I swipe my matches and my profile updates." | repo `index.html` + Attio token (client-side ⚠️) |

> 🤔 assumption: each person also owns their slice's part of `[[stack]]` (keys, accounts). The **Attio seam (Alex's schema)** is load-bearing — pair on it whenever it's touched.
> 🎙️ **Iason**'s intake questions (= the lead schema) live in `[[voice-intake]]` — agree them with Alex first.
> 🔎 **Matching = Attio's native filter** (Alex's spine), not a separate service — n8n runs the filter and bakes the top 3–5 into the swipe link. ⏭️ Superlinked dropped.

## The critical move — first 30 min (all 3)

- ✅ Before anyone builds, the three of us agree the **lead schema + Attio object model + the swipe→Attio write-back contract** (which person-record attributes a swipe sets). → `[[overview]]`, `[[tasks]]`
- 🔨 Then each person builds against a **mock** of their input so nobody blocks:
  - P3 mocks a `lead` + listings in Attio while P1/P2 are still wiring.
  - P1 emits a hardcoded `lead` JSON until Gemini parsing lands.
  - P2 stubs read queries so P3 can build n8n flows early.
- The schema is the contract — change it in the room, tell the other two.

## Last 1.5h — integrate + ship

- 🔨 Stop building new; wire the slices end-to-end on the **one happy path** (buyer calls → qualified → matched → WhatsApp swipe link → swipe → write back). → `[[demo]]`
- 💡 Nominate a **demo owner** (suggest **P2**, who holds the spine) to: record the 2-min video, write the README, and **submit by 18:30** (buffer before 19:00). → `[[submission]]`
- ⏭️ Opt-out bot, Tavily enrich — only if the swipe loop is green with time to spare. (⏭️ Superlinked dropped — Attio matches.)

## Open questions (❓)

- ✅ **Names** — **Iason** (P1, voice intake) · **Alex** (P2, Attio/Data + matching) · **Palak** (P3, n8n orchestration + the swipe app).
- ✅ **Swipe app owner = Palak** (extends from P3/n8n into the front-end); host = **GitHub Pages**; writes **directly to the Attio person record**. → `[[decisions]]`
- ❓ **Kickoff time** — `<fill in>`; needed to pin H-offsets in `[[timeline]]`.
- ❓ **Who holds which key** — SLNG / Gemini / Attio / n8n / Twilio accounts + the GitHub Pages repo; assign at kickoff, reflect in `[[stack]]`.

Next: lock names + keys, agree the schema, then go straight to `[[tasks]]` and `[[timeline]]`.
