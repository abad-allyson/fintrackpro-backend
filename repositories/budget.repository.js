import mongoose from "mongoose";
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
    category = "",
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

    if (category) {
      query.category = category;
    }

    if (month) {
      query.month = parseInt(month, 10);
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
      if (!id || !mongoose.isValidObjectId(id)) {
        return null;
      }

      const result = await Budget.findOne({
        _id: id,
        userId,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to fetch budget: " + error.message);
    }
  }

  async function add(value) {
    try {
      const result = await Budget.create(value);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function updateById(id, userId, value) {
    try {
      const result = await Budget.findOneAndUpdate(
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

      return result;
    } catch (error) {
      throw error;
    }
  }

  async function deleteById(id, userId) {
    try {
      const result = await Budget.findOneAndDelete({
        _id: id,
        userId,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to delete budget: " + error.message);
    }
  }

  async function getByCategoryAndMonthYear(userId, category, month, year) {
    try {
      const result = Budget.findOne({
        userId,
        category,
        month,
        year,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to get categories and date: " + error.message);
    }
  }

  async function getDuplicate(userId, category, month, year, excludeId) {
    try {
      const result = Budget.findOne({
        userId,
        category,
        month,
        year,
        _id: { $ne: excludeId },
      });

      return result;
    } catch (error) {
      throw new Error("Failed to check duplicates: " + error.message);
    }
  }

  async function getMonthlyBudgetPerCategory(userId, month, year) {
    try {
      const result = await Budget.find({
        userId,
        month,
        year,
      }).sort({
        category: 1,
      });

      return result;
    } catch (error) {
      throw new Error("Failed to get monthly budgets: " + error.message);
    }
  }

  return {
    createBudgetIndexes,
    getAllByUserId,
    getById,
    add,
    updateById,
    deleteById,
    getByCategoryAndMonthYear,
    getDuplicate,
    getMonthlyBudgetPerCategory,
  };
}
