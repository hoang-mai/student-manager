const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Class = db.class;
const Major = db.major;
const AcademicYear = db.academicYear;
const TrainingUnit = db.trainingUnit;
const User = db.user;
const StudentProfile = db.studentProfile;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, search, major_id, academic_year_id } = req.query;
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

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const cls = await Class.findByPk(req.params.id, {
    include: [
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit, attributes: ['id', 'name'] },
      { model: User, as: 'commander', attributes: ['id', 'full_name'] },
      { model: StudentProfile, include: [{ model: User, attributes: ['full_name'] }] },
    ],
  });
  if (!cls) return success(res, null, 'Class not found', 404);
  return success(res, cls);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required(),
    major_id: Yup.number().integer().required(),
    academic_year_id: Yup.number().integer().required(),
  });
  await validateOrThrow(schema, req.body);

  const cls = await Class.create(req.body);
  return success(res, cls, 'Class created', 201);
};

const update = async (req, res) => {
  const cls = await Class.findByPk(req.params.id);
  if (!cls) return success(res, null, 'Class not found', 404);
  await cls.update(req.body);
  return success(res, cls, 'Class updated');
};

const remove = async (req, res) => {
  const cls = await Class.findByPk(req.params.id);
  if (!cls) return success(res, null, 'Class not found', 404);
  await cls.destroy();
  return success(res, null, 'Class deleted');
};

module.exports = { getAll, getById, create, update, remove };
