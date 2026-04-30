const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const SemesterResult = db.semesterResult;

const create = async (data) => {
  return SemesterResult.create(data);
};

const getAll = async () => {
  return SemesterResult.findAll();
};

const getDetail = async (id) => {
  const record = await SemesterResult.findByPk(id);
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
