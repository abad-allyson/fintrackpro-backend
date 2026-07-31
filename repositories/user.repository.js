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
      const result = await User.findOne({ clerkId });
      return result;
    } catch (error) {
      throw new Error("Failed to get user by clerkId: " + error.message);
    }
  }

  async function getById(id) {
    try {
      if (!id || !mongoose.isValidObjectId(id)) {
        return null;
      }
      const result = await User.findById(id);
      return result;
    } catch (error) {
      if (error.name === "CastError") throw new Error("Invalid Id");
      throw new Error("Failed to get by id: " + error.message);
    }
  }

  async function add(value) {
    try {
      const result = await User.create(value);
      return result;
    } catch (error) {
      throw new Error("Failed to add user: " + error.message);
    }
  }

  async function updateByClerkId(clerkId, value) {
    try {
      const result = await User.findOneAndUpdate({ clerkId }, value, {
        new: true,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  }

  async function softDeleteByClerkId(clerkId) {
    try {
      const result = User.findOneAndUpdate(
        { clerkId },
        {
          status: "deleted",
          deletedAt: new Date(),
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error("Failed to delete." + error.message);
    }
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
