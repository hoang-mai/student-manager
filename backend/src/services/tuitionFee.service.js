const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const TuitionFee = db.tuitionFee;
const Student = db.student;
const University = db.university;

const create = async (data) => TuitionFee.create(data);
const getAll = async (query) => {
  const where = {};
  const studentWhere = {};
  const include = [{ model: Student, include: [{ model: University }] }];

  if (query.semester) where.semester = query.semester;
  if (query.schoolYear) where.schoolYear = query.schoolYear;
  if (query.status) where.status = query.status;
  if (query.studentId) where.studentId = query.studentId;

  if (query.fullName) studentWhere.fullName = { [db.Sequelize.Op.like]: `%${query.fullName}%` };
  if (query.unit) studentWhere.unit = query.unit;

  if (Object.keys(studentWhere).length > 0) {
    include[0].where = studentWhere;
    include[0].required = true;
  }

  return paginateQuery(TuitionFee, query, { where, include });
};

const getDetail = async (id) => {
  const record = await TuitionFee.findByPk(id, {
    include: [{ model: Student }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy học phí');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };
