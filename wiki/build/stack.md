---
title: "Stack — services, accounts, env"
type: build
status: working
date_updated: 2026-06-27
owner: shared
---

# Stack — services, accounts, env

🔨 Practical setup for **idea v4** (voice-first real-estate lead engine on Attio, with a **WhatsApp → swipe-app**
payoff): services, accounts, channels, repos, env. The pipeline is in `[[architecture]]`; partner-tech choices
(need ≥3) in `[[partners]]`; the owner split in `[[team]]`; task board in `[[tasks]]`; shipping in `[[submission]]`.

> ⏱️ 6-hour sprint, hard deadline 19:00, 3 people. Get accounts + keys sorted in the **first 30 min** so
> nobody's blocked later. Protect the demo: each service must have a fallback or be skippable.
> 🎯 **Attio is the system of record** — the one service we can't fake. Lock it first.
> 🔌 **The fiddly bits are the WhatsApp creds (Twilio) + a public host for the swipe app** — start both early, they take longest.

Owner shorthand maps to the `[[team]]` slices: **P1** = Voice/Intake · **P2** = Attio/Data · **P3** =
Orchestration/Outreach. Real names: `<fill in>` ❓ open.

## Services & accounts checklist

Legend: ⬜ not started · 🔨 in progress · ✅ ready.

| Service | What it's for | Sign-up / source | Status | Owner |
|---|---|---|---|---|
| **SLNG** | Voice **intake** (qualify the lead) — ⏭️ v4 cut the outbound call | http://slng.ai/ | ⬜ | P1 `<fill in>` ❓ |
| **Attio** (free workspace) | System of record — Lead/Contact + Requirements + Listings + **Interest** + outreach log | Free workspace on the day; **API key OR MCP** (recommend MCP/REST for speed) | ⬜ | P2 `<fill in>` ❓ |
| **n8n** | Orchestrator — Attio trigger → run Attio match filter → build swipe-link → WhatsApp send | https://n8n.io/ — **cloud OR self-host** | ⬜ | Palak ❓ |
| **🆕 Swipe app** | Static "Tinder for houses" page — 🟢 **built at `index.html`** (repo root, commit `98a7efe`); UI only so far | This repo + **enable GitHub Pages** | 🔨 | **Palak** |
| **Gemini** (temp account) | Structures voice answers → a lead | https://goo.gle/hackathon-account | ⬜ | P1 `<fill in>` ❓ |
| ~~Superlinked~~ | ⏭️ **dropped** — Attio's native filter does the matching | — | ⏭️ | — |
| Tavily (optional) | Area/market enrichment 💡 stretch | https://www.tavily.com/ | ⬜ | P3 `<fill in>` ❓ |

- 🔨 **SLNG:** account + key; inbound **intake only** now (⏭️ v4 cut the outbound call).
- 🔨 **Attio:** spin up the free workspace, then pick the entry point — **REST API or Attio MCP** (recommended) over Workflows / App SDK. **Match = Attio's native filter** (no Superlinked). → `[[partners]]`, `[[decisions]]`
- 🔨 **n8n:** cloud trial is fastest; self-host (Docker) only if we hit a wall. Runs the Attio match filter + the WhatsApp send.
- 🟢/🔨 **Swipe app (`index.html`, repo root):** UI is **built** (Tinder deck, saved panel, notes, opt-out) but runs on a **mock `HOUSES` array** — no Attio data, no write-back. **Left:** enable **GitHub Pages** on this repo (serves root `index.html`), swap mock→real matches, **PATCH Attio** on swipe. ⚠️ **verify Attio CORS from the Pages origin** before relying on the direct write (else fall back to an n8n webhook).
- 🔨 **Gemini:** temp account on the day, grab the key.
- 💡 **Tavily:** only after the core loop is 🟢 — stretch, must never block the demo. ⏭️ Superlinked dropped. → `[[partners]]`

## Channel credentials (the fiddly bit)

The slowest to provision. **v4 = WhatsApp only** (it carries the swipe link + the opt-out). All outreach goes to **our own** number for the demo.

| Channel | Credential needed | Priority | Status | Owner |
|---|---|---|---|---|
| **WhatsApp** | Twilio (`TWILIO_*`) **or** WhatsApp Cloud API (`WHATSAPP_*`) | 🔨 demo path | ⬜ | P3 `<fill in>` ❓ |
| ⏭️ SLNG outbound call | — | ⏭️ cut (v4) | — | — |
| ⏭️ Telegram / Email | — | ⏭️ cut (v4) | — | — |

- 🤔 assumption: WhatsApp via **Twilio sandbox** is the quickest to stand up (re-`join` right before the demo); if onboarding stalls, fall back to the WhatsApp Cloud API — **or** just open the swipe URL directly on the phone on camera. → `[[demo]]`

## Repos

- 🔨 **Code repo:** `<fill in>` ❓ open — must be a **PUBLIC GitHub repo** for submission. → `[[submission]]`
- This **wiki repo:** `C:\Users\iason\Dev\techeurope` (the team brain — not the code).

## Env vars (.env)

