/**
 * Error Handler Middleware
 * Centralized error handling for API
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    return res.status(400).json({ error: message });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    return res.status(400).json({ error: message });
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid token`;
    return res.status(401).json({ error: message });
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = `Token has expired`;
    return res.status(401).json({ error: message });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ errors: messages });
  }

  res.status(err.statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler
};
