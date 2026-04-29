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
    return success(res, result, 'Thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const register = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      username: Yup.string().required().min(3),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      fullName: Yup.string().required(),
      phone: Yup.string(),
      roleId: Yup.number().integer(),
    });
    await validateOrThrow(schema, req.body);

    const result = await authService.register(req.body);
    return success(res, result, 'Tạo tài khoản thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const refreshToken = async (req, res) => {
  try {
    const schema = Yup.object().shape({ refreshToken: Yup.string().required() });
    await validateOrThrow(schema, req.body);

    const result = await authService.refreshToken(req.body.refreshToken);
    return success(res, result, 'Thành công');
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
    return success(res, null, 'Đổi mật khẩu thành công');
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
