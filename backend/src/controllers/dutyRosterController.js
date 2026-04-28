const Yup = require('yup');
const dutyRosterService = require('../services/dutyRoster.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await dutyRosterService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await dutyRosterService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      user_id: Yup.number().integer().required(),
      duty_date: Yup.date().required(),
      shift: Yup.string().oneOf(['MORNING', 'AFTERNOON', 'NIGHT', 'FULL']).required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await dutyRosterService.create(req.body, req.userId);
    return success(res, result, 'Duty roster created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await dutyRosterService.update(req.params.id, req.body);
    return success(res, result, 'Duty roster updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await dutyRosterService.remove(req.params.id);
    return success(res, null, 'Duty roster deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
