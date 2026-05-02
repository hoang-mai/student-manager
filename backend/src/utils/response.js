const { ValidationError } = require('../utils/apiError');
const { serialize } = require('./serialize');

const success = (res, data = null, message = 'Thành công', statusCode = 200) => {
  const body = { success: true, statusCode, message };
  if (data !== null && data !== undefined) body.data = serialize(data);
  return res.status(statusCode).json(body);
};

const paginated = (res, data, pagination, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: serialize(data),
    pagination,
  });
};

const fail = (res, message = 'Lỗi máy chủ nội bộ', statusCode = 500, type) => {
  const body = { success: false, statusCode, message };
  if (type) body.type = type;
  return res.status(statusCode).json(body);
};

const validateOrThrow = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    throw new ValidationError(err.errors);
  }
};

const paginateQuery = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;

  // --- Filter ---
  const where = { ...(options.where || {}) };
  const filterFields = (options.filterFields || []).concat(options.filters || []);
  for (const field of filterFields) {
    if (query[field] !== undefined) {
      where[field] = query[field];
    }
  }

  // --- Sort --- (mặc định: createdAt DESC, hệ thống tự xử lý)
  let order = options.order || [['createdAt', 'DESC']];
  if (query.sortBy) {
    const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    order = [[query.sortBy, sortOrder]];
  }

  const { count, rows } = await model.findAndCountAll({ ...options, where, order, offset, limit });
  delete options.where;
  delete options.filterFields;
  delete options.filters;

  return {
    rows,
    pagination: { pageIndex: page, pageSize: limit, totalPages: Math.ceil(count / limit), total: count },
  };
};

module.exports = { success, paginated, fail, validateOrThrow, paginateQuery };
