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
      full_name: Yup.string().required(),
      role_id: Yup.number().integer().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await userService.createUser(req.body);
    return success(res, result, 'User created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    return success(res, result, 'User updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return success(res, null, 'User deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const toggleActive = async (req, res) => {
  try {
    const result = await userService.toggleActive(req.params.id);
    return success(res, result, 'User status updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.params.id, req.body.newPassword);
    return success(res, null, 'Password reset successfully');
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
    await userService.updateMyProfile(req.userId, req.body);
    return success(res, null, 'Profile updated');
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
