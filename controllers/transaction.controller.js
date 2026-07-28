import { useTransactionService } from "../services/transaction.service.js";

export function useTransactionController() {
  const service = useTransactionService();

  async function list(req, res, next) {
    try {
      res.json(await service.list(req.dbUser._id, req.query));
    } catch (error) {
      next(error);
    }
  }

  async function getById(req, res, next) {
    try {
      res.json(await service.getOne(req.params.id, req.dbUser._id));
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    try {
      const tx = await service.create(req.dbUser._id, req.body);
      res.status(201).json(tx);
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

  return { list, getById, add, updateById, deleteById };
}
