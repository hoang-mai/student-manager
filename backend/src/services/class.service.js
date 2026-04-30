const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Class = db.class;

const create = async (data) => {
  return Class.create(data);
};

const getAll = async () => {
  return Class.findAll();
};

const getDetail = async (id) => {
  const record = await Class.findByPk(id);
  if (!record) throw new NotFoundError('Record not found');
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