> 🤔 assumption: `.gitignore` already excludes `.env`. **Placeholders ONLY here — never commit real keys.**
> Share real keys out-of-band (see "Who has which key" below), not in this file or the repo.

```dotenv
# core (idea v4)
VOICEAI_API_KEY=<fill in>       # SLNG voice agents (Bearer); agents base https://api.agents.slng.ai
SLNG_REGION=eu-central          # us-east | eu-central | ap-south
SLNG_WEBHOOK_URL=<fill in>      # public URL -> voice service POST /slng/call-end (e.g. ngrok)
SLNG_AGENT_ID=<fill in>         # after `cd voice && npm run create-agent`
ATTIO_API_KEY=<fill in>         # or use Attio MCP config instead of a raw key
GEMINI_API_KEY=<fill in>
N8N_API_KEY=<fill in>
N8N_BASE_URL=<fill in>
N8N_WEBHOOK_URL=<fill in>       # Attio → n8n trigger

# 🆕 swipe app (v4) — index.html at repo root, served by GitHub Pages on THIS repo
SWIPE_APP_BASE_URL=<fill in>   # e.g. https://<user>.github.io/Hack-Europe-2026/  (n8n appends ?lead=<token>)
# write-back: the app PATCHes Attio directly using a client-side Attio token (⚠️ exposed — throwaway demo key).
# If CORS blocks the browser → Attio call, set an n8n webhook here instead:
SWIPE_WRITEBACK_URL=<fill in>  # OPTIONAL fallback only (n8n webhook) — empty if writing direct to Attio

# channel creds — WhatsApp only (carries the swipe link + opt-out)
TWILIO_ACCOUNT_SID=<fill in>    # WhatsApp via Twilio sandbox…
TWILIO_AUTH_TOKEN=<fill in>
# …OR WhatsApp Cloud API instead of Twilio:
WHATSAPP_TOKEN=<fill in>
WHATSAPP_PHONE_NUMBER_ID=<fill in>
# ⏭️ cut in v4: TELEGRAM_BOT_TOKEN, SMTP_* (Telegram/email), SLNG outbound call

# optional partners (stretch — only if adopted)
# ⏭️ Superlinked dropped (Attio's filter does the matching)
TAVILY_API_KEY=<fill in>
```

- ❓ open: are we hitting Attio via **REST API key** or **MCP config**? That decides whether `ATTIO_API_KEY` or an MCP block is the real credential. → `[[decisions]]`
- ❓ open: WhatsApp via **Twilio** (`TWILIO_*`) vs **WhatsApp Cloud API** (`WHATSAPP_*`) — pick one, delete the other.
- 🔨 Commit a `.env.example` with these keys blank so teammates know what to fill.
- ❓ open: confirm `.gitignore` actually lists `.env` before anyone pastes a real key.

## Local setup notes (how to run — sketch 🤔)

```bash
# 1. Attio: workspace + objects (Lead/Contact, Requirements, Listings+photo, Interest, outreach log) -> [[data-model]]
#    seed ~15-30 listings (with photos) so the match + swipe cards are visible; set ATTIO_API_KEY (or MCP)

# 2. install deps + env
cp .env.example .env          # then fill in keys
# (per-component setup — voice / n8n / swipe app — owners pin their own)

# 3. run the voice intake (SLNG) -> Gemini structures -> writes a Lead to Attio   (-> [[architecture]])
#    <fill in actual entrypoint> ❓ open

# 4. import the n8n flow (Attio trigger -> [Superlinked rerank node, stretch] -> build swipe URL -> WhatsApp send -> log to Attio)
#    <fill in n8n import / webhook> ❓ open

# 5. serve the swipe app at SWIPE_APP_BASE_URL; it reads the lead's matches + posts verdicts to SWIPE_WRITEBACK_URL
#    <fill in swipe-app entrypoint / host> ❓ open

# 6. fire end-to-end: call in as a buyer -> qualified -> matched listings -> WhatsApp swipe link -> swipe -> write back
```

- 🔨 Smoke-test Attio read/write first — if we can't write the workspace, nothing downstream demos. 🤔
- 🔨 Smoke-test the n8n webhook + one channel early — provisioning is the long pole.

## Who has which key

| Key / account | Held by | Shared with team? |
|---|---|---|
| SLNG_API_KEY (intake only) | P1 `<fill in>` ❓ | `<fill in>` |
| ATTIO_API_KEY / MCP | P2 `<fill in>` ❓ | `<fill in>` |
| GEMINI_API_KEY | P1 `<fill in>` ❓ | `<fill in>` |
| N8N_* / webhook | P3 `<fill in>` ❓ | `<fill in>` |
| WhatsApp (TWILIO_* or WHATSAPP_*) | P3 `<fill in>` ❓ | `<fill in>` |
| 🆕 GitHub Pages repo + client-side Attio token | **Palak** | repo public; token is the demo Attio key ⚠️ |
| TAVILY_API_KEY (stretch) | P3 `<fill in>` ❓ | `<fill in>` |
| ⏭️ Superlinked / Telegram / SMTP / SLNG outbound | — cut in v4 | — |
