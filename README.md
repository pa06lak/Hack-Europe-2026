Orbit

A voice-first real-estate lead engine on Attio. You call in, talk to an agent for 90 seconds, and before you've hung up you've got a WhatsApp with your top-matched London homes and a callback scheduled to view them. No human in the loop.

🏆 {Tech: Europe} London AI Hackathon · Attio track — The Agentic CRM


The problem

Estate agents lose most of their inbound leads to lag. A buyer enquires on Rightmove at 9pm, the agent replies at 11am the next day, and by then the buyer has moved on to three other listings. The industry knows this — speed-to-lead is the single strongest predictor of conversion — but agents are humans with inboxes, and humans don't reply in 30 seconds.

Orbit is the version where they do. A buyer talks to a voice agent, gets qualified, gets matched, gets a WhatsApp with real listings, and gets a callback to book a viewing — end-to-end in under a minute, with Attio as the system of record so the agency still owns the relationship.


How it works

[Sling voice intake] → [Gemini → lead JSON] → [Attio: Lead + Requirements] → [n8n trigger]
        │                                              (system of record)          │
   qualify the caller                                                              ▼
   (intent · area · type ·                                  rank listings (Superlinked / filter)
    beds · budget · must-haves)                             → WhatsApp top matches + Sling callback
                                                            → log outcomes back to Attio

Each stage is independently testable and falls back gracefully — if Gemini structuring fails, the raw transcript still lands in Attio as a lead for human triage. Full pipeline and fallback behaviour in wiki/product/architecture.md.


Why these choices

The interesting decisions aren't which tools — they're why this combination closes the loop where others don't.


Sling for voice over Vapi/Retell: native callback primitive means the outbound leg of the loop is one API call, not a separate Twilio integration. The whole pitch is the round-trip, so we optimised for that.
Attio as system of record, not just storage: the agentic-CRM bet is that the CRM is the orchestration substrate. Leads, Requirements, and Match outcomes are first-class objects, so any downstream automation (n8n, future agents) reads from one source of truth instead of a bag of webhooks.
Gemini for structuring rather than relying on the voice model's function calling: keeps the voice agent focused on conversation quality and lets us iterate on the extraction prompt independently. Cheaper to debug, and the JSON contract (see contracts/) becomes the spine the whole team shares.
n8n for orchestration over bespoke code: the match-and-notify flow is the part judges and partners most want to see running, and n8n makes it visible and editable in the demo rather than buried in a function.



Partner tech

Four core integrations (the track requires ≥3):

ToolRoleSlingVoice in + outbound callbackAttioSystem of record — Leads, Requirements, Listings, Matchesn8nOrchestration: trigger → rank → notify → logGeminiTranscript → structured lead JSON

Stretch integrations: Superlinked for semantic listing rerank, Tavily for area enrichment (schools, transport, vibe).


Repo layout

contracts/        the lead JSON contract — schema + worked example (the spine everyone shares)
data/             ~22 curated London listings, seeded into Attio so the match is visible
voice/            P1 (Iason) — Sling agent + Gemini structuring → lead JSON
attio/            P2 (Alex)  — object model + write/read client + listings seed
orchestration/    P3 (Palak) — n8n flow: trigger → rank → WhatsApp + Sling call → log back
wiki/             the team brain (plan, decisions, demo script, submission checklist)
.env.example      all keys; copy to .env and fill in (never commit real keys)


Run it locally


cp .env.example .env and fill in keys (see wiki/build/stack.md for where each one comes from).
Attio: create the object model and seed data/listings.seed.json — cd attio && npm run seed.
Voice: deploy the Sling agent and point it at the Gemini structuring endpoint — cd voice && npm run dev.
n8n: import orchestration/orbit.flow.json, wire your WhatsApp Business number and Sling callback credentials.
End-to-end test: call the Sling number as a buyer → watch the lead land in Attio → confirm WhatsApp arrives → answer the callback.
