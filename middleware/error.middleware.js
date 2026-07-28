import { logger } from "../utils/logger.util.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational ?? false;

  if (!isOperational) {
    logger.log({
      level: "error",
      message: `${req.method} ${req.originalUrl} - ${err.message}`,
    });
    console.error(err);
  }

  res.status(statusCode).json({
    error: isOperational ? err.message : "Internal Server Error",
  });
}
