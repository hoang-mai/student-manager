const { InternalServerError } = require('../utils/apiError');

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      type: err.type || 'ERROR',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      statusCode: 401,
      message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Token is not valid',
      type: 'BAD_TOKEN',
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      statusCode: 400,
      message: err.errors?.map(e => e.message).join(', ') || 'Duplicate entry',
    });
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid reference: related record does not exist',
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      statusCode: 400,
      message: err.errors?.map(e => e.message).join(', ') || 'Validation error',
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  });
};

module.exports = errorMiddleware;
