// middleware/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'INTERNAL_ERROR';

  // Handle Mongoose Validation Error (enum mismatch, missing required fields, minlength, etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = `Invalid format for field ${err.path}: '${err.value}'`;
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY';
    message = 'A record with this value already exists';
  }

  console.error(`🔥 [ERROR] ${statusCode}: ${message}`);
  if (err.stack && statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'API_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };