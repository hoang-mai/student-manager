const { ValidationError, UnauthorizedError } = require('../utils/apiError');

const success = (res, data = null, message = 'OK', statusCode = 200) => {
  const response = { statusCode, message };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const paginated = (res, data, pagination, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
    pagination,
  });
};

const error = (res, message = 'Internal Server Error', statusCode = 500) => {
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
