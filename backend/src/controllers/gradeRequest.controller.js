const asyncHandler = require('express-async-handler');
const service = require('../services/gradeRequest.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/gradeRequest.validation');

// ===================== Student =====================

const create = asyncHandler(async (req, res) => {
  await validateOrThrow(s.create, req.body);
  const r = await service.create(req.userId, req.body);
  return success(res, r, 'Gửi đề xuất thành công', 201);
});

const getMyRequests = asyncHandler(async (req, res) => {
  const r = await service.getMyRequests(req.userId, req.query);
  return success(res, r);
});

const getMyRequestDetail = asyncHandler(async (req, res) => {
  const r = await service.getMyRequestDetail(req.userId, req.params.id);
  return success(res, r);
});

// ===================== Commander =====================

const getAll = asyncHandler(async (req, res) => {
  const r = await service.getAll(req.query);
  return paginated(res, r.rows, r.pagination, r.summary);
});

const getDetail = asyncHandler(async (req, res) => {
  const r = await service.getDetail(req.params.id);
  return success(res, r);
});

const approve = asyncHandler(async (req, res) => {
  await validateOrThrow(s.approve, req.body);
  const r = await service.approve(req.params.id, req.userId, req.body.reviewNote);
  return success(res, r, 'Đề xuất đã được phê duyệt');
});

const reject = asyncHandler(async (req, res) => {
  await validateOrThrow(s.reject, req.body);
  const r = await service.reject(req.params.id, req.userId, req.body.reviewNote);
  return success(res, r, 'Đề xuất đã bị từ chối');
});

module.exports = { create, getMyRequests, getMyRequestDetail, getAll, getDetail, approve, reject };
