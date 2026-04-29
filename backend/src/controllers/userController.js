const Yup = require('yup');
const userService = require('../services/user.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const createUser = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      username: Yup.string().required().min(3),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      fullName: Yup.string().required(),
      roleId: Yup.number().integer().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await userService.createUser(req.body);
    return success(res, result, 'Tạo người dùng thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    return success(res, result, 'Cập nhật người dùng thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return success(res, null, 'Xóa người dùng thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const toggleActive = async (req, res) => {
  try {
    const result = await userService.toggleActive(req.params.id);
    return success(res, result, 'Trạng thái người dùng đã được cập nhật');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.params.id, req.body.newPassword);
    return success(res, null, 'Đặt lại mật khẩu thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getMyProfile = async (req, res) => {
  try {
    const result = await userService.getMyProfile(req.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const result = await userService.updateMyProfile(req.userId, req.body);
    return success(res, result, 'Cập nhật hồ sơ thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleActive,
  resetPassword,
  getMyProfile,
  updateMyProfile,
};
