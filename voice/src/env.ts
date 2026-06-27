import path from "node:path";
import dotenv from "dotenv";

// Keys live in the repo-root .env (single source). Load it first, then allow a
// local voice/.env to override during development.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();
