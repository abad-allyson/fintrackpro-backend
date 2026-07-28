import { useTransactionRepo } from "../repositories/transaction.repository.js";

export function useTransactionController() {
  const {
    getAllByUserId: _getAllByUserId,
    getById: _getById,
    add: _add,
    updateById: _updateById,
    deleteById: _deleteById,
  } = useTransactionRepo();

  async function getAllByUserId(req, res, next) {
    try {
      const transactions = await _getAllByUserId({
        ...req.query,
        userId: req.dbUser._id,
      });

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  }

  async function getById(req, res, next) {
    try {
      const transaction = await _getById(req.params.id, req.dbUser._id);

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found.",
        });
      }

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    try {
      const transaction = await _add({
        ...req.body,
        userId: req.dbUser._id,
      });

      res.status(201).json({
        message: "Transaction created successfully.",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateById(req, res, next) {
    try {
      const transaction = await _updateById(
        req.params.id,
        req.dbUser._id,
        req.body,
      );

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found.",
        });
      }

      res.json({
        message: "Transaction updated successfully.",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const transaction = await _deleteById(req.params.id, req.dbUser._id);

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found.",
        });
      }

      res.json({
        message: "Transaction deleted successfully.",
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
