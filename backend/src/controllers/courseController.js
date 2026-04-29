const Yup = require('yup');
const courseService = require('../services/course.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await courseService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await courseService.getById(req.params.id);
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
      credits: Yup.number().integer().min(0),
    });
    await validateOrThrow(schema, req.body);

    const result = await courseService.create(req.body);
    return success(res, result, 'Tạo môn học thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await courseService.update(req.params.id, req.body);
    return success(res, result, 'Cập nhật môn học thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await courseService.remove(req.params.id);
    return success(res, null, 'Xóa môn học thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
