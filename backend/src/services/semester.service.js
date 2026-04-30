const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Semester = db.semester;

const create = async (data) => Semester.create(data);
const getAll = async () => Semester.findAll();

const getDetail = async (id) => {
  const record = await Semester.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy học kỳ');
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
