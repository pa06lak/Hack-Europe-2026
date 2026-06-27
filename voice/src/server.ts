import "./env";
import express from "express";
import { extractLeadWithGemini } from "./gemini";
import { mockExtractLead } from "./mock";
import { validateLead } from "./lead";
import { upsertLead } from "./attio";
import { getCall, SLNG_CONFIGURED } from "./slng";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    gemini: !!process.env.GEMINI_API_KEY,
    attio: !!process.env.ATTIO_API_KEY,
    slng: SLNG_CONFIGURED,
  });
});

// SLNG delivers the transcript as `transcript_messages` (structured) on the call_end System
// webhook. Normalize string | array-of-messages | object into plain text for Gemini.
function transcriptToText(t: any): string {
  if (!t) return "";
  if (typeof t === "string") return t;
  if (Array.isArray(t)) {
    return t
      .map((m: any) => {
        if (typeof m === "string") return m;
        const who = m.role ?? m.speaker ?? "";
        const text = m.content ?? m.text ?? m.message ?? "";
        return who ? `${who}: ${text}` : String(text);
      })
      .join("\n");
  }
  if (typeof t === "object") return JSON.stringify(t);
  return String(t);
}

// SLNG call_end System webhook → extract lead → validate → write to Attio.
// Payload carries the tool's configured args (transcript, phone_number, call_id); we read
// them tolerantly since the exact envelope key is confirmed at the booth.
app.post("/slng/call-end", async (req, res) => {
  try {
    const b = req.body ?? {};
    const args = b.arguments ?? b.parameters ?? b;

    let transcript = transcriptToText(args.transcript ?? b.transcript ?? b.transcript_messages);
    const phone: string | null = args.phone_number ?? b.phone_number ?? null;
    const callId: string | null = args.call_id ?? b.call_id ?? null;
    const agentId: string | null = args.agent_id ?? b.agent_id ?? process.env.SLNG_AGENT_ID ?? null;

    // Fallback: fetch the transcript via the API if the webhook didn't carry it.
    if (!transcript && callId && agentId && SLNG_CONFIGURED) {
      try {
        const call = await getCall(agentId, callId);
        transcript = transcriptToText(call?.transcript);
      } catch (e) {
        console.error("[call-end] getCall fallback failed:", (e as Error).message);
      }
    }

    const useGemini = !!process.env.GEMINI_API_KEY && !!transcript;
    const lead = useGemini ? await extractLeadWithGemini(transcript) : mockExtractLead(transcript);

    // Caller ID from SLNG is the most reliable phone source.
    if (phone && !lead.contact.phone) lead.contact.phone = phone;

    const v = validateLead(lead);
    if (!v.ok) return res.status(422).json({ error: "invalid lead", details: v.errors, lead });

    const attio = await upsertLead(v.lead);
    res.json({ ok: true, lead: v.lead, attio });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () =>
  console.log(`[orbit-voice] listening on :${port}  POST /slng/call-end  (slng=${SLNG_CONFIGURED})`)
);
