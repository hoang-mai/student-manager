const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Class = db.class;
const Major = db.major;
const AcademicYear = db.academicYear;
const TrainingUnit = db.trainingUnit;
const User = db.user;
const StudentProfile = db.studentProfile;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, search, majorId, academicYearId }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (majorId) where.majorId = majorId;
  if (academicYearId) where.academicYearId = academicYearId;

  const { count, rows } = await Class.findAndCountAll({
    where,
    include: [
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit, attributes: ['id', 'name'] },
      { model: User, as: 'commander', attributes: ['id', 'fullName'] },
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
  const cls = await Class.findByPk(id, {
    include: [
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit, attributes: ['id', 'name'] },
      { model: User, as: 'commander', attributes: ['id', 'fullName'] },
      { model: StudentProfile, include: [{ model: User, attributes: ['fullName'] }] },
    ],
  });
  if (!cls) throw new NotFoundError('Không tìm thấy lớp học');
  return cls;
};

const create = async (data) => {
  return await Class.create(data);
};

const update = async (id, data) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new NotFoundError('Không tìm thấy lớp học');
  await cls.update(data);
  return cls;
};

const remove = async (id) => {
  const cls = await Class.findByPk(id);
  if (!cls) throw new NotFoundError('Không tìm thấy lớp học');
  await cls.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
