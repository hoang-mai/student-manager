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
      courseId: Yup.number().integer().required(),
      semesterId: Yup.number().integer().required(),
      dayOfWeek: Yup.number().integer().min(0).max(6).required(),
      startTime: Yup.string().required(),
      endTime: Yup.string().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await scheduleService.create(req.body);
    return success(res, result, 'Tạo lịch học thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await scheduleService.update(req.params.id, req.body);
    return success(res, result, 'Cập nhật lịch học thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await scheduleService.remove(req.params.id);
    return success(res, null, 'Xóa lịch học thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
