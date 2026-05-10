const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Organization = db.organization;
const University = db.university;

const create = async (data) => Organization.create(data);
const getAll = async (query) => paginateQuery(Organization, query, {
  filterFields: ['organizationName', 'status', 'universityId'],
  include: [{ model: University }],
});

const getDetail = async (id) => {
  const record = await Organization.findByPk(id, {
    include: [{ model: University }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy đơn vị');
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
