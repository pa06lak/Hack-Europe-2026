# Tech:Europe Hackathon — Team Brain

This is the **working brain for our team at the {Tech: Europe} London AI Hackathon** — a
single, time-boxed sprint. It is the place to keep the *idea*, the *build*, and the *submission*
aligned while the clock runs. It is **not** the code repo and **not** a pitch deck — it's the
shared map everyone checks to know what we're building, who's doing what, and what's left.

**One line (provisional):** *Orbit* — a **voice-first real-estate lead engine on Attio**: an **SLNG** voice
agent qualifies buyers/sellers/renters, drops them into **Attio** as leads, and an **n8n** orchestrator runs
autonomous multichannel outreach (calls, WhatsApp, Telegram, email) — with **Superlinked** matching listings
to each lead. See `[[overview]]`. 🎯 **Attio track**; north star: close the loop without a human.

> ⚠️ **The name "Orbit" is provisional** — and may not fit the real-estate idea. Placeholder until the team decides — see `[[decisions]]`.
> 🔁 **Idea v3 (2026-06-27):** voice *intake* → Attio → n8n outreach (+ Superlinked rerank), focused on **real estate**. Earlier iterations (event concierge → comms-ingestion CRM) are recorded in `raw/idea-brief.md` + `[[decisions]]`.
> 👥 **Team = 3 people.** 6-hour sprint, hard deadline 19:00.

> ⏱️ **The dominant constraint is time: ~6 hours, hard deadline 19:00.** Every page should help us
> ship a demo, not build a product. When a choice trades scope for shippability, cut scope.

---

## The one rule: separate what we're building from what we're hoping

A hackathon dies by scope creep and by losing the demo in the last hour. So every claim and task
carries a status tag. Use them literally and keep them honest:

- ✅ **`decided`** — the team actively committed to this. Add a date. Belongs in `[[decisions]]`.
- 🔨 **`building`** — actively in progress right now. Has an owner.
- 🟢 **`done`** — built and demonstrably working (not "code written" — *working*).
- 🤔 **`assumption`** — a working assumption we're running on, not yet confirmed.
- ❓ **`open`** — an unresolved question or real fork; belongs also in `[[decisions]]`.
- 💡 **`idea`** — an option on the table; not yet adopted.
- ⏭️ **`cut`** — deliberately out of scope for the 6 hours. **Cutting is good. Name it so we stop debating it.**

When in doubt, tag it `assumption` or `open`, never `decided`. Nothing becomes `decided` silently —
a decision gets a line in `[[decisions]]` with a time and a one-sentence rationale.

---

## Structure

```
techeurope/
├── CLAUDE.md                  # this file — schema & conventions
├── README.md                  # quick orientation + navigation
├── overview.md                # what we're building + current state — read first
├── canvas.md                  # one screen: problem → demo → tech → judging fit
├── raw/                       # immutable source material (don't edit for style)
│   ├── hackathon-manual.md    # the official manual, verbatim
│   └── idea-brief.md          # the idea in the team's own words
├── hackathon/
│   ├── rules.md               # deadline, submission reqs, competition mode
│   ├── tracks-and-prizes.md   # tracks, side challenges, prizes, our pick
│   ├── judging.md             # criteria + how we win points
│   └── partners.md            # partner-tech catalog + which we use (need ≥3)
├── product/
│   ├── concept.md             # problem, who it's for, solution, the wow moment
│   ├── voice-intake.md        # the SLNG voice agent's qualifying questions (= the lead schema)
│   ├── architecture.md        # the pipeline end-to-end (voice → Attio → Superlinked → n8n)
│   └── data-model.md          # Attio objects: Leads, Requirements, Listings
├── build/
│   ├── timeline.md            # the 6-hour hour-by-hour plan (the most important page)
│   ├── tasks.md               # task board + owners
│   └── stack.md               # services, accounts, repos, env/keys
├── pitch/
│   ├── demo.md                # 2-minute demo script / live walkthrough
│   └── submission.md          # submission checklist (video, repo, README, form)
├── decisions.md               # decision log + live open-questions queue
└── team.md                    # who's in, roles, who owns what
```

Add pages only if they earn their keep in 6 hours. Keep one canonical page per topic.

---

## Page conventions

- **Frontmatter** on every page:
  ```yaml
  ---
  title: "..."
  type: overview | canvas | hackathon | product | build | pitch | decisions | team | raw
  status: draft | working | stable
  date_updated: 2026-06-27
  owner: shared | <name>
  ---
  ```
- **Voice:** plain, teammate-to-teammate. "We" for the team. Direct, concrete, no hype — the goal
  is to move fast together, not to sound impressive.
- **Links:** Obsidian-style `[[slug]]` for internal pages — filename without folder or `.md`
  (e.g. `[[architecture]]`, `[[timeline]]`, `[[partners]]`). Slugs are unique across folders, so
  the bare slug resolves. **Slug map:** `overview` · `canvas` · `rules` · `tracks-and-prizes` ·
  `judging` · `partners` · `concept` · `voice-intake` · `architecture` · `data-model` · `timeline` · `tasks` ·
  `stack` · `demo` · `submission` · `decisions` · `team` · `hackathon-manual` · `idea-brief`.
- **Dates & times:** ISO 8601 dates. For the sprint, use wall-clock times (e.g. `14:30`) and/or
  H-offsets from kickoff (e.g. `H+2:00`). The hard deadline is **19:00**.
- **Status discipline:** tag claims and tasks with the markers above. A page of untagged prose is a
  smell — say what's `decided` vs `assumption` vs `open` vs `cut`.
- **Partner-tech reminder:** we must use **≥3 partner technologies** to qualify. Every architecture
  and build choice should note which partner tech it leans on. See `[[partners]]`.

---

## How to work in here

- **Read-first order:** `CLAUDE.md` → `[[overview]]` → `[[timeline]]` → `[[tasks]]`. That's enough to
  know what we're building, where we are in the clock, and what to pick up next.
- **Ingest a new input** (a decision in the room, a teammate's idea, a blocker): update the relevant
  page(s), tag the new claims, and if it settles or opens a fork, log it in `[[decisions]]`.
- **Protect the demo:** the most valuable thing this wiki does is keep us pointed at a single working
  demo path (`[[demo]]`) and a single deadline (`[[submission]]`). When in doubt, ask "does this get us
  closer to the 2-minute demo?" If not, tag it `⏭️ cut`.
- **Keep it current:** bump `date_updated`; flip task tags `building → done` only when it actually works.

---

## Origin (for context)

We're at the {Tech: Europe} London AI Hackathon (London), 6-hour sprint, **3-person team**, >20k€ prize
pool. The idea went through three iterations (2026-06-27, see `[[decisions]]`): personal event concierge →
comms-ingestion relationship CRM → **the committed idea: a voice-first real-estate lead engine on Attio.**
A voice agent (**SLNG**) qualifies a buyer/seller/renter, writes the lead to **Attio**, and **n8n**
orchestrates autonomous multichannel outreach (SLNG calls, WhatsApp, Telegram, email), with **Superlinked**
reranking listings to the lead. We're entering the **Attio track**. Earlier briefs in `raw/idea-brief.md`;
rules in `raw/hackathon-manual.md`. The discipline this wiki keeps alive: **lock scope early, protect the
demo, submit on time.**
