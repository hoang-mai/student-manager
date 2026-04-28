const Yup = require('yup');
const achievementService = require('../services/achievement.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await achievementService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await achievementService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer().required(),
      title: Yup.string().required(),
      achievement_type: Yup.string().oneOf(['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING']).required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await achievementService.create(req.body, req.userId);
    return success(res, result, 'Achievement created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await achievementService.update(req.params.id, req.body);
    return success(res, result, 'Achievement updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await achievementService.remove(req.params.id);
    return success(res, null, 'Achievement deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
