const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const University = db.university;
const Organization = db.organization;
const EducationLevel = db.educationLevel;
const Class = db.class;

const create = async (data) => University.create(data);
const getAll = async (query) => paginateQuery(University, query, {
  filterFields: ['universityCode', 'universityName', 'status'],
  include: [
    {
      model: Organization,
      include: [{ model: EducationLevel, include: [Class] }],
    },
  ],
});

const getDetail = async (id) => {
  const record = await University.findByPk(id, {
    include: [
      {
        model: Organization,
        include: [
          {
            model: EducationLevel,
            include: [Class],
          },
        ],
      },
    ],
  });
  if (!record) throw new NotFoundError('Không tìm thấy trường');
  return record;
};

const getHierarchy = async () => {
  return University.findAll({
    include: [
      {
        model: Organization,
        include: [
          {
            model: EducationLevel,
            include: [Class],
          },
        ],
      },
    ],
    order: [['universityName', 'ASC']],
  });
};

const update = async (id, data) => {
  const record = await getDetail(id);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await University.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy trường');
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, getHierarchy, update, delete: deleteRecord };
