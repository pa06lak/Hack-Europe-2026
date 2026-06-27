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

🎯 The one thing the judges must believe: **no agent touched it.** You *talk* to the voice agent, become a
qualified lead, and within seconds you're **swiping your matched homes on WhatsApp** — and every swipe lands back in the CRM. (Track north star → `[[judging]]`.)

---

## The one happy path (✅ decided we demo exactly this)

A **buyer calls the voice agent → answers buy / area / budget / beds → an Attio lead appears →
top 3–5 listings match → n8n WhatsApps a link → tap it, swipe the homes Tinder-style → the swipes write back to Attio.**
One workspace, one scripted scenario, **pre-seeded listings**, WhatsApp to **our own** number.

- 🤔 assumption: we run the **buyer-calls** path only; ⏭️ sell intake, Telegram/email, and the outbound call are out (`[[overview]]`).
- The single flow we show:
  1. 🔨 **Voice intake (SLNG)** — call the agent; it branches to **buy** and qualifies area + budget + beds + timeline. Gemini structures it into a lead (`[[architecture]]`).
  2. 🔨 **Attio lead populates itself** — Lead/Contact + Requirements create on screen. Attio = system of record (`[[data-model]]`).
  3. 🔨 **Match** — **Attio's own filter** surfaces the **top 3–5** listings on area + beds + price. No separate matcher.
  4. 🔨 **n8n fires → WhatsApp link** — n8n sends **one WhatsApp** with a link to the **swipe app** on our phone.
  5. 🔨 **Swipe live → Attio updates** — open the link, swipe **interested/pass** through the matched homes; the **interested ones show up on the Attio lead** on screen. Hands-off, end to end.
- 💡 optional beat (if solid): reply **"stop"** in WhatsApp → the lead flips to opt-out/inactive in Attio.

### Pre-seeded so it's reliable (state this exactly, lock before we record)
- 🤔 **Attio workspace**: seeded **before** recording — the Listings object filled with curated properties so the match is visible. `<fill in: the seed set, ~15–30>` ❓ open.
- 🤔 **Listings dataset**: written so one obvious top-3 falls out of the buyer's criteria. `<fill in: which listings / which area>` ❓ open.
- 🤔 **The call script** is fixed and rehearsed: the buyer answers buy / area / budget / beds the same way every take. `<fill in: the exact answers>` ❓ open.
- 🤔 **Recipient = our own number** — the WhatsApp link opens on a phone we hold up on camera (`⏭️ real targeting cut`).
- 🤔 **Swipe app pre-loaded + reachable** — the per-lead URL resolves, the cards render with photos, and a swipe visibly writes to Attio. Rehearse the round-trip. `<fill in: host/URL>` ❓ open.
- 🤔 **Expected output** known in advance — which lead appears, which 3–5 listings become the swipe cards, which we swipe "interested", what lands on the Attio lead. `<fill in>` ❓ open.

---

## 2-minute beat sheet (tune to ~2:00)

| Time | Beat | Say / show |
|---|---|---|
| 0:00 | Hook | *"Call our agent, then swipe your matched homes on WhatsApp — like Tinder for houses."* |
| 0:15 | Problem | Real-estate leads are handled slow and by hand — forms, callbacks, cold leads. (→ `[[overview]]`) |
| 0:30 | Voice intake live | Place the call → the **SLNG** agent qualifies the buyer: buy / area / budget / beds. |
| 0:50 | Attio lead populates itself | Cut to Attio → the **Lead + Requirements create on screen**. Attio = system of record. |
| 1:05 | Match + WhatsApp link | **Match** picks the top 3–5 → **n8n** fires → a **WhatsApp link lands on a real phone.** |
| 1:20 | **Swipe (money shot)** | Tap the link → **swipe the homes Tinder-style** on camera; cut to Attio showing the **interested ones appear on the lead.** |
| 1:40 | Tech / payoff | *"I just swiped — and the CRM already knows. No agent touched it. Built on SLNG + Attio + n8n + Gemini."* (→ `[[partners]]`) |
| 1:50 | Close | One line: a voice-first lead engine that qualifies, matches, and lets you **swipe** — on its own. ~2:00 |

- ❓ open: who narrates / records — `<fill in>`. See `[[team]]`.

---

## Reliability tips (🤔 — protect the demo)

- ✅ **Pre-seed the Attio workspace + listings** before the take. Never wire up data live on camera.
- ✅ **Send outreach to our own phone/inbox** — the WhatsApp + callback land on a device we control.
- 🤔 **Pre-cache/pre-load the matches + swipe cards** so a slow Attio query or the GitHub Pages load can't break the take (`[[stack]]`).
- 🤔 **Pre-warm** services right before recording: SLNG session open, Attio API/MCP key live, n8n flow armed, Gemini reachable.
- 💡 **Recorded fallback clip** of the full loop working — splice it in if the live run fails mid-take.
- ✅ **Rehearse once** end-to-end before the real take. One clean run beats five edits.

---

## Loom tips

- Record **screen + mic** — and **capture the phone screen**: the **swipe interaction is the money shot** (WhatsApp link → cards → yes/no).
- **Show the Attio record updating on screen** — proof the CRM populates itself. Linger on the lead create + the **interested listings appearing as you swipe**.
- Make the **voice interaction obvious** — audible call, audible qualification — then cut straight to the phone for the swipe.
- 💡 **Captions / on-screen text** for the voice part (judges may watch muted).
- Keep **energy up**; no dead air. 2:00 is short — cut, don't ramble.

---

## 5-minute finalist version (extra beats only — if we advance)

Live, in front of jury + audience (`[[judging]]`). Same happy path, plus:

- 💡 **Architecture walkthrough**: SLNG voice intake (buy/rent branch) → Gemini structures → write to Attio → match top 3–5 → n8n WhatsApps a swipe link → swipes write back to Attio. (→ `[[architecture]]`)
- 💡 **The north star**: qualify + match + **swipe-to-shortlist** with **no agent in the loop** — a closed loop, not a suggestion box.
- 💡 **Partner-tech detail**: where SLNG, Attio, n8n, and Gemini each do real work — naming all 4. (→ `[[partners]]`)
- 💡 **Vision / what's next**: sell/landlord intake, multichannel re-added (call / Telegram / email), semantic ranking (e.g. Superlinked) + Tavily enrichment, swipes refine future matches, nurture loop over time.
- 🤔 Still **lead with the live demo**, not slides. The voice → matched homes → **swipe-them-on-WhatsApp** loop is the win.
