const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      type: err.type || 'ERROR',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Token không hợp lệ', type: 'BAD_TOKEN' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Token đã hết hạn', type: 'TOKEN_EXPIRED' });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = err.errors?.map(e => e.path).join(', ') || '';
    const msg = fields ? `Dữ liệu trùng lặp: ${fields} đã tồn tại` : 'Dữ liệu trùng lặp';
    return res.status(400).json({ success: false, statusCode: 400, message: msg, type: 'DUPLICATE' });
  }

  // Sequelize foreign key
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const table = err.table || '';
    const msg = table ? `Tham chiếu không hợp lệ: bản ghi trong ${table} không tồn tại` : 'Tham chiếu không hợp lệ';
    return res.status(400).json({ success: false, statusCode: 400, message: msg, type: 'FK_ERROR' });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.errors?.map(e => e.message).join(', ') || 'Lỗi xác thực dữ liệu',
      type: 'VALIDATION',
    });
  }

  return res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi máy chủ nội bộ', type: 'SERVER_ERROR' });
};

module.exports = errorMiddleware;
