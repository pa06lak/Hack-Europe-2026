---
title: "Stack — services, accounts, env"
type: build
status: working
date_updated: 2026-06-27
owner: shared
---

# Stack — services, accounts, env

🔨 Practical setup for **idea v3** (voice-first real-estate lead engine on Attio): services, accounts,
channels, repos, env. The pipeline is in `[[architecture]]`; partner-tech choices (need ≥3) in
`[[partners]]`; the 3-way owner split in `[[team]]`; task board in `[[tasks]]`; shipping in `[[submission]]`.

> ⏱️ 6-hour sprint, hard deadline 19:00, 3 people. Get accounts + keys sorted in the **first 30 min** so
> nobody's blocked later. Protect the demo: each service must have a fallback or be skippable.
> 🎯 **Attio is the system of record** — the one service we can't fake. Lock it first.
> 🔌 **The fiddly bit is the n8n channel creds** (WhatsApp etc.) — start them early, they take longest.

Owner shorthand maps to the `[[team]]` slices: **P1** = Voice/Intake · **P2** = Attio/Data · **P3** =
Orchestration/Outreach. Real names: `<fill in>` ❓ open.

## Services & accounts checklist

Legend: ⬜ not started · 🔨 in progress · ✅ ready.

| Service | What it's for | Sign-up / source | Status | Owner |
|---|---|---|---|---|
| **SLNG** | Voice **intake** (qualify the lead) + **outbound calls** | http://slng.ai/ | ⬜ | P1 `<fill in>` ❓ |
| **Attio** (free workspace) | System of record — Lead/Contact + Requirements + Listings + outreach log | Free workspace on the day; **API key OR MCP** (recommend MCP/REST for speed) | ⬜ | P2 `<fill in>` ❓ |
| **n8n** | Orchestrator — multichannel outreach + (stretch) Superlinked node | https://n8n.io/ — **cloud OR self-host** | ⬜ | P3 `<fill in>` ❓ |
| **Gemini** (temp account) | Structures voice answers → a lead | https://goo.gle/hackathon-account | ⬜ | P1 `<fill in>` ❓ |
| Superlinked (optional) | Rerank listings vs the lead's criteria 💡 stretch | https://superlinked.com/ | ⬜ | P2 `<fill in>` ❓ |
| Tavily (optional) | Area/market enrichment 💡 stretch | https://www.tavily.com/ | ⬜ | P3 `<fill in>` ❓ |

- 🔨 **SLNG:** account + key; we use it twice — inbound intake **and** the outbound demo call.
- 🔨 **Attio:** spin up the free workspace, then pick the entry point — **REST API or Attio MCP** (recommended) over Workflows / App SDK. → `[[partners]]`, `[[decisions]]`
- 🔨 **n8n:** cloud trial is fastest; self-host (Docker) only if we hit a wall. This is where the outreach lives.
- 🔨 **Gemini:** temp account on the day, grab the key.
- 💡 **Superlinked / Tavily:** only after the core loop is 🟢 — both are stretch and must never block the demo. → `[[partners]]`

## Channel credentials for n8n (the fiddly bit)

These are what makes outreach actually fire — and the slowest to provision. **Do WhatsApp + the SLNG call
first**; Telegram/email are stretch. All outreach goes to **our own** numbers/inboxes for the demo.

| Channel | Credential needed | Priority | Status | Owner |
|---|---|---|---|---|
| **WhatsApp** | Twilio (`TWILIO_*`) **or** WhatsApp Cloud API (`WHATSAPP_*`) | 🔨 demo path | ⬜ | P3 `<fill in>` ❓ |
| **SLNG call** | `SLNG_API_KEY` (outbound) | 🔨 demo path | ⬜ | P1 `<fill in>` ❓ |
| Telegram | Bot token (`TELEGRAM_BOT_TOKEN`) | ⏭️ stretch | ⬜ | P3 `<fill in>` ❓ |
| Email | SMTP creds (`SMTP_*`) | ⏭️ stretch | ⬜ | P3 `<fill in>` ❓ |

- 🤔 assumption: WhatsApp via **Twilio** is the quickest to stand up; if onboarding stalls, fall back to the WhatsApp Cloud API (or drop WhatsApp and lead the demo with the SLNG call). → `[[demo]]`

## Repos

