const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const StudentProfile = db.studentProfile;
const User = db.user;
const Class = db.class;
const University = db.university;
const Major = db.major;
const AcademicYear = db.academicYear;
const TrainingUnit = db.trainingUnit;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, search, class_id, status } = req.query;
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

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const profile = await StudentProfile.findByPk(req.params.id, {
    include: [
      { model: User, attributes: { exclude: ['password'] } },
      { model: Class },
      { model: University },
      { model: Major },
      { model: AcademicYear },
      { model: TrainingUnit },
    ],
  });
  if (!profile) return success(res, null, 'Student not found', 404);
  return success(res, profile);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    user_id: Yup.number().integer().required(),
    student_code: Yup.string().required(),
    class_id: Yup.number().integer().required(),
  });
  await validateOrThrow(schema, req.body);

  const profile = await StudentProfile.create(req.body);
  return success(res, profile, 'Student profile created', 201);
};

const update = async (req, res) => {
  const profile = await StudentProfile.findByPk(req.params.id);
  if (!profile) return success(res, null, 'Student not found', 404);
  await profile.update(req.body);
  return success(res, profile, 'Student profile updated');
};

const remove = async (req, res) => {
  const profile = await StudentProfile.findByPk(req.params.id);
  if (!profile) return success(res, null, 'Student not found', 404);
  await profile.destroy();
  return success(res, null, 'Student profile deleted');
};

module.exports = { getAll, getById, create, update, remove };
