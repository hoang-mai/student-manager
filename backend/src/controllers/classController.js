const Yup = require('yup');
const classService = require('../services/class.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await classService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await classService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      name: Yup.string().required(),
      major_id: Yup.number().integer().required(),
      academic_year_id: Yup.number().integer().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await classService.create(req.body);
    return success(res, result, 'Class created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await classService.update(req.params.id, req.body);
    return success(res, result, 'Class updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await classService.remove(req.params.id);
    return success(res, null, 'Class deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
