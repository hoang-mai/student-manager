const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Schedule = db.schedule;
const Class = db.class;
const Course = db.course;
const Semester = db.semester;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, classId, studentId, semesterId }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (classId) where.classId = classId;
  if (studentId) where.studentId = studentId;
  if (semesterId) where.semesterId = semesterId;

  const { count, rows } = await Schedule.findAndCountAll({
    where,
    include: [
      { model: Class },
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
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
  const schedule = await Schedule.findByPk(id, {
    include: [
      { model: Class },
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
    ],
  });
  if (!schedule) throw new NotFoundError('Không tìm thấy lịch học');
  return schedule;
};

const create = async (data) => {
  return await Schedule.create(data);
};

const update = async (id, data) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new NotFoundError('Không tìm thấy lịch học');
  await schedule.update(data);
  return schedule;
};

const remove = async (id) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new NotFoundError('Không tìm thấy lịch học');
  await schedule.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
