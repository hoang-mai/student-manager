const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const CutRice = db.cutRice;

const create = async (data) => CutRice.create(data);
const getAll = async () => CutRice.findAll();

const getDetail = async (id) => {
  const record = await CutRice.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy lịch cắt cơm');
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
