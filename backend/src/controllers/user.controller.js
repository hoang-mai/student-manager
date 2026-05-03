const asyncHandler = require('express-async-handler');
const service = require('../services/user.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/user.validation');

// ===================== CRUD Cơ bản =====================

const create = asyncHandler(async (req, res) => {
  await validateOrThrow(s.create, req.body);
  const result = await service.create(req.body);
  return success(res, result, 'Tạo mới thành công', 201);
});

const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);
  return paginated(res, result.rows, result.pagination);
});

const getDetail = asyncHandler(async (req, res) => {
  const result = await service.getDetail(req.params.id);
  return success(res, result);
});

const update = asyncHandler(async (req, res) => {
  await validateOrThrow(s.update, req.body);
  const result = await service.update(req.params.id, req.body);
  return success(res, result, 'Cập nhật thành công');
});

const deleteRecord = asyncHandler(async (req, res) => {
  await service.delete(req.params.id);
  return success(res, null, 'Xóa thành công');
});

// ===================== CH-01: Quản lý tài khoản =====================

const createBatchUsers = asyncHandler(async (req, res) => {
  const users = req.body.users || [];
  for (const u of users) {
    await validateOrThrow(s.batch, u);
  }
  const result = await service.createBatchUsers(users);
  return success(res, result, 'Tạo tài khoản hàng loạt thành công', 201);
});

const resetPassword = asyncHandler(async (req, res) => {
  await validateOrThrow(s.resetPassword, req.body);
  const result = await service.resetPassword(req.params.id, req.body.newPassword);
  return success(res, result, 'Đặt lại mật khẩu thành công');
});

const toggleActive = asyncHandler(async (req, res) => {
  const result = await service.toggleActive(req.params.id);
  const msg = result.isActive ? 'Mở khóa tài khoản thành công' : 'Khóa tài khoản thành công';
  return success(res, result, msg);
});

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  createBatchUsers,
  resetPassword,
  toggleActive,
};
