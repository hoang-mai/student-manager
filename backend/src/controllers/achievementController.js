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
      studentId: Yup.number().integer().required(),
      title: Yup.string().required(),
      achievementType: Yup.string().oneOf(['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING']).required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await achievementService.create(req.body, req.userId);
    return success(res, result, 'Tạo thành tích thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await achievementService.update(req.params.id, req.body);
    return success(res, result, 'Cập nhật thành tích thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await achievementService.remove(req.params.id);
    return success(res, null, 'Xóa thành tích thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
