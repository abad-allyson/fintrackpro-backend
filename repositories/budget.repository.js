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

  async function getByUserId(userId) {
    try {
      return await Budget.find({ userId });
    } catch (error) {
      throw new Error("Failed to fetch budgets: " + error.message);
    }
  }

  async function add(value) {
    try {
      const doc = await Budget.create(value);
      return { message: "Successfully created budget.", value: doc };
    } catch (error) {
      throw new Error("Failed to add budget: " + error.message);
    }
  }

  async function updateById(id, userId, value) {
    try {
      return await Budget.findOneAndUpdate({ _id: id, userId }, value, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid ID format");
      throw new Error("Failed to update budget: " + error.message);
    }
  }

  async function deleteById(id, userId) {
    try {
      const doc = await Budget.findOneAndDelete({ _id: id, userId });
      return { deletedCount: doc ? 1 : 0 };
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid ID format");
      throw new Error("Failed to delete budget: " + error.message);
    }
  }

  async function deleteAllByUserId(userId) {
    try {
      return await Budget.deleteMany({ userId });
    } catch (error) {
      throw new Error("Failed to delete budgets: " + error.message);
    }
  }

  return { createBudgetIndexes, getByUserId, add, updateById, deleteById, deleteAllByUserId };
}
