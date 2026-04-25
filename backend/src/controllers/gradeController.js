const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Grade = db.grade;
const StudentProfile = db.studentProfile;
const Course = db.course;
const Semester = db.semester;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, student_id, semester_id, course_id } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (semester_id) where.semester_id = semester_id;
  if (course_id) where.course_id = course_id;

  const { count, rows } = await Grade.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const grade = await Grade.findByPk(req.params.id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
    ],
  });
  if (!grade) return success(res, null, 'Grade not found', 404);
  return success(res, grade);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().integer().required(),
    course_id: Yup.number().integer().required(),
    semester_id: Yup.number().integer().required(),
    score_10: Yup.number().min(0).max(10),
    score_4: Yup.number().min(0).max(4),
    letter_grade: Yup.string(),
    status: Yup.string().oneOf(['PASSED', 'FAILED', 'PENDING']),
  });
  await validateOrThrow(schema, req.body);

  const data = { ...req.body, created_by: req.userId };
  const grade = await Grade.create(data);
  return success(res, grade, 'Grade created', 201);
};

const update = async (req, res) => {
  const grade = await Grade.findByPk(req.params.id);
  if (!grade) return success(res, null, 'Grade not found', 404);
  await grade.update(req.body);
  return success(res, grade, 'Grade updated');
};

const remove = async (req, res) => {
  const grade = await Grade.findByPk(req.params.id);
  if (!grade) return success(res, null, 'Grade not found', 404);
  await grade.destroy();
  return success(res, null, 'Grade deleted');
};

module.exports = { getAll, getById, create, update, remove };
