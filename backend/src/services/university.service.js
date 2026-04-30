const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const University = db.university;

const create = async (data) => University.create(data);
const getAll = async () => University.findAll();

const getDetail = async (id) => {
  const record = await University.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy trường');
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
