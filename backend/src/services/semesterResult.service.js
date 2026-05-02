const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const SemesterResult = db.semesterResult;

const create = async (data) => SemesterResult.create(data);
const getAll = async (query) => paginateQuery(SemesterResult, query, { filterFields: ['studentId', 'semester', 'schoolYear'] });

const getDetail = async (id) => {
  const record = await SemesterResult.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy kết quả học kỳ');
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
