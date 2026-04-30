const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const TimeTable = db.timeTable;

const create = async (data) => TimeTable.create(data);
const getAll = async () => TimeTable.findAll();

const getDetail = async (id) => {
  const record = await TimeTable.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy thời khóa biểu');
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