- 🔨 **Code repo:** `<fill in>` ❓ open — must be a **PUBLIC GitHub repo** for submission. → `[[submission]]`
- This **wiki repo:** `C:\Users\iason\Dev\techeurope` (the team brain — not the code).

## Env vars (.env)

> 🤔 assumption: `.gitignore` already excludes `.env`. **Placeholders ONLY here — never commit real keys.**
> Share real keys out-of-band (see "Who has which key" below), not in this file or the repo.

```dotenv
# core (idea v3)
SLNG_API_KEY=<fill in>          # voice intake + outbound calls
ATTIO_API_KEY=<fill in>         # or use Attio MCP config instead of a raw key
GEMINI_API_KEY=<fill in>
N8N_API_KEY=<fill in>
N8N_BASE_URL=<fill in>
N8N_WEBHOOK_URL=<fill in>       # Attio → n8n trigger

# channel creds (WhatsApp + SLNG call first; Telegram/email stretch)
TWILIO_ACCOUNT_SID=<fill in>    # WhatsApp via Twilio…
TWILIO_AUTH_TOKEN=<fill in>
# …OR WhatsApp Cloud API instead of Twilio:
WHATSAPP_TOKEN=<fill in>
WHATSAPP_PHONE_NUMBER_ID=<fill in>
TELEGRAM_BOT_TOKEN=<fill in>    # ⏭️ stretch
SMTP_HOST=<fill in>            # ⏭️ stretch
SMTP_USER=<fill in>
SMTP_PASS=<fill in>

# optional partners (stretch — only if adopted)
SUPERLINKED_API_KEY=<fill in>
SUPERLINKED_URL=<fill in>
TAVILY_API_KEY=<fill in>
```

- ❓ open: are we hitting Attio via **REST API key** or **MCP config**? That decides whether `ATTIO_API_KEY` or an MCP block is the real credential. → `[[decisions]]`
- ❓ open: WhatsApp via **Twilio** (`TWILIO_*`) vs **WhatsApp Cloud API** (`WHATSAPP_*`) — pick one, delete the other.
- 🔨 Commit a `.env.example` with these keys blank so teammates know what to fill.
- ❓ open: confirm `.gitignore` actually lists `.env` before anyone pastes a real key.

## Local setup notes (how to run — sketch 🤔)

```bash
# 1. Attio: workspace + objects (Lead/Contact, Requirements, Listings, outreach log) -> [[data-model]]
#    seed ~15-30 listings so the match is visible; set ATTIO_API_KEY (or MCP)

# 2. install deps + env
cp .env.example .env          # then fill in keys
# (per-component setup — voice / n8n / matcher — owners pin their own)

# 3. run the voice intake (SLNG) -> Gemini structures -> writes a Lead to Attio   (-> [[architecture]])
#    <fill in actual entrypoint> ❓ open

# 4. import the n8n flow (Attio trigger -> [Superlinked rerank node, stretch] -> WhatsApp + SLNG call -> log to Attio)
#    <fill in n8n import / webhook> ❓ open

# 5. fire end-to-end: call in as a buyer -> get qualified -> matched listings -> WhatsApp + a call back
```

- 🔨 Smoke-test Attio read/write first — if we can't write the workspace, nothing downstream demos. 🤔
- 🔨 Smoke-test the n8n webhook + one channel early — provisioning is the long pole.

## Who has which key

| Key / account | Held by | Shared with team? |
|---|---|---|
| SLNG_API_KEY | P1 `<fill in>` ❓ | `<fill in>` |
| ATTIO_API_KEY / MCP | P2 `<fill in>` ❓ | `<fill in>` |
| GEMINI_API_KEY | P1 `<fill in>` ❓ | `<fill in>` |
| N8N_* / webhook | P3 `<fill in>` ❓ | `<fill in>` |
| WhatsApp (TWILIO_* or WHATSAPP_*) | P3 `<fill in>` ❓ | `<fill in>` |
| TELEGRAM_BOT_TOKEN (stretch) | P3 `<fill in>` ❓ | `<fill in>` |
| SMTP_* (stretch) | P3 `<fill in>` ❓ | `<fill in>` |
| SUPERLINKED_* (stretch) | P2 `<fill in>` ❓ | `<fill in>` |
| TAVILY_API_KEY (stretch) | P3 `<fill in>` ❓ | `<fill in>` |
