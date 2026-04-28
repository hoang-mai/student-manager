const Yup = require('yup');
const scheduleService = require('../services/schedule.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await scheduleService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await scheduleService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      course_id: Yup.number().integer().required(),
      semester_id: Yup.number().integer().required(),
      day_of_week: Yup.number().integer().min(0).max(6).required(),
      start_time: Yup.string().required(),
      end_time: Yup.string().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await scheduleService.create(req.body);
    return success(res, result, 'Schedule created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await scheduleService.update(req.params.id, req.body);
    return success(res, result, 'Schedule updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await scheduleService.remove(req.params.id);
    return success(res, null, 'Schedule deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
