import express from "express";
import { useUserController } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useUserRoute() {
  const { getMe, softDeleteUser } = useUserController();

  router.get("/me", requireAuth, getMe);
  router.delete("/me", requireAuth, softDeleteUser);

  return router;
}
