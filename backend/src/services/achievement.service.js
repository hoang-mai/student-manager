const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Achievement = db.achievement;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, student_id, achievement_type }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (achievement_type) where.achievement_type = achievement_type;

  const { count, rows } = await Achievement.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
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
  const achievement = await Achievement.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
  });
  if (!achievement) throw new NotFoundError('Achievement not found');
  return achievement;
};

const create = async (data, createdBy) => {
  return await Achievement.create({ ...data, created_by: createdBy });
};

const update = async (id, data) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) throw new NotFoundError('Achievement not found');
  await achievement.update(data);
  return achievement;
};

const remove = async (id) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) throw new NotFoundError('Achievement not found');
  await achievement.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
