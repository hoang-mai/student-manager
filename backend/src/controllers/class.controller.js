const asyncHandler = require('express-async-handler');
const service = require('../services/class.service');
const { success, paginated, validateOrThrow } = require('../utils/response');
const s = require('../validations/class.validation');

const create = asyncHandler(async (req, res) => {
  await validateOrThrow(s.create, req.body);
  const result = await service.create(req.body);
  return success(res, result, 'Tạo mới thành công', 201);
});

const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);

  const educationLevels = [];
  const organizations = [];
  const universities = [];
  const elIds = new Set();
  const orgIds = new Set();
  const uniIds = new Set();

  const rows = result.rows.map(r => {
    const plain = r.get({ plain: true });
    const el = plain.EducationLevel;

    if (el && !elIds.has(el.id)) {
      elIds.add(el.id);
      educationLevels.push(el);
    }

    const org = el?.Organization;
    if (org && !orgIds.has(org.id)) {
      orgIds.add(org.id);
      organizations.push(org);
    }

    const uni = org?.University;
    if (uni && !uniIds.has(uni.id)) {
      uniIds.add(uni.id);
      universities.push(uni);
    }

    delete plain.EducationLevel;
    return plain;
  });

  return paginated(res, rows, result.pagination, undefined, 200, {
    educationLevels,
    organizations,
    universities,
  });
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

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };
