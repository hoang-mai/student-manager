const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Grade = db.grade;
const StudentProfile = db.studentProfile;
const Course = db.course;
const Semester = db.semester;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, studentId, semesterId, courseId }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (studentId) where.studentId = studentId;
  if (semesterId) where.semesterId = semesterId;
  if (courseId) where.courseId = courseId;

  const { count, rows } = await Grade.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
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
  const grade = await Grade.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
    ],
  });
  if (!grade) throw new NotFoundError('Không tìm thấy điểm số');
  return grade;
};

const create = async (data, createdBy) => {
  return await Grade.create({ ...data, createdBy });
};

const update = async (id, data) => {
  const grade = await Grade.findByPk(id);
  if (!grade) throw new NotFoundError('Không tìm thấy điểm số');
  await grade.update(data);
  return grade;
};

const remove = async (id) => {
  const grade = await Grade.findByPk(id);
  if (!grade) throw new NotFoundError('Không tìm thấy điểm số');
  await grade.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
