const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const Semester = db.semester;
const AcademicYear = db.academicYear;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, academic_year_id, is_active } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (academic_year_id) where.academic_year_id = academic_year_id;
  if (is_active !== undefined) where.is_active = is_active === 'true';

  const { count, rows } = await Semester.findAndCountAll({
    where,
    include: [{ model: AcademicYear }],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['start_date', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const semester = await Semester.findByPk(req.params.id, { include: [{ model: AcademicYear }] });
  if (!semester) return success(res, null, 'Semester not found', 404);
  return success(res, semester);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    academic_year_id: Yup.number().integer().required(),
    start_date: Yup.date().required(),
    end_date: Yup.date().required(),
  });
  await validateOrThrow(schema, req.body);

  const semester = await Semester.create(req.body);
  return success(res, semester, 'Semester created', 201);
};

const update = async (req, res) => {
  const semester = await Semester.findByPk(req.params.id);
  if (!semester) return success(res, null, 'Semester not found', 404);
  await semester.update(req.body);
  return success(res, semester, 'Semester updated');
};

const remove = async (req, res) => {
  const semester = await Semester.findByPk(req.params.id);
  if (!semester) return success(res, null, 'Semester not found', 404);
  await semester.destroy();
  return success(res, null, 'Semester deleted');
};

module.exports = { getAll, getById, create, update, remove };
