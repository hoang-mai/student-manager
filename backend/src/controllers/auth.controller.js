const Yup = require('yup');
const authService = require('../services/auth.service');
const { success, error, validateOrThrow } = require('../utils/response');

const login = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await authService.login(req.body.username, req.body.password);
    return success(res, result, 'Login successful');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const register = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      username: Yup.string().required().min(3),
      password: Yup.string().required().min(6),
      role: Yup.string().oneOf(['STUDENT', 'COMMANDER', 'ADMIN']),
      studentId: Yup.string().uuid(),
      commanderId: Yup.string().uuid(),
    });
    await validateOrThrow(schema, req.body);

    const result = await authService.register(req.body);
    return success(res, result, 'Account created successfully', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const refreshToken = async (req, res) => {
  try {
    const schema = Yup.object().shape({ refreshToken: Yup.string().required() });
    await validateOrThrow(schema, req.body);

    const result = await authService.refreshToken(req.body.refreshToken);
    return success(res, result, 'Token refreshed successfully');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      oldPassword: Yup.string().required(),
      newPassword: Yup.string().required().min(6),
    });
    await validateOrThrow(schema, req.body);

    await authService.changePassword(req.userId, req.body.oldPassword, req.body.newPassword);
    return success(res, null, 'Password changed successfully');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  changePassword,
};
