import dotenv from "dotenv";

// Loaded here, not in index.js. `import { PORT } from "./config.js"` is
// hoisted by the ES module loader, so config.js would otherwise be
// evaluated (reading process.env) before a dotenv.config() call sitting
// later in index.js's body ever ran. Loading it at the top of the one
// file everything else imports from makes env loading order-independent.
dotenv.config();

export const PORT = process.env.PORT || 4000;

export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB = process.env.MONGO_DB || "fintrackpro";

export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_WEBHOOK_SIGNING_SECRET =
  process.env.CLERK_WEBHOOK_SIGNING_SECRET;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
