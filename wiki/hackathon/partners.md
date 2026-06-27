---
title: "Partner Technologies — catalog & our usage"
type: hackathon
status: working
date_updated: 2026-06-27
owner: shared
---

# Partner Technologies — catalog & our usage

We must use **≥3 partner technologies to qualify** (see `[[hackathon-manual]]`). This is the catalog
re-pointed at idea v4 — the **voice-first real-estate lead engine on Attio** (`[[overview]]`) — plus how
*we* use each. Partner tech also earns **bonus judging points** (`[[judging]]`); a few unlock **side
challenges** (`[[tracks-and-prizes]]`).

> 🔨 Account/key setup is its own task — Attio workspace, temp Gemini accounts, SLNG key, n8n instance. Track it in `[[stack]]`.

## We use 4 core (≥3 to qualify)

| Partner | What it is + link | How WE use it | Tier | Track / Side challenge? |
|---|---|---|---|---|
| **SLNG** ([slng.ai](http://slng.ai/)) | Voice AI infrastructure. | **Voice intake** — a voice agent qualifies the lead in conversation, branching **buy vs rent/let** (property type, area, budget, beds, timeline). (⏭️ v4 cut the outbound call.) | ✅ **CORE** | ✅ SLNG **side challenge** |
| **Attio** ([attio.com](https://attio.com/)) | Agentic CRM. Entry points: Workflows, MCP, REST API, App SDK. Free workspaces on the day. | **System of record** — store Leads/Requirements/Listings + the outreach log; the orchestrator reads/acts on it. | ✅ **CORE** | 🎯 **Attio track** — iPad/member |
| **n8n** ([n8n.io](https://n8n.io/)) | AI workflow automation. | **The orchestrator** — trigger on a new Attio lead, run the Attio match filter, build the per-lead swipe URL, **WhatsApp the link** (+ opt-out bot). (Swipe write-back goes app→Attio directly, not via n8n.) | ✅ **CORE** | ✅ n8n **side challenge** |
| **Google DeepMind / Gemini** ([deepmind.google](https://deepmind.google/); temp accounts [goo.gle/hackathon-account](https://goo.gle/hackathon-account)) | Frontier AI models. | Drive/parse the voice intake into a **structured lead** + **draft outreach copy**. | ✅ **CORE** | — |
| ~~**Superlinked**~~ ([superlinked.com](https://superlinked.com/)) | Multi-attribute semantic / vector ranking. | ⏭️ **Dropped** — **Attio's native filter** does the matching (area+beds+price). Only revisit as a pure side-challenge bonus if wildly ahead. | ⏭️ CUT | (side challenge forgone) |
| **Tavily** ([tavily.com](https://www.tavily.com/)) | Real-time search / extraction. | Enrich area / market / property info. | 💡 STRETCH | — |
| **Mubit** ([mubit.ai](https://mubit.ai/)) | Continual learning / persistent memory. | Remember a lead's preferences across touches. | 💡 STRETCH | — |

## Our committed core

- ✅ **SLNG + Attio + n8n + Gemini** — the qualifying set, and **all four are load-bearing** in the
  pipeline (`[[architecture]]`): SLNG = intake, Attio = store/act **+ matching (native filter)**, n8n = orchestrate, Gemini =
  structure/draft. Consistent with `[[overview]]` and `[[decisions]]`.
- ✅ We comfortably clear **≥3 partner techs**, and line up the **SLNG / n8n side challenges**
  — extra prize shots for work we'd do anyway.
- 🤔 Attio gives **free workspaces on the day** — bring/mock our own listings data.
- 🔨 Get keys/accounts wired before build starts — Attio workspace, Gemini temp accounts, SLNG key, n8n, Twilio + a GitHub Pages repo. See setup checklist in `[[stack]]`.
- 💡 Each stretch partner (**Tavily, Mubit**) is a bolt-on, not on the critical path; pick up only after the core loop is 🟢. ⏭️ Superlinked dropped — Attio's filter does the matching. → `[[timeline]]`.

## Notes / open

- ❓ Which (if any) stretch partner do we actually commit to? Decide once the core loop is working → `[[decisions]]`. (Superlinked is **off the board** — Attio matches natively; it could only return as a pure side-challenge bonus.)
- 🤔 Attio entry point — REST API vs MCP vs Workflows. Recommend **REST API or MCP** for speed → `[[stack]]`.

Related: `[[architecture]]` · `[[stack]]` · `[[tracks-and-prizes]]` · source: `[[hackathon-manual]]`
