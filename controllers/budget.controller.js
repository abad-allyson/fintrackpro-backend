import { useBudgetRepo } from "../repositories/budget.repository.js";
import { useBudgetService } from "../services/budget.service.js";

export function useBudgetController() {
  const {
    getAllByUserId: _getAllByUserId,
    getById: _getById,
    updateById: _updateById,
    deleteById: _deleteById,
  } = useBudgetRepo();

  const { add: _add } = useBudgetService();

  async function getAllByUserId(req, res, next) {
    try {
      const budgets = await _getAllByUserId({
        ...req.query,
        userId: req.dbUser._id,
      });
      res.json(budgets);
    } catch (error) {
      next(error);
    }
  }

  async function getById(req, res, next) {
    try {
      const budget = await _getById(req.params.id, req.dbUser._id);

      if (!budget) {
        return res.status(404).json({
          message: "Budget not found.",
        });
      }

      res.json(budget);
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    try {
      const budget = await _add({
        ...req.body,
        userId: req.dbUser._id,
      });

      res.status(201).json({
        message: "Budget created successfully.",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateById(req, res, next) {
    try {
      const budget = await _updateById(req.params.id, req.dbUser._id, req.body);

      if (!budget) {
        return res.status(404).json({
          message: "Budget not found.",
        });
      }

      res.json({
        message: "Budget updated successfully.",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const budget = await _deleteById(req.params.id, req.dbUser._id);

      if (!budget) {
        return res.status(404).json({
          message: "Budget not found.",
        });
      }

      res.json({
        message: "Budget deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    getAllByUserId,
    getById,
    add,
    updateById,
    deleteById,
  };
}
