const asyncHandler = require('express-async-handler');
const Yup = require('yup');
const authService = require('../services/auth.service');
const { success, validateOrThrow } = require('../utils/response');

const login = asyncHandler(async (req, res) => {
  const schema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
  });
  await validateOrThrow(schema, req.body);

  const result = await authService.login(req.body.username, req.body.password);
  return success(res, result, 'Đăng nhập thành công');
});

const register = asyncHandler(async (req, res) => {
  const schema = Yup.object().shape({
    username: Yup.string().required().min(3, 'Tên đăng nhập tối thiểu 3 ký tự'),
    password: Yup.string().required().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    role: Yup.string().oneOf(['STUDENT', 'COMMANDER', 'ADMIN']),
    studentId: Yup.string().uuid().nullable(),
    commanderId: Yup.string().uuid().nullable(),
  });
  await validateOrThrow(schema, req.body);

  const result = await authService.register(req.body);
  return success(res, result, 'Tạo tài khoản thành công', 201);
});

const refreshToken = asyncHandler(async (req, res) => {
  const schema = Yup.object().shape({
    refreshToken: Yup.string().required('Refresh token là bắt buộc'),
  });
  await validateOrThrow(schema, req.body);

  const result = await authService.refreshToken(req.body.refreshToken);
  return success(res, result, 'Làm mới token thành công');
});

const changePassword = asyncHandler(async (req, res) => {
  const schema = Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu cũ là bắt buộc'),
    newPassword: Yup.string().required().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
  });
  await validateOrThrow(schema, req.body);

  await authService.changePassword(req.userId, req.body.oldPassword, req.body.newPassword);
  return success(res, null, 'Đổi mật khẩu thành công');
});

module.exports = {
  login,
  register,
  refreshToken,
  changePassword,
};
