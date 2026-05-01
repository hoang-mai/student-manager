const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const TuitionFee = db.tuitionFee;

const create = async (data) => TuitionFee.create(data);
const getAll = async (query) => paginateQuery(TuitionFee, query);

const getDetail = async (id) => {
  const record = await TuitionFee.findByPk(id);
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
