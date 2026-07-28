import express from "express";
import { useTransactionController } from "../controllers/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useTransactionRoute() {
  const { getAllByUserId, getById, add, updateById, deleteById } =
    useTransactionController();

  router.get("/", requireAuth, getAllByUserId);
  router.get("/:id", requireAuth, getById);
  router.post("/", requireAuth, add);
  router.patch("/:id", requireAuth, updateById);
  router.delete("/:id", requireAuth, deleteById);

  return router;
}
