import "./env";

// Minimal Attio v2 REST client. Runs as a DRY RUN (logs requests) when ATTIO_API_KEY
// is unset, so P2 can build + demo the shapes before the workspace is live.
// Entry point per wiki/build/derisk.md: REST (no native n8n Attio node; n8n uses HTTP too).
const BASE = process.env.ATTIO_BASE_URL || "https://api.attio.com/v2";
const KEY = process.env.ATTIO_API_KEY;
export const DRY_RUN = !KEY;

async function attio(path: string, init: { method: string; body?: string }): Promise<any> {
  if (DRY_RUN) {
    console.error(`[attio:dry] ${init.method} ${path}`);
    if (init.body) console.error("           " + init.body);
    return { dryRun: true };
  }
  const res = await fetch(`${BASE}${path}`, {
    method: init.method,
    headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
    body: init.body,
  });
  if (!res.ok) throw new Error(`Attio ${res.status} ${init.method} ${path}: ${await res.text()}`);
  return res.status === 204 ? {} : res.json();
}

/** Idempotent upsert. matchingAttribute must be a UNIQUE attribute on the object. */
export function assertRecord(object: string, matchingAttribute: string, values: Record<string, unknown>) {
  return attio(`/objects/${object}/records?matching_attribute=${encodeURIComponent(matchingAttribute)}`, {
    method: "PUT",
    body: JSON.stringify({ data: { values } }),
  });
}

export function createRecord(object: string, values: Record<string, unknown>) {
  return attio(`/objects/${object}/records`, { method: "POST", body: JSON.stringify({ data: { values } }) });
}

export function listRecords(object: string, limit = 50) {
  return attio(`/objects/${object}/records/query`, { method: "POST", body: JSON.stringify({ limit }) });
}
