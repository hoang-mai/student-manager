const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const Semester = db.semester;
const AcademicYear = db.academicYear;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, academic_year_id, is_active }) => {
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
  const semester = await Semester.findByPk(id, { include: [{ model: AcademicYear }] });
  if (!semester) throw new NotFoundError('Semester not found');
  return semester;
};

const create = async (data) => {
  return await Semester.create(data);
};

const update = async (id, data) => {
  const semester = await Semester.findByPk(id);
  if (!semester) throw new NotFoundError('Semester not found');
  await semester.update(data);
  return semester;
};

const remove = async (id) => {
  const semester = await Semester.findByPk(id);
  if (!semester) throw new NotFoundError('Semester not found');
  await semester.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
