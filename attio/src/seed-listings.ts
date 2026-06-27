import "./env";
import fs from "node:fs";
import path from "node:path";
import { assertRecord, DRY_RUN } from "./client";

// Seeds data/listings.seed.json into the Attio "Listings" object (idempotent — re-runnable).
// Requires a UNIQUE attribute on Listings to dedupe on (default "listing_id"). Object slug
// and attribute slugs must match P2's Attio model — adjust via env if they differ.
const LISTINGS_OBJECT = process.env.ATTIO_LISTINGS_OBJECT || "listings";
const MATCH = process.env.ATTIO_LISTING_MATCH || "listing_id";

interface Listing {
  id: string;
  title: string;
  type: string;
  area: string;
  price: number;
  beds: number;
  baths?: number;
  features: string[];
  description: string;
}

function toValues(l: Listing): Record<string, unknown> {
  return {
    name: l.title,
    [MATCH]: l.id,
    type: l.type,
    area: l.area,
    price: l.price,
    beds: l.beds,
    baths: l.baths,
    features: l.features.join(", "),
    description: l.description,
  };
}

async function main() {
  const file = path.resolve(__dirname, "../../data/listings.seed.json");
  const listings: Listing[] = JSON.parse(fs.readFileSync(file, "utf8"));
  console.error(
    `[seed] ${listings.length} listings -> object="${LISTINGS_OBJECT}" match="${MATCH}"` +
      (DRY_RUN ? "  (DRY RUN — set ATTIO_API_KEY to write)" : "")
  );

  let ok = 0;
  for (const l of listings) {
    try {
      await assertRecord(LISTINGS_OBJECT, MATCH, toValues(l));
      ok++;
      if (!DRY_RUN) console.error(`  ✓ ${l.id}  ${l.title}`);
    } catch (e: any) {
      console.error(`  ✗ ${l.id}: ${e.message}`);
    }
  }
  console.error(`[seed] done: ${ok}/${listings.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
