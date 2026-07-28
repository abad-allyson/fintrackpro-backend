import Transaction from "../models/transaction.model.js";
import { paginate } from "../utils/paginate.util.js";

export function useTransactionRepo() {
  async function createTransactionIndexes() {
    try {
      await Transaction.syncIndexes();
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getAllByUserId({
    page = 1,
    limit = 10,
    userId = "",
    category = "",
    type = "",
    month = "",
    year = "",
  } = {}) {
    page = page > 0 ? page - 1 : page;
    limit = parseInt(limit);

    const query = { userId };
    if (category) query.category = category;
    if (type) query.type = type;

    if (year) {
      const y = parseInt(year);
      const m = month ? parseInt(month) - 1 : null;
      const start = m !== null ? new Date(y, m, 1) : new Date(y, 0, 1);
      const end = m !== null ? new Date(y, m + 1, 1) : new Date(y + 1, 0, 1);
      query.date = { $gte: start, $lt: end };
    }

    try {
      const [items, length] = await Promise.all([
        Transaction.find(query)
          .sort({ date: -1 })
          .skip(page * limit)
          .limit(limit),
        Transaction.countDocuments(query),
      ]);

      return paginate({ items, page, limit, length });
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid user ID.");
      throw new Error("Failed to fetch transactions: " + error.message);
    }
  }

  async function getById(id, userId) {
    try {
      return await Transaction.findOne({ _id: id, userId });
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid Id");
      throw new Error("Failed to fetch transaction: " + error.message);
    }
  }

  async function add(value) {
    try {
      return await Transaction.create(value);
    } catch (error) {
      throw new Error("Failed to add transaction: " + error.message);
    }
  }

  async function updateById(id, userId, value) {
    try {
      return await Transaction.findOneAndUpdate({ _id: id, userId }, value, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid ID format");
      throw new Error("Failed to update transaction: " + error.message);
    }
  }

  async function deleteById(id, userId) {
    try {
      return await Transaction.findOneAndDelete({
        _id: id,
        userId,
      });
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("Invalid ID format");
      }

      throw new Error("Failed to delete transaction: " + error.message);
    }
  }

  // Used by user.service.js when an account is deleted
  async function deleteAllByUserId(userId) {
    try {
      return await Transaction.deleteMany({ userId });
    } catch (error) {
      throw new Error("Failed to delete transactions: " + error.message);
    }
  }

  return {
    createTransactionIndexes,
    getAllByUserId,
    getById,
    add,
    updateById,
    deleteById,
    deleteAllByUserId,
  };
}
