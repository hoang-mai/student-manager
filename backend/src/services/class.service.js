const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Class = db.class;

const create = async (data) => Class.create(data);
const getAll = async (query) => paginateQuery(Class, query);

const getDetail = async (id) => {
  const record = await Class.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy lớp học');
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
