const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const SchoolYear = db.schoolYear;
const Semester = db.semester;

const normalizeSchoolYear = (schoolYear) => (schoolYear || '').trim();
const buildTermCode = (schoolYear, term) => `${schoolYear}-HK${term}`;

const resolveSchoolYear = async (data = {}) => {
  if (data.schoolYearId) {
    const record = await SchoolYear.findByPk(data.schoolYearId);
    if (!record) throw new BadRequestError('Không tìm thấy năm học');
    return record;
  }

  const schoolYear = normalizeSchoolYear(data.schoolYear);
  if (!schoolYear) throw new BadRequestError('Năm học là bắt buộc');

  const record = await SchoolYear.findOne({ where: { schoolYear } });
  if (!record) throw new BadRequestError('Chưa có năm học. Vui lòng tạo năm học trước');
  return record;
};

const attachSchoolYear = async (data) => {
  if (data.schoolYearId === null) return data;
  if (data.schoolYearId || data.schoolYear) {
    const schoolYear = await resolveSchoolYear(data);
    data.schoolYearId = schoolYear.id;
    data.schoolYear = schoolYear.schoolYear;
  }
  return data;
};

const createSchoolYear = async (data) => {
  const schoolYear = normalizeSchoolYear(data.schoolYear);
  const existed = await SchoolYear.findOne({ where: { schoolYear } });
  if (existed) throw new BadRequestError('Năm học đã tồn tại');

  return SchoolYear.create({ schoolYear });
};

const getSchoolYears = async (query = {}) => {
  const where = {};
  if (query.schoolYear) where.schoolYear = query.schoolYear;
  return paginateQuery(SchoolYear, query, { where });
};

const createTerm = async (data) => {
  const schoolYear = await resolveSchoolYear(data);
  const term = Number(data.term);
  const code = data.code || buildTermCode(schoolYear.schoolYear, term);
  const existed = await Semester.findOne({ where: { code } });
  if (existed) throw new BadRequestError(`Đã có học kỳ ${term} cho năm học ${schoolYear.schoolYear}`);

  return Semester.create({
    schoolYearId: schoolYear.id,
    schoolYear: schoolYear.schoolYear,
    code,
  });
};

const create = async (data) => {
  await attachSchoolYear(data);
  return Semester.create(data);
};

const getAll = async (query) => {
  const where = {};
  const schoolYearWhere = {};

  if (query.code) where.code = query.code;
  if (query.schoolYearId) where.schoolYearId = query.schoolYearId;
  if (query.schoolYear) {
    where.schoolYear = query.schoolYear;
    schoolYearWhere.schoolYear = query.schoolYear;
  }

  const include = [{ model: SchoolYear, as: 'schoolYearInfo' }];
  if (Object.keys(schoolYearWhere).length > 0) {
    include[0].where = schoolYearWhere;
    include[0].required = false;
  }

  return paginateQuery(Semester, query, { where, include });
};

const getDetail = async (id) => {
  const record = await Semester.findByPk(id, { include: [{ model: SchoolYear, as: 'schoolYearInfo' }] });
  if (!record) throw new NotFoundError('Không tìm thấy học kỳ');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  await attachSchoolYear(data);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  createSchoolYear,
  getSchoolYears,
  createTerm,
};
