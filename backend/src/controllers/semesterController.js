const Yup = require('yup');
const semesterService = require('../services/semester.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await semesterService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await semesterService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      academic_year_id: Yup.number().integer().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await semesterService.create(req.body);
    return success(res, result, 'Semester created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await semesterService.update(req.params.id, req.body);
    return success(res, result, 'Semester updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await semesterService.remove(req.params.id);
    return success(res, null, 'Semester deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
