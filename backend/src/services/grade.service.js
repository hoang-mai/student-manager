const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Grade = db.grade;
const StudentProfile = db.studentProfile;
const Course = db.course;
const Semester = db.semester;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, student_id, semester_id, course_id }) => {
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
  const grade = await Grade.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
    ],
  });
  if (!grade) throw new NotFoundError('Grade not found');
  return grade;
};

const create = async (data, createdBy) => {
  return await Grade.create({ ...data, created_by: createdBy });
};

const update = async (id, data) => {
  const grade = await Grade.findByPk(id);
  if (!grade) throw new NotFoundError('Grade not found');
  await grade.update(data);
  return grade;
};

const remove = async (id) => {
  const grade = await Grade.findByPk(id);
  if (!grade) throw new NotFoundError('Grade not found');
  await grade.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
