import "./env";
import express from "express";
import { extractLeadWithGemini } from "./gemini";
import { mockExtractLead } from "./mock";
import { validateLead } from "./lead";
import { upsertLead } from "./attio";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, gemini: !!process.env.GEMINI_API_KEY, attio: !!process.env.ATTIO_API_KEY });
});

// SLNG call-end webhook. NOTE: the exact payload shape is UNVERIFIED — confirm at the
// SLNG booth. We try a few likely fields for the transcript, and prefer pre-captured
// variables if SLNG sends them. See wiki/build/derisk.md.
app.post("/slng/call-end", async (req, res) => {
  try {
    const b = req.body ?? {};
    const transcript: string =
      b.transcript ?? b.call?.transcript ?? b.data?.transcript ?? JSON.stringify(b.runtime_variables ?? b);

    const hasKey = !!process.env.GEMINI_API_KEY;
    const lead = hasKey ? await extractLeadWithGemini(transcript) : mockExtractLead(transcript);

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
app.listen(port, () => console.log(`[orbit-voice] listening on :${port}  (POST /slng/call-end)`));
