import { useTransactionRepo } from "../repositories/transaction.repository.js";
import { BadRequestError } from "../utils/error.util.js";
import { getCurrentMonthRange } from "../utils/date.util.js";

export function useDashboardService() {
  const { getMonthlySummary: _getMonthlySummary } = useTransactionRepo();
  const { start, end } = getCurrentMonthRange();

  async function getMonthlySummary(userId) {
    const totals = await _getMonthlySummary(userId, start, end);

    let totalIncome = 0;
    let totalExpense = 0;

    for (const item of totals) {
      if (item._id === "income") {
        totalIncome = item.total;
      }

      if (item._id === "expense") {
        totalExpense = item.total;
      }
    }

    const result = {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
    };

    return result;
  }

  return { getMonthlySummary };
}
