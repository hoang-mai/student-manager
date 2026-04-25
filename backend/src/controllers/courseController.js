const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Course = db.course;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
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

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return success(res, null, 'Course not found', 404);
  return success(res, course);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required(),
    credits: Yup.number().integer().min(0),
  });
  await validateOrThrow(schema, req.body);

  const course = await Course.create(req.body);
  return success(res, course, 'Course created', 201);
};

const update = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return success(res, null, 'Course not found', 404);
  await course.update(req.body);
  return success(res, course, 'Course updated');
};

const remove = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return success(res, null, 'Course not found', 404);
  await course.destroy();
  return success(res, null, 'Course deleted');
};

module.exports = { getAll, getById, create, update, remove };
