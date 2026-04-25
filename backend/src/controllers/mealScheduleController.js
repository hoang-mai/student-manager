const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const MealSchedule = db.mealSchedule;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, student_id, start_date, end_date } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (start_date && end_date) where.schedule_date = { [Op.between]: [start_date, end_date] };

  const { count, rows } = await MealSchedule.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['schedule_date', 'ASC'], ['session', 'ASC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const meal = await MealSchedule.findByPk(req.params.id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
    ],
  });
  if (!meal) return success(res, null, 'Meal schedule not found', 404);
  return success(res, meal);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().integer().required(),
    schedule_date: Yup.date().required(),
    session: Yup.string().oneOf(['MORNING', 'NOON', 'AFTERNOON', 'EVENING']).required(),
  });
  await validateOrThrow(schema, req.body);

  const meal = await MealSchedule.create(req.body);
  return success(res, meal, 'Meal schedule created', 201);
};

const update = async (req, res) => {
  const meal = await MealSchedule.findByPk(req.params.id);
  if (!meal) return success(res, null, 'Meal schedule not found', 404);
  await meal.update(req.body);
  return success(res, meal, 'Meal schedule updated');
};

const remove = async (req, res) => {
  const meal = await MealSchedule.findByPk(req.params.id);
  if (!meal) return success(res, null, 'Meal schedule not found', 404);
  await meal.destroy();
  return success(res, null, 'Meal schedule deleted');
};

module.exports = { getAll, getById, create, update, remove };
