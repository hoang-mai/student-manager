const asyncHandler = require('express-async-handler');
const service = require('../services/cutRice.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/cutRice.validation');

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

const importExcel = asyncHandler(async (req, res) => {
  const result = await service.importExcel(req.file);
  return success(res, result, 'Nhập lịch cắt cơm từ Excel thành công', 201);
});

const downloadTemplate = asyncHandler(async (req, res) => {
  const buffer = await service.createImportTemplate();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=mau-nhap-lich-cat-com.xlsx');
  return res.send(buffer);
});

const exportCutRice = asyncHandler(async (req, res) => {
  const buffer = await service.exportCutRice(req.query);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=lich-cat-com.xlsx');
  res.send(buffer);
});

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  importExcel,
  downloadTemplate,
  exportCutRice,
};
