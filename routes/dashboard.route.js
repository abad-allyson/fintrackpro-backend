import express from "express";
import { useDashboardController } from "../controllers/dashboard.contoller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useDashboardRoute() {
  const { getMonthlySummary } = useDashboardController();

  router.get("/monthly-summary", requireAuth, getMonthlySummary);

  return router;
}
