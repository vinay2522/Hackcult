// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
      return res.status(400).json({
          success: false,
          error: Object.values(err.errors).map(val => val.message)
      });
  }

  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
          success: false,
          error: 'Invalid token'
      });
  }

  res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server Error'
  });
};

module.exports = errorHandler;