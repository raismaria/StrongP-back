import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors.js";

/**
 * Global error handling middleware
 * Must be placed after all routes
 */
export function errorHandler(err, req, res, next) {
  // Operational errors (AppError instances)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      error: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default to 500 server error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * Not found middleware
 */
export function notFoundHandler(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}
