import Budget from "../models/budget.model.js";
import { paginate } from "../utils/paginate.util.js";

export function useBudgetRepo() {
  async function createBudgetIndexes() {
    try {
      await Budget.syncIndexes();
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getAllByUserId({
    userId = "",
    search = "",
    month = "",
    year = "",
    page = 1,
    limit = 10,
  } = {}) {
    page = Math.max(parseInt(page, 10) - 1, 0);
    limit = parseInt(limit, 10) || 10;

    const query = { userId };

    if (search) {
      query.category = {
        $regex: search,
        $options: "i",
      };
    }

    if (month) {
      query.month = parseInt(month, 10);
    }

    if (year) {
      query.year = parseInt(year, 10);
    }

    try {
      const [items, length] = await Promise.all([
        Budget.find(query)
          .sort({ category: 1 })
          .skip(page * limit)
          .limit(limit),

        Budget.countDocuments(query),
      ]);

      return paginate({
        items,
        page,
        limit,
        length,
      });
    } catch (error) {
      throw new Error("Failed to fetch budgets: " + error.message);
    }
  }

  async function getById(id, userId) {
    try {
      return await Budget.findOne({
        _id: id,
        userId,
      });
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("Invalid ID format");
      }

      throw new Error("Failed to fetch budget: " + error.message);
    }
  }

  async function add(value) {
    try {
      return await Budget.create(value);
    } catch (error) {
      throw new Error("Failed to create budget: " + error.message);
    }
  }

  async function updateById(id, userId, value) {
    try {
      return await Budget.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        value,
        {
          new: true,
          runValidators: true,
        },
      );
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("Invalid ID format");
      }

      throw new Error("Failed to update budget: " + error.message);
    }
  }

  async function deleteById(id, userId) {
    try {
      return await Budget.findOneAndDelete({
        _id: id,
        userId,
      });
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("Invalid ID format");
      }

      throw new Error("Failed to delete budget: " + error.message);
    }
  }

  async function getByCategoryAndMonthYear(userId, category, month, year) {
    return Budget.findOne({
      userId,
      category,
      month,
      year,
    });
  }

  return {
    createBudgetIndexes,
    getAllByUserId,
    getById,
    add,
    updateById,
    deleteById,
    getByCategoryAndMonthYear,
  };
}
