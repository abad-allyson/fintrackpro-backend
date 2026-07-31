import { useUserRepo } from "../repositories/user.repository.js";
import { logger } from "../utils/logger.util.js";

export function useUserService() {
  const {
    getByClerkId: _getByClerkId,
    updateByClerkId: _updateByClerkId,
    softDeleteByClerkId: _softDeleteByClerkId,
    add: _add,
  } = useUserRepo();

  // Called by Clerk webhook on user.created / user.updated
  async function syncFromClerk({ clerkId, email, firstName, lastName }) {
    const existingUser = await _getByClerkId(clerkId);

    const user = existingUser
      ? await _updateByClerkId(clerkId, {
          email,
          firstName,
          lastName,
        })
      : await _add({
          clerkId,
          email,
          firstName,
          lastName,
          plan: "free",
          status: "active",
        });

    logger.log({
      level: "info",
      message: `Synced user ${clerkId} from Clerk`,
    });

    return user;
  }

  async function getMe(dbUser) {
    return {
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      plan: dbUser.plan,
    };
  }

  async function softDeleteUser(userId) {
    const user = await _softDeleteByClerkId(userId);

    if (!user) {
      logger.log({
        level: "warn",
        message: `Attempted to delete missing user ${userId}`,
      });

      return;
    }

    logger.log({
      level: "info",
      message: `User ${userId} deleted account`,
    });
  }

  return {
    syncFromClerk,
    getMe,
    softDeleteUser,
  };
}
