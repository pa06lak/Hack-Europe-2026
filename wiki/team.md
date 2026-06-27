---
title: "Team & Roles"
type: team
status: working
date_updated: 2026-06-27
owner: shared
---

# Team & Roles

> ✅ **Team = 3** (decided 2026-06-27). Rule allows max **5**; we run lean, 3 vertical slices, one owner each. → `[[overview]]`
> 🔁 Re-pointed to **idea v3**: a voice-first real-estate lead engine on Attio. Old comms-CRM / event-concierge splits are dead — history only.
> ⏱️ The clock is the constraint, not headcount: 6h, hard deadline **19:00**. → `[[timeline]]`

## The three slices

One person owns each section of the pipeline (intake → spine → outreach). Everyone holds the key for their own slice.

| Person | Builds | Partner tech | Interface (in → out) | Demo moment | Key/account held |
|---|---|---|---|---|---|
| **P1 — Voice & Intake** — **Iason** | 🔨 SLNG voice agent that qualifies a lead (buy/sell/rent → type/area/budget/beds/timeline); Gemini structures speech → lead JSON | **SLNG** (+ Gemini) → SLNG side challenge | in: a phone/voice call · out: emits the **`lead`** JSON | "I talk to it and become a qualified lead." | SLNG account/key ❓ open · Gemini account ❓ open |
| **P2 — Attio & Data (the spine)** — **Alex** | 🔨 Attio workspace + object model (Leads/Requirements/Listings) + write/read client; seeds the ~15–30 listings; **owns the schema contract** everyone depends on | **Attio** → the track | in: consumes **`lead`** (write) · out: exposes queries (read) | "the CRM fills itself." | Attio workspace + API key ❓ open |
| **P3 — Orchestration & Outreach** — **Palak** | 🔨 n8n flows triggered off Attio → multichannel outreach (SLNG call / WhatsApp / Telegram / email) + Superlinked rerank node (💡 stretch) + log outcomes back | **n8n** + SLNG (+ Superlinked) → n8n & Superlinked side challenges | in: reads Attio · out: acts (calls/messages), writes outcomes back | "no human — it WhatsApps + calls me my top matches." | n8n account ❓ open · Superlinked key ❓ open |

> 🤔 assumption: each person also owns their slice's part of `[[stack]]` (keys, accounts). The **Attio seam (Alex's schema)** is load-bearing — pair on it whenever it's touched.
> 🎙️ **Iason**'s intake questions (= the lead schema) live in `[[voice-intake]]` — agree them with Alex first.
> 🔎 **Superlinked (pending)** sits with **Alex** — he builds the listings index/ranking; **Palak** calls it as a node in the n8n flow. Still 💡 stretch — confirm once Attio is green.

## The critical move — first 30 min (all 3)

- ✅ Before anyone builds, the three of us agree the **lead schema + Attio object model + channel list**. → `[[overview]]`, `[[tasks]]`
- 🔨 Then each person builds against a **mock** of their input so nobody blocks:
  - P3 mocks a `lead` + listings in Attio while P1/P2 are still wiring.
  - P1 emits a hardcoded `lead` JSON until Gemini parsing lands.
  - P2 stubs read queries so P3 can build n8n flows early.
- The schema is the contract — change it in the room, tell the other two.

## Last 1.5h — integrate + ship

- 🔨 Stop building new; wire the slices end-to-end on the **one happy path** (buyer calls → qualified → matched listings → WhatsApp + an SLNG call). → `[[demo]]`
- 💡 Nominate a **demo owner** (suggest **P2**, who holds the spine) to: record the 2-min video, write the README, and **submit by 18:30** (buffer before 19:00). → `[[submission]]`
- ⏭️ Telegram/email, Superlinked rerank, Tavily enrich — only if integration is green with time to spare.

## Open questions (❓)

- ✅ **Names** — **Iason** (P1, voice intake) · **Alex** (P2, Attio + Superlinked pending) · **Palak** (P3, n8n orchestration + downstream).
- ❓ **Kickoff time** — `<fill in>`; needed to pin H-offsets in `[[timeline]]`.
- ❓ **Who holds which key** — SLNG / Gemini / Attio / n8n / Superlinked accounts; assign at kickoff, reflect in `[[stack]]`.

Next: lock names + keys, agree the schema, then go straight to `[[tasks]]` and `[[timeline]]`.
