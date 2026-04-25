const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Achievement = db.achievement;
const StudentProfile = db.studentProfile;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, student_id, achievement_type } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (achievement_type) where.achievement_type = achievement_type;

  const { count, rows } = await Achievement.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const achievement = await Achievement.findByPk(req.params.id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
  });
  if (!achievement) return success(res, null, 'Achievement not found', 404);
  return success(res, achievement);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().integer().required(),
    title: Yup.string().required(),
    achievement_type: Yup.string().oneOf(['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING']).required(),
  });
  await validateOrThrow(schema, req.body);

  const data = { ...req.body, created_by: req.userId };
  const achievement = await Achievement.create(data);
  return success(res, achievement, 'Achievement created', 201);
};

const update = async (req, res) => {
  const achievement = await Achievement.findByPk(req.params.id);
  if (!achievement) return success(res, null, 'Achievement not found', 404);
  await achievement.update(req.body);
  return success(res, achievement, 'Achievement updated');
};

const remove = async (req, res) => {
  const achievement = await Achievement.findByPk(req.params.id);
  if (!achievement) return success(res, null, 'Achievement not found', 404);
  await achievement.destroy();
  return success(res, null, 'Achievement deleted');
};

module.exports = { getAll, getById, create, update, remove };
