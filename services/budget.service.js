import { useBudgetRepo } from "../repositories/budget.repository.js";
import { NotFoundError } from "../utils/error.util.js";

export function useBudgetService() {
  const repo = useBudgetRepo();

  async function list(userId) {
    return repo.getByUserId(userId);
  }

  async function create(userId, payload) {
    const { value } = await repo.add({ ...payload, userId: String(userId) });
    return value;
  }

  async function update(id, userId, payload) {
    const budget = await repo.updateById(id, userId, payload);
    if (!budget) throw new NotFoundError("Budget not found");
    return budget;
  }

  async function remove(id, userId) {
    const result = await repo.deleteById(id, userId);
    if (result.deletedCount === 0) throw new NotFoundError("Budget not found");
  }

  return { list, create, update, remove };
}
