const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const SubjectResult = db.subjectResult;

const create = async (data) => SubjectResult.create(data);
const getAll = async () => SubjectResult.findAll();

const getDetail = async (id) => {
  const record = await SubjectResult.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy kết quả môn học');
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
