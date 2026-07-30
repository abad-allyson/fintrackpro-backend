import { useBudgetRepo } from "../repositories/budget.repository.js";
import { BadRequestError } from "../utils/error.util.js";

export function useBudgetService() {
  const {
    add: _add,
    getByCategoryAndMonthYear: _getByCategoryAndMonthYear,
    getDuplicate: _getDuplicate,
    updateById: _updateById,
  } = useBudgetRepo();

  async function add(value) {
    const existingBudget = await _getByCategoryAndMonthYear(
      value.userId,
      value.category,
      value.month,
      value.year,
    );

    if (existingBudget) {
      throw new BadRequestError(
        "A budget for this category already exists for the selected month and year.",
      );
    }

    return await _add(value);
  }

  async function updateById(id, userId, value) {
    const existing = await _getDuplicate(
      value.userId,
      value.category,
      value.month,
      value.year,
      id,
    );
    console.log("updating...");

    if (existing) {
      throw new BadRequestError(
        "A budget for this category already exists for the selected month and year.",
      );
    }

    return await _updateById(id, userId, value);
  }

  return { add, updateById };
}
