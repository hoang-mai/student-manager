const { ValidationError, UnauthorizedError } = require('../utils/apiError');
const { serialize } = require('./serialize');

const success = (res, data = null, message = 'Thành công', statusCode = 200) => {
  const response = { statusCode, message };
  if (data !== null && data !== undefined) {
    response.data = serialize(data);
  }
  return res.status(statusCode).json(response);
};

const paginated = (res, data, pagination, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data: serialize(data),
    pagination,
  });
};

const error = (res, message = 'Lỗi máy chủ nội bộ', statusCode = 500) => {
  return res.status(statusCode).json({
    statusCode,
    message,
  });
};

const validateOrThrow = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    throw new ValidationError(err.errors);
  }
};

module.exports = {
  success,
  paginated,
  error,
  validateOrThrow,
};
