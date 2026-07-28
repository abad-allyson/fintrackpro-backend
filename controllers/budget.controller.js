import { useBudgetService } from "../services/budget.service.js";

export function useBudgetController() {
  const service = useBudgetService();

  async function list(req, res, next) {
    try {
      res.json(await service.list(req.dbUser._id));
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    try {
      const budget = await service.create(req.dbUser._id, req.body);
      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  }

  async function updateById(req, res, next) {
    try {
      res.json(await service.update(req.params.id, req.dbUser._id, req.body));
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      await service.remove(req.params.id, req.dbUser._id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return { list, add, updateById, deleteById };
}
