import express from "express";
import { useWebhookController } from "../controllers/webhook.controller.js";

const router = express.Router();

export default function useWebhookRoute() {
  const { handleClerkWebhook } = useWebhookController();

  router.post(
    "/clerk",
    express.raw({ type: "application/json" }),
    handleClerkWebhook,
  );

  return router;
}
