const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const DutyRoster = db.dutyRoster;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, user_id, duty_date, shift }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (user_id) where.user_id = user_id;
  if (duty_date) where.duty_date = duty_date;
  if (shift) where.shift = shift;

  const { count, rows } = await DutyRoster.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'full_name', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['duty_date', 'ASC'], ['shift', 'ASC']],
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
  const roster = await DutyRoster.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'full_name', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
  });
  if (!roster) throw new NotFoundError('Duty roster not found');
  return roster;
};

const create = async (data, createdBy) => {
  return await DutyRoster.create({ ...data, created_by: createdBy });
};

const update = async (id, data) => {
  const roster = await DutyRoster.findByPk(id);
  if (!roster) throw new NotFoundError('Duty roster not found');
  await roster.update(data);
  return roster;
};

const remove = async (id) => {
  const roster = await DutyRoster.findByPk(id);
  if (!roster) throw new NotFoundError('Duty roster not found');
  await roster.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
