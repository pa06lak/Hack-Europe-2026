import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020";

// The TypeScript shape of contracts/lead.schema.json (the P1->P2->P3 contract).
export interface LeadContact {
  name: string;
  phone?: string | null;
  email?: string | null;
}
export interface LeadRequirements {
  type?: "house" | "apartment" | null;
  area?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  beds?: number | null;
  must_haves?: string | null;
  timeline?: string | null;
}
export interface LeadProperty {
  type?: "house" | "apartment" | null;
  area?: string | null;
  beds?: number | null;
  features?: string | null;
  asking_price?: number | null;
  timeline?: string | null;
}
export interface Lead {
  intent: "buy" | "sell" | "rent";
  contact: LeadContact;
  requirements: LeadRequirements;
  property?: LeadProperty | null;
  financing?: string | null;
  consent?: boolean | null;
  source?: "voice" | "form";
}

// Validate against the SAME json file the whole team shares — no drift.
const schemaPath = path.resolve(__dirname, "../../contracts/lead.schema.json");
export const leadSchema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: false });
const _validate = ajv.compile(leadSchema);

export type ValidateResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: string[]; lead: unknown };

export function validateLead(data: unknown): ValidateResult {
  if (_validate(data)) return { ok: true, lead: data as Lead };
  const errors = (_validate.errors || []).map(
    (e) => `${e.instancePath || "(root)"} ${e.message ?? ""}`.trim()
  );
  return { ok: false, errors, lead: data };
}
