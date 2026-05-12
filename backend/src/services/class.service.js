const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Class = db.class;
const EducationLevel = db.educationLevel;
const Organization = db.organization;
const University = db.university;
const Profile = db.profile;

const NESTED_SORT_MAP = {
  levelName: [{ model: EducationLevel }, 'levelName'],
  organizationName: [{ model: EducationLevel }, { model: Organization }, 'organizationName'],
  universityName: [{ model: EducationLevel }, { model: Organization }, { model: University }, 'universityName'],
};

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
  if (query.organizationId) {
    orgWhere.id = query.organizationId;
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

  const options = { where, include: [elInclude] };

  if (query.sortBy && NESTED_SORT_MAP[query.sortBy]) {
    const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    options.order = [[...NESTED_SORT_MAP[query.sortBy], sortOrder]];
    delete query.sortBy;
    delete query.sortOrder;
  }

  return paginateQuery(Class, query, options);
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

const getStudents = async (classId, query) => {
  const where = { classId };

  if (query.code) where.code = query.code;
  if (query.fullName) {
    where.fullName = { [db.Sequelize.Op.like]: `%${query.fullName}%` };
  }
  if (query.gender) where.gender = query.gender;
  if (query.enrollment) where.enrollment = query.enrollment;
  if (query.unit) where.unit = query.unit;
  if (query.rank) where.rank = query.rank;

  return paginateQuery(Profile, query, {
    where,
    include: [{ model: Class }, { model: Organization }, { model: University }, { model: EducationLevel }],
  });
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, getStudents, update, delete: deleteRecord };
