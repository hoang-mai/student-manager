const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Tuition = db.tuition;
const StudentProfile = db.studentProfile;
const Semester = db.semester;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, studentId, semesterId, status }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (studentId) where.studentId = studentId;
  if (semesterId) where.semesterId = semesterId;
  if (status) where.status = status;

  const { count, rows } = await Tuition.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Semester },
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
  const tuition = await Tuition.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Semester },
    ],
  });
  if (!tuition) throw new NotFoundError('Không tìm thấy học phí');
  return tuition;
};

const create = async (data) => {
  return await Tuition.create(data);
};

const update = async (id, data) => {
  const tuition = await Tuition.findByPk(id);
  if (!tuition) throw new NotFoundError('Không tìm thấy học phí');
  await tuition.update(data);
  return tuition;
};

const remove = async (id) => {
  const tuition = await Tuition.findByPk(id);
  if (!tuition) throw new NotFoundError('Không tìm thấy học phí');
  await tuition.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
