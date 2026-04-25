const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Tuition = db.tuition;
const StudentProfile = db.studentProfile;
const Semester = db.semester;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, student_id, semester_id, status } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (semester_id) where.semester_id = semester_id;
  if (status) where.status = status;

  const { count, rows } = await Tuition.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Semester },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const tuition = await Tuition.findByPk(req.params.id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Semester },
    ],
  });
  if (!tuition) return success(res, null, 'Tuition not found', 404);
  return success(res, tuition);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().integer().required(),
    semester_id: Yup.number().integer().required(),
    amount: Yup.number().positive().required(),
    due_date: Yup.date().required(),
  });
  await validateOrThrow(schema, req.body);

  const tuition = await Tuition.create(req.body);
  return success(res, tuition, 'Tuition created', 201);
};

const update = async (req, res) => {
  const tuition = await Tuition.findByPk(req.params.id);
  if (!tuition) return success(res, null, 'Tuition not found', 404);
  await tuition.update(req.body);
  return success(res, tuition, 'Tuition updated');
};

const remove = async (req, res) => {
  const tuition = await Tuition.findByPk(req.params.id);
  if (!tuition) return success(res, null, 'Tuition not found', 404);
  await tuition.destroy();
  return success(res, null, 'Tuition deleted');
};

module.exports = { getAll, getById, create, update, remove };
