import { useTransactionRepo } from "../repositories/transaction.repository.js";
import { NotFoundError } from "../utils/error.util.js";

export function useTransactionService() {
  const repo = useTransactionRepo();

  async function list(userId, filters) {
    return repo.getByUserId({ ...filters, userId });
  }

  async function getOne(id, userId) {
    const tx = await repo.getById(id, userId);
    if (!tx) throw new NotFoundError("Transaction not found");
    return tx;
  }

  async function create(userId, payload) {
    const { value } = await repo.add({ ...payload, userId });
    return value;
  }

  async function update(id, userId, payload) {
    const tx = await repo.updateById(id, userId, payload);
    if (!tx) throw new NotFoundError("Transaction not found");
    return tx;
  }

  async function remove(id, userId) {
    const result = await repo.deleteById(id, userId);
    if (result.deletedCount === 0) throw new NotFoundError("Transaction not found");
  }

  return { list, getOne, create, update, remove };
}
