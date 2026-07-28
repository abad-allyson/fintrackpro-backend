import express from "express";
import { useBudgetController } from "../controllers/budget.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useBudgetRoute() {
  const { getAllByUserId, getById, add, updateById, deleteById } =
    useBudgetController();

  router.get("/", requireAuth, getAllByUserId);
  router.get("/:id", requireAuth, getById);
  router.post("/", requireAuth, add);
  router.patch("/:id", requireAuth, updateById);
  router.delete("/:id", requireAuth, deleteById);

  return router;
}
