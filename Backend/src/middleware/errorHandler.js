const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const isServerError = err.statusCode >= 500;

    return res.status(err.statusCode).json({
      success: false,
      code: err.code || (isServerError ? "INTERNAL_SERVER_ERROR" : null),
      message: isServerError ? "Internal server error" : err.message,
      details: err.details || null,
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};

module.exports = errorHandler;
