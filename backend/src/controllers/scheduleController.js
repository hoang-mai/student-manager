const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Schedule = db.schedule;
const Class = db.class;
const Course = db.course;
const Semester = db.semester;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, class_id, student_id, semester_id } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (class_id) where.class_id = class_id;
  if (student_id) where.student_id = student_id;
  if (semester_id) where.semester_id = semester_id;

  const { count, rows } = await Schedule.findAndCountAll({
    where,
    include: [
      { model: Class },
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['day_of_week', 'ASC'], ['start_time', 'ASC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id, {
    include: [
      { model: Class },
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
    ],
  });
  if (!schedule) return success(res, null, 'Schedule not found', 404);
  return success(res, schedule);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    course_id: Yup.number().integer().required(),
    semester_id: Yup.number().integer().required(),
    day_of_week: Yup.number().integer().min(0).max(6).required(),
    start_time: Yup.string().required(),
    end_time: Yup.string().required(),
  });
  await validateOrThrow(schema, req.body);

  const schedule = await Schedule.create(req.body);
  return success(res, schedule, 'Schedule created', 201);
};

const update = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) return success(res, null, 'Schedule not found', 404);
  await schedule.update(req.body);
  return success(res, schedule, 'Schedule updated');
};

const remove = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) return success(res, null, 'Schedule not found', 404);
  await schedule.destroy();
  return success(res, null, 'Schedule deleted');
};

module.exports = { getAll, getById, create, update, remove };
