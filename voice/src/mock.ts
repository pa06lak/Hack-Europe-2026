import type { Lead } from "./lead";

// Offline heuristic extractor so P1 can demo the full pipeline with NO API key.
// Not smart — just enough to emit a VALID lead. The real path is gemini.ts.
const AREAS = [
  "Shoreditch", "Hoxton", "Hackney", "Bethnal Green", "Islington", "Dalston",
  "Clapham", "Brixton", "Canary Wharf", "Greenwich", "Peckham", "Bermondsey",
  "Wapping", "Stoke Newington", "Walthamstow", "Camden",
];
const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };

// Only look at what the CALLER said, so menu words ("buy, sell, or rent") in the
// agent's prompts don't pollute extraction.
function callerText(transcript: string): string {
  const caller = transcript
    .split(/\r?\n/)
    .filter((l) => /^\s*caller\s*:/i.test(l))
    .map((l) => l.replace(/^\s*caller\s*:/i, "").trim());
  return (caller.length ? caller.join(" ") : transcript).trim();
}

export function mockExtractLead(transcript: string): Lead {
  const t = callerText(transcript).replace(/\s+/g, " ");
  const lc = t.toLowerCase();

  const intent: Lead["intent"] =
    /\b(sell|selling)\b/.test(lc) ? "sell" :
    /\b(rent|renting|to let|letting)\b/.test(lc) ? "rent" : "buy";

  const type: LeadType =
    /\b(flat|apartment)\b/.test(lc) ? "apartment" :
    /\b(house|townhouse)\b/.test(lc) ? "house" : null;

  let beds: number | null = null;
  const bedsDigit = lc.match(/(\d+)\s*[- ]?\s*bed/);
  const bedsWord = lc.match(/\b(one|two|three|four|five)\s*[- ]?\s*bed/);
  if (bedsDigit) beds = parseInt(bedsDigit[1], 10);
  else if (bedsWord) beds = WORD_NUM[bedsWord[1]];

  let budget_max: number | null = null;
  const bm = lc.match(/([\d.,]+)\s*(k|m)\b/i) || lc.match(/(?:£|budget[^0-9£]{0,15})\s*([\d.,]+)/i);
  if (bm) {
    let n = parseFloat(bm[1].replace(/,/g, ""));
    const unit = (bm[2] || "").toLowerCase();
    if (unit === "k") n *= 1_000;
    else if (unit === "m") n *= 1_000_000;
    else if (n < 10_000) n *= 1_000; // "600" -> 600k
    budget_max = Math.round(n);
  }

  const area = AREAS.find((a) => lc.includes(a.toLowerCase())) ?? null;

  const nameM = t.match(
    /(?:I['’]?m|I am|[Tt]his is|[Mm]y name is|[Nn]ame['’]?s)\s+([A-Z][a-zA-Z'’]+(?: [A-Z][a-zA-Z'’]+)?)/
  );
  const name = nameM ? nameM[1].trim() : "Caller";

  const emailM = t.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailM ? emailM[0] : null;

  const must = ["garden", "parking", "balcony", "terrace", "station", "pet", "natural light", "outside space", "garage"]
    .filter((f) => lc.includes(f));

  return {
    intent,
    contact: { name, phone: null, email },
    requirements: {
      type,
      area,
      beds,
      budget_min: null,
      budget_max,
      must_haves: must.length ? must.join(", ") : null,
      timeline: null,
    },
    source: "form",
  };
}

type LeadType = "house" | "apartment" | null;
