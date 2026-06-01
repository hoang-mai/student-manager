const db = require('../models');
const User = db.user;
const Semester = db.semester;
const { NotFoundError, BadRequestError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');
const { findStudentUserByCode } = require('../utils/studentLookup');

const TuitionFee = db.tuitionFee;
const Student = db.profile;
const University = db.university;
const SchoolYear = db.schoolYear;

const attachSemester = async (data) => {
  if (data.semesterId === null) return data;

  let semester = null;
  if (data.semesterId) {
    semester = await Semester.findByPk(data.semesterId);
    if (!semester) throw new BadRequestError('Không tìm thấy học kỳ');
  } else if (data.semester) {
    semester = await Semester.findOne({ where: { code: data.semester } });
  }

  if (semester) {
    data.semesterId = semester.id;
    data.semester = semester.code;
    data.schoolYear = semester.schoolYear;
  }

  return data;
};

const create = async (data) => {
  await attachSemester(data);
  return TuitionFee.create(data);
};

const createBatch = async (data) => {
  const items = data.items || [];
  const results = [];

  for (const item of items) {
    const studentCode = item.studentCode;
    try {
      const { user } = await findStudentUserByCode(studentCode);
      const payload = {
        ...item,
        userId: user.id,
        semesterId: item.semesterId !== undefined ? item.semesterId : data.semesterId,
        semester: item.semester !== undefined ? item.semester : data.semester,
        schoolYear: item.schoolYear !== undefined ? item.schoolYear : data.schoolYear,
      };
      delete payload.studentCode;

      await attachSemester(payload);
      const record = await TuitionFee.create(payload);
      results.push({ studentCode, id: record.id, status: 'CREATED' });
    } catch (err) {
      results.push({ studentCode, status: 'ERROR', message: err.message });
    }
  }

  return {
    total: results.length,
    created: results.filter((item) => item.status === 'CREATED').length,
    errors: results.filter((item) => item.status === 'ERROR').length,
    results,
  };
};
const getAll = async (query) => {
  const where = {};
  const studentWhere = {};
  const semesterWhere = {};
  const include = [
    { model: User, include: [{ model: db.profile, include: [{ model: University }] }] },
    { model: Semester, as: 'semesterInfo', include: [{ model: SchoolYear, as: 'schoolYearInfo' }] },
  ];

  if (query.semesterId) where.semesterId = query.semesterId;
  if (query.semester) where.semester = query.semester;
  if (query.schoolYear) where.schoolYear = query.schoolYear;
  if (query.status) where.status = query.status;
  if (query.userId) where.userId = query.userId;

  if (query.code) studentWhere.code = query.code;
  if (query.fullName) studentWhere.fullName = { [db.Sequelize.Op.like]: `%${query.fullName}%` };
  if (query.unit) studentWhere.unit = query.unit;
  if (query.semester) semesterWhere.code = query.semester;
  if (query.schoolYear) semesterWhere.schoolYear = query.schoolYear;

  if (Object.keys(studentWhere).length > 0) {
    include[0].include[0].where = studentWhere;
    include[0].include[0].required = true;
    include[0].required = true;
  }

  if (Object.keys(semesterWhere).length > 0) {
    include[1].where = semesterWhere;
    include[1].required = true;
  }

  return paginateQuery(TuitionFee, query, { where, include });
};

const getDetail = async (id) => {
  const record = await TuitionFee.findByPk(id, {
    include: [{ model: User, include: [{ model: db.profile }] }, { model: Semester, as: 'semesterInfo', include: [{ model: SchoolYear, as: 'schoolYearInfo' }] }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy học phí');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  await attachSemester(data);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, createBatch, getAll, getDetail, update, delete: deleteRecord };
