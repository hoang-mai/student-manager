const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const University = db.university;
const Major = db.major;
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

  const { count, rows } = await University.findAndCountAll({
    where,
    include: [{ model: Major }],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['createdAt', 'DESC']],
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
  const university = await University.findByPk(id, { include: [{ model: Major }] });
  if (!university) throw new NotFoundError('Không tìm thấy trường đại học');
  return university;
};

const create = async (data) => {
  return await University.create(data);
};

const update = async (id, data) => {
  const university = await University.findByPk(id);
  if (!university) throw new NotFoundError('Không tìm thấy trường đại học');
  await university.update(data);
  return university;
};

const remove = async (id) => {
  const university = await University.findByPk(id);
  if (!university) throw new NotFoundError('Không tìm thấy trường đại học');
  await university.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
