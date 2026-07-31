import { useBudgetRepo } from "../repositories/budget.repository.js";
import { BadRequestError } from "../utils/error.util.js";

export function useBudgetService() {
  const {
    add: _add,
    getById: _getById,
    getByCategoryAndMonthYear: _getByCategoryAndMonthYear,
    getDuplicate: _getDuplicate,
    updateById: _updateById,
  } = useBudgetRepo();

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

  return { add, updateById };
}
