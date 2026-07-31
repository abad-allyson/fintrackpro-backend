import { useDashboardService } from "../services/dashboard.service.js";

export function useDashboardController() {
  const { getMonthlySummary: _getMonthlySummary } = useDashboardService();

  async function getMonthlySummary(req, res, next) {
    try {
      const summary = await _getMonthlySummary(req.dbUser._id);

      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
  return { getMonthlySummary };
}
