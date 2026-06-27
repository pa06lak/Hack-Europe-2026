import "./env";
import type { Lead } from "./lead";

// P1 -> P2 seam. Upserts a Lead into Attio (dedupe on email — Attio email is unique
// by default; phone is NOT). NOTE: object slug + attribute slugs + value SHAPES must
// match Alex's Attio model — confirm with one real PUT before trusting these. See
// wiki/build/derisk.md. Runs as a DRY RUN (logs the payload) when ATTIO_API_KEY is unset.
const BASE = "https://api.attio.com/v2";
const LEADS_OBJECT = process.env.ATTIO_LEADS_OBJECT || "leads";

export function leadToAttioValues(lead: Lead): Record<string, unknown> {
  const r = lead.requirements || {};
  const values: Record<string, unknown> = {
    name: lead.contact.name,
    intent: lead.intent,
    property_type: r.type ?? undefined,
    area: r.area ?? undefined,
    budget_min: r.budget_min ?? undefined,
    budget_max: r.budget_max ?? undefined,
    beds: r.beds ?? undefined,
    must_haves: r.must_haves ?? undefined,
    timeline: r.timeline ?? undefined,
  };
  // Attio's standard contact attrs are arrays; custom text attrs are plain. Verify with P2.
  if (lead.contact.email) values.email_addresses = [lead.contact.email];
  if (lead.contact.phone) values.phone_numbers = [lead.contact.phone];
  return values;
}

export async function upsertLead(lead: Lead): Promise<unknown> {
  const key = process.env.ATTIO_API_KEY;
  const values = leadToAttioValues(lead);
  const url = `${BASE}/objects/${LEADS_OBJECT}/records?matching_attribute=email`;
  const payload = { data: { values } };

  if (!key) {
    console.error(`[attio] no ATTIO_API_KEY — DRY RUN. Would PUT ${url}`);
    console.error(JSON.stringify(payload, null, 2));
    return { dryRun: true, url, payload };
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Attio ${res.status}: ${await res.text()}`);
  return res.json();
}
