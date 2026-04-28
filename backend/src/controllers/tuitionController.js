const Yup = require('yup');
const tuitionService = require('../services/tuition.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await tuitionService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await tuitionService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer().required(),
      semester_id: Yup.number().integer().required(),
      amount: Yup.number().positive().required(),
      due_date: Yup.date().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await tuitionService.create(req.body);
    return success(res, result, 'Tuition created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await tuitionService.update(req.params.id, req.body);
    return success(res, result, 'Tuition updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await tuitionService.remove(req.params.id);
    return success(res, null, 'Tuition deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
