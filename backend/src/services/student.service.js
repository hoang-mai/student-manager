const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const StudentProfile = db.studentProfile;
const User = db.user;
const Class = db.class;
const University = db.university;
const Major = db.major;
const AcademicYear = db.academicYear;
const TrainingUnit = db.trainingUnit;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, search, class_id, status }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (class_id) where.class_id = class_id;
  if (search) {
    where[Op.or] = [
      { student_code: { [Op.iLike]: `%${search}%` } },
      { '$User.full_name$': { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await StudentProfile.findAndCountAll({
    where,
    include: [
      { model: User, attributes: ['id', 'username', 'full_name', 'email', 'phone'] },
      { model: Class, attributes: ['id', 'code', 'name'] },
      { model: University, attributes: ['id', 'name'] },
      { model: Major, attributes: ['id', 'name'] },
      { model: AcademicYear, attributes: ['id', 'name'] },
      { model: TrainingUnit, attributes: ['id', 'name'] },
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
  const profile = await StudentProfile.findByPk(id, {
    include: [
      { model: User, attributes: { exclude: ['password'] } },
      { model: Class },
      { model: University },
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit },
    ],
  });
  if (!profile) throw new NotFoundError('Student not found');
  return profile;
};

const create = async (data) => {
  return await StudentProfile.create(data);
};

const update = async (id, data) => {
  const profile = await StudentProfile.findByPk(id);
  if (!profile) throw new NotFoundError('Student not found');
  await profile.update(data);
  return profile;
};

const remove = async (id) => {
  const profile = await StudentProfile.findByPk(id);
  if (!profile) throw new NotFoundError('Student not found');
  await profile.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
