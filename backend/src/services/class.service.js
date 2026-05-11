const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Class = db.class;
const EducationLevel = db.educationLevel;
const Organization = db.organization;
const University = db.university;

const create = async (data) => Class.create(data);
const getAll = async (query) => {
  const where = {};
  const elWhere = {};
  const orgWhere = {};
  const uniWhere = {};

  if (query.className) {
    where.className = { [db.Sequelize.Op.like]: `%${query.className}%` };
  }
  if (query.educationLevelId) {
    where.educationLevelId = query.educationLevelId;
  }
  if (query.levelName) {
    elWhere.levelName = { [db.Sequelize.Op.like]: `%${query.levelName}%` };
  }
  if (query.organizationName) {
    orgWhere.organizationName = { [db.Sequelize.Op.like]: `%${query.organizationName}%` };
  }
  if (query.universityName) {
    uniWhere.universityName = { [db.Sequelize.Op.like]: `%${query.universityName}%` };
  }
  if (query.universityId) {
    uniWhere.id = query.universityId;
  }

  const hasNestedFilter = Object.keys(elWhere).length > 0 || Object.keys(orgWhere).length > 0 || Object.keys(uniWhere).length > 0;

  const uniInclude = { model: University };
  if (Object.keys(uniWhere).length > 0) {
    uniInclude.where = uniWhere;
    uniInclude.required = true;
  }

  const orgInclude = { model: Organization, include: [uniInclude] };
  if (Object.keys(orgWhere).length > 0) {
    orgInclude.where = orgWhere;
    orgInclude.required = true;
  }

  const elInclude = { model: EducationLevel, include: [orgInclude] };
  if (Object.keys(elWhere).length > 0) {
    elInclude.where = elWhere;
    elInclude.required = true;
  }

  if (hasNestedFilter) {
    elInclude.required = true;
    orgInclude.required = true;
  }

  return paginateQuery(Class, query, { where, include: [elInclude] });
};

const getDetail = async (id) => {
  const record = await Class.findByPk(id, {
    include: [{ model: EducationLevel }],
  });
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
