const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const MealSchedule = db.mealSchedule;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, studentId, startDate, endDate }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (studentId) where.studentId = studentId;
  if (startDate && endDate) where.scheduleDate = { [Op.between]: [startDate, endDate] };

  const { count, rows } = await MealSchedule.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['scheduleDate', 'ASC'], ['session', 'ASC']],
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
  const meal = await MealSchedule.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
    ],
  });
  if (!meal) throw new NotFoundError('Không tìm thấy lịch cắt cơm');
  return meal;
};

const create = async (data) => {
  return await MealSchedule.create(data);
};

const update = async (id, data) => {
  const meal = await MealSchedule.findByPk(id);
  if (!meal) throw new NotFoundError('Không tìm thấy lịch cắt cơm');
  await meal.update(data);
  return meal;
};

const remove = async (id) => {
  const meal = await MealSchedule.findByPk(id);
  if (!meal) throw new NotFoundError('Không tìm thấy lịch cắt cơm');
  await meal.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
