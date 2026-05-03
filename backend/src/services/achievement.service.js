const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Model = db.achievement;
const Student = db.student;

const create = async (data) => Model.create(data);
const getAll = async (query) => {
  const where = {};
  const studentWhere = {};
  const include = [{ model: Student }];

  if (query.studentId) where.studentId = query.studentId;
  if (query.semester) where.semester = query.semester;
  if (query.schoolYear) where.schoolYear = query.schoolYear;
  if (query.year) where.year = query.year;
  if (query.award) where.award = query.award;

  if (query.fullName) studentWhere.fullName = { [db.Sequelize.Op.like]: `%${query.fullName}%` };
  if (query.unit) studentWhere.unit = query.unit;

  if (Object.keys(studentWhere).length > 0) {
    include[0].where = studentWhere;
    include[0].required = true;
  }

  return paginateQuery(Model, query, { where, include });
};

const getDetail = async (id) => {
  const record = await Model.findByPk(id, {
    include: [{ model: Student }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy thành tích');
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
