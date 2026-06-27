import path from "node:path";
import dotenv from "dotenv";

// Keys live in the repo-root .env (single source). Load it, then a local attio/.env override.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();
