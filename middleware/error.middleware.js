import mongoose from "mongoose";
import { logger } from "../utils/logger.util.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    return res.status(400).json({
      error: message,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: "Invalid ID.",
    });
  }

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
