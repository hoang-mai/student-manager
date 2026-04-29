const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Achievement = db.achievement;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, studentId, achievementType }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (studentId) where.studentId = studentId;
  if (achievementType) where.achievementType = achievementType;

  const { count, rows } = await Achievement.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: User, as: 'creator', attributes: ['id', 'fullName'] },
    ],
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
  const achievement = await Achievement.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: User, as: 'creator', attributes: ['id', 'fullName'] },
    ],
  });
  if (!achievement) throw new NotFoundError('Không tìm thấy thành tích');
  return achievement;
};

const create = async (data, createdBy) => {
  return await Achievement.create({ ...data, createdBy });
};

const update = async (id, data) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) throw new NotFoundError('Không tìm thấy thành tích');
  await achievement.update(data);
  return achievement;
};

const remove = async (id) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) throw new NotFoundError('Không tìm thấy thành tích');
  await achievement.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
