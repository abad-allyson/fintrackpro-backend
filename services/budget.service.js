import { useBudgetRepo } from "../repositories/budget.repository.js";
import { BadRequestError } from "../utils/error.util.js";
import { getCurrentMonthYear } from "../utils/date.util.js";
import { useTransactionRepo } from "../repositories/transaction.repository.js";

export function useBudgetService() {
  const {
    add: _add,
    getAllByUserId: _getAllByUserId,
    getById: _getById,
    getByCategoryAndMonthYear: _getByCategoryAndMonthYear,
    getDuplicate: _getDuplicate,
    updateById: _updateById,
    getMonthlyBudgetPerCategory,
  } = useBudgetRepo();

  const { getMonthlySpentByCategory } = useTransactionRepo();

  async function add(value) {
    const current = new Date();

    value.month = current.getMonth() + 1;
    value.year = current.getFullYear();

    const existingBudget = await _getByCategoryAndMonthYear(
      value.userId,
      value.category,
      value.month,
      value.year,
    );

    if (existingBudget) {
      throw new BadRequestError(
        "A budget for this category already exists for the current month.",
      );
    }

    return await _add(value);
  }

  async function updateById(id, userId, value) {
    const budget = await _getById(id, userId);

    if (!budget) {
      return null;
    }

    const updateData = {
      category: value.category,
      monthlyLimit: value.monthlyLimit,
    };

    const duplicate = await _getDuplicate(
      userId,
      updateData.category,
      budget.month,
      budget.year,
      id,
    );

    if (duplicate) {
      throw new BadRequestError(
        "A budget for this category already exists for the current month.",
      );
    }

    return await _updateById(id, userId, updateData);
  }

  async function getSummary(userId, query) {
    const month = query.month ? parseInt(query.month) : undefined;
    const year = query.year ? parseInt(query.year) : undefined;

    const [budgets, expenses] = await Promise.all([
      getMonthlyBudgetPerCategory(userId, month, year),
      getMonthlySpentByCategory(userId, month, year),
    ]);

    // Total Budget
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + budget.monthlyLimit,
      0,
    );

    const expenseMap = new Map(
      expenses.map((expense) => [expense.category, expense.spent]),
    );

    const totalSpent = budgets.reduce((sum, budget) => {
      return sum + (expenseMap.get(budget.category) || 0);
    }, 0);

    const remainingBudget = totalBudget - totalSpent;

    const result = {
      totalBudget,
      totalSpent,
      remainingBudget,
    };

    return result;
  }

  async function getAllByUserId(query) {
    try {
      const result = await _getAllByUserId(query);

      const expenses = await getMonthlySpentByCategory(
        query.userId,
        query.month,
        query.year,
      );

      const expenseMap = new Map(
        expenses.map((expense) => [expense.category, expense.spent]),
      );

      const items = result.items.map((budget) => {
        const spent = expenseMap.get(budget.category) || 0;

        return {
          ...budget.toObject(),
          spent,
          remaining: budget.monthlyLimit - spent,
        };
      });

      const response = {
        ...result,
        items,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  return { add, updateById, getSummary, getAllByUserId };
}
