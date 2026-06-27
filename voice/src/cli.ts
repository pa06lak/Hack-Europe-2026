import "./env";
import fs from "node:fs";
import path from "node:path";
import { extractLeadWithGemini } from "./gemini";
import { mockExtractLead } from "./mock";
import { validateLead } from "./lead";

// Usage: npm run extract [-- --file path/to/transcript.txt]
// Uses Gemini when GEMINI_API_KEY is set; otherwise the offline mock extractor.
function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const file = getArg("--file") || path.resolve(__dirname, "../sample-transcript.txt");
  const transcript = fs.readFileSync(file, "utf8");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const hasKey = !!process.env.GEMINI_API_KEY;

  console.error(`[extract] file=${path.basename(file)} engine=${hasKey ? "gemini:" + model : "offline-mock"}`);
  const lead = hasKey ? await extractLeadWithGemini(transcript) : mockExtractLead(transcript);

  console.log(JSON.stringify(lead, null, 2));

  const v = validateLead(lead);
  if (!v.ok) {
    console.error("\n[extract] ✗ INVALID against contracts/lead.schema.json:\n - " + v.errors.join("\n - "));
    process.exit(1);
  }
  console.error("\n[extract] ✓ valid against contracts/lead.schema.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
