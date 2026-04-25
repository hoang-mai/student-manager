const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const University = db.university;
const Major = db.major;
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

  const { count, rows } = await University.findAndCountAll({
    where,
    include: [{ model: Major }],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const university = await University.findByPk(req.params.id, { include: [{ model: Major }] });
  if (!university) return success(res, null, 'University not found', 404);
  return success(res, university);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required(),
  });
  await validateOrThrow(schema, req.body);

  const university = await University.create(req.body);
  return success(res, university, 'University created', 201);
};

const update = async (req, res) => {
  const university = await University.findByPk(req.params.id);
  if (!university) return success(res, null, 'University not found', 404);
  await university.update(req.body);
  return success(res, university, 'University updated');
};

const remove = async (req, res) => {
  const university = await University.findByPk(req.params.id);
  if (!university) return success(res, null, 'University not found', 404);
  await university.destroy();
  return success(res, null, 'University deleted');
};

module.exports = { getAll, getById, create, update, remove };
