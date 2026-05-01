const asyncHandler = require('express-async-handler');
const service = require('../services/student.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/student.validation');

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

// ===================== HV-02: Profile =====================

const getProfile = asyncHandler(async (req, res) => {
  const result = await service.getProfile(req.user.studentId);
  return success(res, result);
});

const updateProfile = asyncHandler(async (req, res) => {
  await validateOrThrow(s.profileUpdate, req.body);
  const result = await service.updateProfile(req.user.studentId, req.body);
  return success(res, result, 'Cập nhật thông tin thành công');
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const result = await service.uploadAvatar(req.user.studentId, req.body.avatar);
  return success(res, result, 'Cập nhật ảnh đại diện thành công');
});

// ===================== HV-03: Academic Results =====================

const getAcademicResults = asyncHandler(async (req, res) => {
  const result = await service.getAcademicResults(req.user.studentId, req.query);
  return success(res, result);
});

// ===================== HV-06: TimeTable =====================

const getMyTimeTable = asyncHandler(async (req, res) => {
  const result = await service.getMyTimeTable(req.user.studentId);
  return success(res, result);
});

const createMyTimeTable = asyncHandler(async (req, res) => {
  await validateOrThrow(s.timetable, req.body);
  const result = await service.createMyTimeTable(req.user.studentId, req.body);
  return success(res, result, 'Thêm môn học thành công', 201);
});

const updateMyTimeTable = asyncHandler(async (req, res) => {
  await validateOrThrow(s.timetable, req.body);
  const result = await service.updateMyTimeTable(req.user.studentId, req.params.id, req.body);
  return success(res, result, 'Cập nhật thời khóa biểu thành công');
});

const deleteMyTimeTable = asyncHandler(async (req, res) => {
  await service.deleteMyTimeTable(req.user.studentId, req.params.id);
  return success(res, null, 'Xóa môn học thành công');
});

// ===================== HV-07: Cut Rice =====================

const getMyCutRice = asyncHandler(async (req, res) => {
  const result = await service.getMyCutRice(req.user.studentId);
  return success(res, result);
});

const updateMyCutRice = asyncHandler(async (req, res) => {
  await validateOrThrow(s.cutRice, req.body);
  const result = await service.updateMyCutRice(req.user.studentId, req.body);
  return success(res, result, 'Cập nhật lịch cắt cơm thành công');
});

// ===================== HV-08: Achievements & Tuition =====================

const getMyAchievements = asyncHandler(async (req, res) => {
  const result = await service.getMyAchievements(req.user.studentId);
  return success(res, result);
});

const getMyTuitionFees = asyncHandler(async (req, res) => {
  const result = await service.getMyTuitionFees(req.user.studentId);
  return success(res, result);
});

// ===================== HV-09: Notifications =====================

const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await service.getMyNotifications(req.user.studentId, req.query);
  return paginated(res, result.rows, result.pagination);
});

const getMyNotificationDetail = asyncHandler(async (req, res) => {
  const result = await service.getMyNotificationDetail(req.user.studentId, req.params.id);
  return success(res, result);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  await service.markNotificationRead(req.user.studentId, req.params.id);
  return success(res, null, 'Đã đánh dấu đọc');
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await service.markAllNotificationsRead(req.user.studentId);
  return success(res, null, 'Đã đánh dấu đọc tất cả');
});

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  getProfile,
  updateProfile,
  uploadAvatar,
  getAcademicResults,
  getMyTimeTable,
  createMyTimeTable,
  updateMyTimeTable,
  deleteMyTimeTable,
  getMyCutRice,
  updateMyCutRice,
  getMyAchievements,
  getMyTuitionFees,
  getMyNotifications,
  getMyNotificationDetail,
  markNotificationRead,
  markAllNotificationsRead,
};
