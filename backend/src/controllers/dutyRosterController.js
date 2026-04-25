const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const DutyRoster = db.dutyRoster;
const User = db.user;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, user_id, duty_date, shift } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (user_id) where.user_id = user_id;
  if (duty_date) where.duty_date = duty_date;
  if (shift) where.shift = shift;

  const { count, rows } = await DutyRoster.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'full_name', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['duty_date', 'ASC'], ['shift', 'ASC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const roster = await DutyRoster.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'full_name', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'full_name'] },
    ],
  });
  if (!roster) return success(res, null, 'Duty roster not found', 404);
  return success(res, roster);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    user_id: Yup.number().integer().required(),
    duty_date: Yup.date().required(),
    shift: Yup.string().oneOf(['MORNING', 'AFTERNOON', 'NIGHT', 'FULL']).required(),
  });
  await validateOrThrow(schema, req.body);

  const data = { ...req.body, created_by: req.userId };
  const roster = await DutyRoster.create(data);
  return success(res, roster, 'Duty roster created', 201);
};

const update = async (req, res) => {
  const roster = await DutyRoster.findByPk(req.params.id);
  if (!roster) return success(res, null, 'Duty roster not found', 404);
  await roster.update(req.body);
  return success(res, roster, 'Duty roster updated');
};

const remove = async (req, res) => {
  const roster = await DutyRoster.findByPk(req.params.id);
  if (!roster) return success(res, null, 'Duty roster not found', 404);
  await roster.destroy();
  return success(res, null, 'Duty roster deleted');
};

module.exports = { getAll, getById, create, update, remove };
