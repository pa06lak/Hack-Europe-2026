---
title: "Demo — the 2-minute script"
type: pitch
status: working
date_updated: 2026-06-27
owner: shared
---

# Demo — the 2-minute script

> ⏱️ Hard deadline 19:00. The whole wiki exists to protect *this* page. When a build choice
> doesn't make this 2-minute video better, ⏭️ cut it. See `[[overview]]`, `[[architecture]]`,
> `[[judging]]`, and the shipping checklist in `[[submission]]`.

We submit a **2-minute Loom** with a **live walkthrough** (required by the manual → `[[submission]]`).
Finalists get a separate **5-minute live pitch** → see bottom.

🎯 The one thing the judges must believe: **no human touched it.** You *talk* to the agent, become a
qualified lead, and within seconds it's matching homes and messaging/calling you back. (Track north star → `[[judging]]`.)

---

## The one happy path (✅ decided we demo exactly this)

A **buyer calls the voice agent → answers buy / area / budget / beds → an Attio lead appears →
Superlinked matches listings → n8n sends a WhatsApp with the top 3 → an SLNG callback rings.**
One workspace, one scripted scenario, **pre-seeded listings**, outreach to **our own** number.

- 🤔 assumption: we run the **buyer-calls** path only; ⏭️ seller/renter and Telegram/email are out (`[[overview]]`).
- The single flow we show:
  1. 🔨 **Voice intake (SLNG)** — call the agent; it qualifies intent=buy + area + budget + beds + timeline. Gemini structures it into a lead (`[[architecture]]`).
  2. 🔨 **Attio lead populates itself** — Lead/Contact + Requirements create on screen. Attio = system of record (`[[data-model]]`).
  3. 💡 **Superlinked match** — rerank seeded listings against the lead's criteria; top 3 surface. Stretch — have a fallback if it's not wired.
  4. 🔨 **n8n fires** — picks the top 3 and **sends a WhatsApp** to our phone, then triggers an **SLNG outbound callback** that rings.
  5. 🔨 **Outcome logged back to Attio** — the message/call shows up on the lead. Hands-off, end to end.

### Pre-seeded so it's reliable (state this exactly, lock before we record)
- 🤔 **Attio workspace**: seeded **before** recording — the Listings object filled with curated properties so the match is visible. `<fill in: the seed set, ~15–30>` ❓ open.
- 🤔 **Listings dataset**: written so one obvious top-3 falls out of the buyer's criteria. `<fill in: which listings / which area>` ❓ open.
- 🤔 **The call script** is fixed and rehearsed: the buyer answers buy / area / budget / beds the same way every take. `<fill in: the exact answers>` ❓ open.
- 🤔 **Recipient = our own number/inbox** — outreach goes to a phone we hold up on camera (`⏭️ real targeting cut`).
- 🤔 **Expected output** known in advance — which lead appears, which 3 listings, the WhatsApp text, the callback. `<fill in>` ❓ open.

---

## 2-minute beat sheet (tune to ~2:00)

| Time | Beat | Say / show |
|---|---|---|
| 0:00 | Hook | *"Call our agent, get matched homes in seconds."* |
| 0:15 | Problem | Real-estate leads are handled slow and by hand — forms, callbacks, cold leads. (→ `[[overview]]`) |
| 0:30 | Voice intake live | Place the call → the **SLNG** agent qualifies the buyer: buy / area / budget / beds. |
| 0:55 | Attio lead populates itself | Cut to Attio → the **Lead + Requirements create on screen**. Attio = system of record. |
| 1:15 | Match + outreach | **Superlinked** matches listings → **n8n** fires → **WhatsApp with the top 3 lands on a real phone.** |
| 1:35 | Tech / payoff | *"And it called me back — no human touched it. Built on SLNG + Attio + n8n + Gemini."* (→ `[[partners]]`) |
| 1:50 | Close | One line: a voice-first lead engine that qualifies, matches, and reaches out — on its own. ~2:00 |

- ❓ open: who narrates / records — `<fill in>`. See `[[team]]`.

---

## Reliability tips (🤔 — protect the demo)

- ✅ **Pre-seed the Attio workspace + listings** before the take. Never wire up data live on camera.
- ✅ **Send outreach to our own phone/inbox** — the WhatsApp + callback land on a device we control.
- 🤔 **Pre-cache any flaky calls** (Superlinked match, enrich) so a slow API can't break the take (`[[stack]]`).
- 🤔 **Pre-warm** services right before recording: SLNG session open, Attio API/MCP key live, n8n flow armed, Gemini reachable.
- 💡 **Recorded fallback clip** of the full loop working — splice it in if the live run fails mid-take.
- ✅ **Rehearse once** end-to-end before the real take. One clean run beats five edits.

---

## Loom tips

- Record **screen + mic** — and **capture the phone screen**: the **WhatsApp arriving is the money shot**.
- **Show the Attio record updating on screen** — proof the CRM populates itself. Linger on the lead create + the logged outreach.
- Make the **voice interaction obvious** — audible call, audible qualification, the callback ringing.
- 💡 **Captions / on-screen text** for the voice part (judges may watch muted).
- Keep **energy up**; no dead air. 2:00 is short — cut, don't ramble.

---

## 5-minute finalist version (extra beats only — if we advance)

Live, in front of jury + audience (`[[judging]]`). Same happy path, plus:

- 💡 **Architecture walkthrough**: SLNG voice intake → Gemini structures → write to Attio → Superlinked match → n8n multichannel outreach → log back. (→ `[[architecture]]`)
- 💡 **The north star**: qualify + match + reach out with **no human in the loop** — a closed loop, not a suggestion box.
- 💡 **Partner-tech detail**: where SLNG, Attio, n8n, and Gemini each do real work — naming all 4 (+ Superlinked/Tavily as stretch). (→ `[[partners]]`)
- 💡 **Vision / what's next**: seller + renter intake, all four channels (WhatsApp / call / Telegram / email), Superlinked + Tavily enrichment on by default, nurture loop over time.
- 🤔 Still **lead with the live demo**, not slides. The voice → matched homes → it-calls-you-back loop is the win.
