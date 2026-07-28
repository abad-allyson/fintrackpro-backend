import { useUserService } from "../services/user.service.js";

export function useUserController() {
  const { getMe: _getMe, softDeleteUser: _softDeleteUser } = useUserService();

  async function getMe(req, res, next) {
    try {
      res.json(await _getMe(req.dbUser));
    } catch (error) {
      next(error);
    }
  }

  async function softDeleteUser(req, res, next) {
    try {
      await _softDeleteUser(req.dbUser.clerkId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return { getMe, softDeleteUser };
}
