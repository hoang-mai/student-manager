const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Course = db.course;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, search }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Course.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return {
    data: rows,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getById = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) throw new NotFoundError('Course not found');
  return course;
};

const create = async (data) => {
  return await Course.create(data);
};

const update = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) throw new NotFoundError('Course not found');
  await course.update(data);
  return course;
};

const remove = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) throw new NotFoundError('Course not found');
  await course.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
