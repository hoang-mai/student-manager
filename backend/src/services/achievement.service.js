const db = require('../models');
const User = db.user;
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');
const { findStudentUserByCode } = require('../utils/studentLookup');

const Model = db.achievement;
const Student = db.profile;

const create = async (data) => Model.create(data);

const createBatch = async (data) => {
  const items = data.items || [];
  const results = [];

  for (const item of items) {
    const studentCode = item.studentCode;
    try {
      const { user } = await findStudentUserByCode(studentCode);
      const payload = { ...item, userId: user.id };
      delete payload.studentCode;

      const record = await Model.create(payload);
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
  const include = [
    {
      model: User,
      include: [{ model: Student }],
    },
  ];

  if (query.userId) where.userId = query.userId;
  if (query.semester) where.semester = { [db.Sequelize.Op.iLike]: `%${query.semester}%` };
  if (query.schoolYear) where.schoolYear = { [db.Sequelize.Op.iLike]: `%${query.schoolYear}%` };
  if (query.year) where.year = query.year;
  if (query.award) where.award = { [db.Sequelize.Op.iLike]: `%${query.award}%` };

  if (query.fullName) studentWhere.fullName = { [db.Sequelize.Op.iLike]: `%${query.fullName}%` };
  if (query.unit) studentWhere.unit = query.unit;

  if (Object.keys(studentWhere).length > 0) {
    include[0].include[0].where = studentWhere;
    include[0].include[0].required = true;
    include[0].required = true;
  }

  return paginateQuery(Model, query, { where, include });
};

const getDetail = async (id) => {
  const record = await Model.findByPk(id, {
    include: [{
      model: User,
      include: [{ model: Student }],
    }],
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

module.exports = { create, createBatch, getAll, getDetail, update, delete: deleteRecord };
