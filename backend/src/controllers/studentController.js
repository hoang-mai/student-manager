const Yup = require('yup');
const studentService = require('../services/student.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await studentService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await studentService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      user_id: Yup.number().integer().required(),
      student_code: Yup.string().required(),
      class_id: Yup.number().integer().required(),
    });
    await validateOrThrow(schema, req.body);

    const result = await studentService.create(req.body);
    return success(res, result, 'Student profile created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await studentService.update(req.params.id, req.body);
    return success(res, result, 'Student profile updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await studentService.remove(req.params.id);
    return success(res, null, 'Student profile deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
