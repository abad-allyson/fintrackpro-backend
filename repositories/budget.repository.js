import Budget from "../models/budget.model.js";

export function useBudgetRepo() {
  async function createBudgetIndexes() {
    try {
      await Budget.syncIndexes();
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getAllByUserId(userId) {
    try {
      return await Budget.find({ userId });
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

  return {
    createBudgetIndexes,
    getAllByUserId,
    getById,
    add,
    updateById,
    deleteById,
  };
}
