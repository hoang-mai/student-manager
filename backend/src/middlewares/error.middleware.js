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
      message: err.name === 'TokenExpiredError' ? 'Token đã hết hạn' : 'Token không hợp lệ',
      type: 'BAD_TOKEN',
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      statusCode: 400,
      message: err.errors?.map(e => e.message).join(', ') || 'Dữ liệu trùng lặp',
    });
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      statusCode: 400,
      message: 'Tham chiếu không hợp lệ: bản ghi liên quan không tồn tại',
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      statusCode: 400,
      message: err.errors?.map(e => e.message).join(', ') || 'Lỗi xác thực dữ liệu',
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: 'Lỗi máy chủ nội bộ',
  });
};

module.exports = errorMiddleware;
