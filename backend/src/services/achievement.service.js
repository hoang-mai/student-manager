const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Model = db.achievement;

const create = async (data) => Model.create(data);
const getAll = async () => Model.findAll();

const getDetail = async (id) => {
  const record = await Model.findByPk(id);
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
