import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

import { PORT, MONGO_URI, MONGO_DB } from "./config.js";

// App Config - Initialize Express application
const app = express();

// Database Connection
// No `export let db` — Mongoose models (models/*.model.js) hold their own
// connection internally, so repositories import the model directly
// instead of a shared db handle threaded through index.js.
async function connectToDB() {
  await mongoose.connect(MONGO_URI, { dbName: MONGO_DB });
  console.log("✅ Connected to MongoDB");
}

import useWebhookRoute from "./routes/webhook.route.js";
import useUserRoute from "./routes/user.route.js";
import useTransactionRoute from "./routes/transaction.route.js";
import useBudgetRoute from "./routes/budget.route.js";

import setup from "./setup.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.util.js";

// Application Startup
connectToDB()
  .then(async () => {
    try {
      await setup();
      console.log("Successfully ran setup script");
    } catch (error) {
      console.error("Failed to run setup script:", error.message);
    }

    // Webhooks FIRST, with their own raw-body parser — must come before
    // express.json() below, since Clerk's signature verification needs
    // the untouched raw request body.
    app.use("/api/webhooks", useWebhookRoute());

    // Middleware Pipeline
    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware()); // attaches Clerk auth state to every request

    // Health Check Route
    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        message: "API is running",
        mongoConnection:
          mongoose.connection.readyState === 1 ? "connected" : "not connected",
      });
    });

    // Routes
    app.use("/api/users", useUserRoute());
    app.use("/api/transactions", useTransactionRoute());
    app.use("/api/budgets", useBudgetRoute());

    // 404 for anything unmatched
    app.use((req, res) => res.status(404).json({ error: "Not found!!" }));

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      logger.log({
        level: "info",
        message: `🚀 Server running at http://localhost:${PORT}`,
      });
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
