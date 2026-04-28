const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Class = db.class;
const Major = db.major;
const AcademicYear = db.academicYear;
const TrainingUnit = db.trainingUnit;
const User = db.user;
const StudentProfile = db.studentProfile;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, search, major_id, academic_year_id }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (major_id) where.major_id = major_id;
  if (academic_year_id) where.academic_year_id = academic_year_id;

  const { count, rows } = await Class.findAndCountAll({
    where,
    include: [
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit, attributes: ['id', 'name'] },
      { model: User, as: 'commander', attributes: ['id', 'full_name'] },
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
  const cls = await Class.findByPk(id, {
    include: [
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit, attributes: ['id', 'name'] },
      { model: User, as: 'commander', attributes: ['id', 'full_name'] },
      { model: StudentProfile, include: [{ model: User, attributes: ['full_name'] }] },
    ],
  });
  if (!cls) throw new NotFoundError('Class not found');
  return cls;
};

const create = async (data) => {
  return await Class.create(data);
};

const update = async (id, data) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new NotFoundError('Class not found');
  await cls.update(data);
  return cls;
};

const remove = async (id) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new NotFoundError('Class not found');
  await cls.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
