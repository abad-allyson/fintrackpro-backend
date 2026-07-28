# FinTrack Pro — Backend (Mongoose)

Same layered structure as your job-tracker project — repository → service → controller → route — now on **Mongoose** (per the original project overview) instead of the native MongoDB driver, and scoped down to just what's built so far: **Transactions CRUD, Budgets CRUD, and Clerk-based auth.** Billing, receipts, analytics, and tax are deliberately not in this cut — add them back the same way these were built, when you're ready.

## Why Mongoose changes more than just the models

Your old project talked to `db.collection(...)` directly, so every repository imported a live `db` handle from `index.js` — and could only run *after* that connection resolved. Mongoose models hold their own connection internally and **buffer operations until connected**, so:

- Repositories now `import User from "../models/user.model.js"` directly — no more `import { db } from "../index.js"` circular dependency.
- `index.js` no longer exports a `db` at all.
- Validation (`required`, `enum`, `maxlength`, etc.) now lives on the Mongoose schema itself — Joi has been removed since it was doing the same job twice.

## What's in this cut

- **Users** — `clerkId` + `email` only. Identity and profile data belong to Clerk; this collection just links a Clerk user to their own transactions/budgets.
- **Transactions** — full CRUD (`list`, `get`, `create`, `update`, `delete`), filterable by category/type/month/year, paginated.
- **Budgets** — full CRUD, one budget per category per user (unique index).
- **Auth** — `@clerk/express` verifies the session; `requireAuth` middleware resolves it to a local `req.dbUser`. The Clerk webhook (`POST /api/webhooks/clerk`) keeps the local `users` collection in sync on sign-up/update/delete.

## Deliberately not here yet

- Billing/Stripe (subscriptions, checkout, webhooks)
- Receipts (OCR, file upload)
- Analytics/dashboard aggregates
- Tax estimator
- CSV import/export, bank sync, AI categorization

None of these are hard blockers to add later — they slot into the same repository/service/controller/route pattern. Ask when you're ready to bring one back in.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` / `MONGO_DB` — Atlas or local Mongo
- `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET` — Clerk Dashboard → API Keys / Webhooks (point the webhook at `POST /api/webhooks/clerk`, subscribe to `user.created`, `user.updated`, `user.deleted`)
- `REDIS_*` — optional, nothing currently requires it; leave blank locally and `setup.js` just logs a warning and continues

```bash
npm run dev
```

`GET /health` should respond once Mongo connects and indexes are created.

## Structure

```
├── index.js                 # entry point — mongoose.connect(), then mounts routes
├── setup.js                 # index creation for users/transactions/budgets
├── config.js                # env exports
├── controllers/              # user, transaction, budget, webhook
├── models/                   # Mongoose schemas (validation lives here now)
├── repositories/             # one Mongoose model each, no db handle needed
├── services/                  # business logic between controllers and repos
├── routes/                    # user, transaction, budget, webhook (clerk)
├── middleware/
│   ├── auth.middleware.js      # Clerk session -> req.dbUser
│   └── error.middleware.js
└── utils/                      # error, logger, paginate, cache, redis-client,
                                 # catch-async
```

## Suggested order

1. `/health` responds, Mongo connects, indexes created
2. Wire Clerk on the Next.js frontend, confirm sign-up hits `/api/webhooks/clerk` and creates a `users` row
3. Transactions CRUD end-to-end
4. Budgets CRUD end-to-end
5. Come back for billing/receipts/analytics/tax once the core loop works
