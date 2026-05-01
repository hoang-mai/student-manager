const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const YearlyAchievement = db.yearlyAchievement;

const create = async (data) => YearlyAchievement.create(data);
const getAll = async (query) => paginateQuery(YearlyAchievement, query);

const getDetail = async (id) => {
  const record = await YearlyAchievement.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy thành tích năm');
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
