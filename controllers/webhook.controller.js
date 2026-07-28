import { Webhook } from "svix";
import { CLERK_WEBHOOK_SIGNING_SECRET } from "../config.js";
import { useUserService } from "../services/user.service.js";
import { logger } from "../utils/logger.util.js";

export function useWebhookController() {
  const { syncFromClerk: _syncFromClerk, softDeleteUser: _softDeleteUser } =
    useUserService();

  const handleClerkWebhook = async (req, res) => {
    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
    let event;

    try {
      event = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    } catch (error) {
      logger.log({
        level: "error",
        message: `Clerk webhook signature invalid: ${error.message}`,
      });
      return res.status(400).json({ error: "Invalid signature" });
    }

    try {
      const { type, data } = event;

      if (type === "user.created" || type === "user.updated") {
        await _syncFromClerk({
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
        });
      }

      if (type === "user.deleted") {
        await _softDeleteUser(data.id);
      }

      res.json({ received: true });
    } catch (error) {
      logger.log({
        level: "error",
        message: `Clerk webhook handler failed: ${error.message}`,
      });
      res.status(500).json({ error: "Webhook handler failed" });
    }
  };

  return { handleClerkWebhook };
}
