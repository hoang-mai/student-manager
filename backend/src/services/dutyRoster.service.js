const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const DutyRoster = db.dutyRoster;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, userId, dutyDate, shift }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (userId) where.userId = userId;
  if (dutyDate) where.dutyDate = dutyDate;
  if (shift) where.shift = shift;

  const { count, rows } = await DutyRoster.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'fullName'] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['dutyDate', 'ASC'], ['shift', 'ASC']],
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
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'fullName'] },
    ],
  });
  if (!roster) throw new NotFoundError('Không tìm thấy lịch trực');
  return roster;
};

const create = async (data, createdBy) => {
  return await DutyRoster.create({ ...data, createdBy });
};

const update = async (id, data) => {
  const roster = await DutyRoster.findByPk(id);
  if (!roster) throw new NotFoundError('Không tìm thấy lịch trực');
  await roster.update(data);
  return roster;
};

const remove = async (id) => {
  const roster = await DutyRoster.findByPk(id);
  if (!roster) throw new NotFoundError('Không tìm thấy lịch trực');
  await roster.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
