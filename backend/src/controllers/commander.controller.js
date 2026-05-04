const asyncHandler = require('express-async-handler');
const service = require('../services/commander.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/commander.validation');

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

// ===================== CH-06: Tự động sinh lịch cắt cơm =====================

const generateCutRice = asyncHandler(async (req, res) => {
  const result = await service.generateCutRice(req.params.userId);
  return success(res, result, 'Tạo lịch cắt cơm tự động thành công');
});

const generateAllCutRice = asyncHandler(async (req, res) => {
  const result = await service.generateAllCutRice();
  return success(res, result, 'Tạo lịch cắt cơm hàng loạt thành công');
});

// ===================== CH-09: Báo cáo thống kê =====================

const getAcademicReport = asyncHandler(async (req, res) => {
  const result = await service.getAcademicReport(req.query);
  return success(res, result);
});

const getPartyTrainingReport = asyncHandler(async (req, res) => {
  const result = await service.getPartyTrainingReport(req.query);
  return success(res, result);
});

const getAchievementReport = asyncHandler(async (req, res) => {
  const result = await service.getAchievementReport();
  return success(res, result);
});

const getTuitionReport = asyncHandler(async (req, res) => {
  const result = await service.getTuitionReport(req.query);
  return success(res, result);
});

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  generateCutRice,
  generateAllCutRice,
  getAcademicReport,
  getPartyTrainingReport,
  getAchievementReport,
  getTuitionReport,
};
