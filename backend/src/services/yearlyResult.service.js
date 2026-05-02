const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const YearlyResult = db.yearlyResult;

const create = async (data) => YearlyResult.create(data);
const getAll = async (query) => paginateQuery(YearlyResult, query, { filterFields: ['studentId', 'schoolYear', 'academicStatus', 'partyRating', 'trainingRating'] });

const getDetail = async (id) => {
  const record = await YearlyResult.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy kết quả năm học');
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
