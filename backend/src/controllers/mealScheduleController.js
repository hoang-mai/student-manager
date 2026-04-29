const Yup = require('yup');
const mealScheduleService = require('../services/mealSchedule.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await mealScheduleService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await mealScheduleService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      studentId: Yup.number().integer().required(),
      scheduleDate: Yup.date().required(),
      session: Yup.string().oneOf(['MORNING', 'NOON', 'AFTERNOON', 'EVENING']).required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await mealScheduleService.create(req.body);
    return success(res, result, 'Tạo lịch cắt cơm thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await mealScheduleService.update(req.params.id, req.body);
    return success(res, result, 'Cập nhật lịch cắt cơm thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await mealScheduleService.remove(req.params.id);
    return success(res, null, 'Xóa lịch cắt cơm thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
