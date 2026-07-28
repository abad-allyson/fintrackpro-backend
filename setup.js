import { useTransactionRepo } from "./repositories/transaction.repository.js";
import { useBudgetRepo } from "./repositories/budget.repository.js";
import { useUserRepo } from "./repositories/user.repository.js";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./config.js";
import { logger } from "./utils/logger.util.js";

export default async function setup() {
  const indexJobs = [
    ["users", useUserRepo().createUserIndexes],
    ["transactions", useTransactionRepo().createTransactionIndexes],
    ["budgets", useBudgetRepo().createBudgetIndexes],
  ];

  for (const [name, createIndexes] of indexJobs) {
    try {
      const message = await createIndexes();
      logger.log({ level: "info", message: `[${name}] ${message}` });
    } catch (error) {
      logger.log({ level: "error", message: `[${name}] ${error.message}` });
    }
  }
}
