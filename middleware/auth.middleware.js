import { getAuth } from "@clerk/express";
import { useUserRepo } from "../repositories/user.repository.js";
import { logger } from "../utils/logger.util.js";

export async function requireAuth(req, res, next) {
  const { isAuthenticated, userId: clerkId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { getByClerkId } = useUserRepo();

    const user = await getByClerkId(clerkId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Auth lookup failed: ${error.message}`,
    });

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
