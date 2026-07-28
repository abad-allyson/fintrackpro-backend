import User from "../models/user.model.js";

export function useUserRepo() {
  async function createUserIndexes() {
    try {
      await User.syncIndexes();
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getByClerkId(clerkId) {
    try {
      return await User.findOne({ clerkId });
    } catch (error) {
      throw new Error("Failed to get user by clerkId: " + error.message);
    }
  }

  async function getById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid Id");
      throw new Error("Failed to get by id: " + error.message);
    }
  }

  async function add(value) {
    try {
      return await User.create(value);
    } catch (error) {
      throw new Error("Failed to add user: " + error.message);
    }
  }

  async function updateByClerkId(clerkId, value) {
    try {
      return await User.findOneAndUpdate({ clerkId }, value, { new: true });
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  }

  async function softDeleteByClerkId(clerkId) {
    return User.findOneAndUpdate(
      { clerkId },
      {
        status: "deleted",
        deletedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  return {
    createUserIndexes,
    getByClerkId,
    getById,
    updateByClerkId,
    add,
    softDeleteByClerkId,
  };
}
