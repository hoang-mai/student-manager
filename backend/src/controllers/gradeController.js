const Yup = require('yup');
const gradeService = require('../services/grade.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await gradeService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await gradeService.getById(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer().required(),
      course_id: Yup.number().integer().required(),
      semester_id: Yup.number().integer().required(),
      score_10: Yup.number().min(0).max(10),
      score_4: Yup.number().min(0).max(4),
      letter_grade: Yup.string(),
      status: Yup.string().oneOf(['PASSED', 'FAILED', 'PENDING']),
    });
    await validateOrThrow(schema, req.body);

    const result = await gradeService.create(req.body, req.userId);
    return success(res, result, 'Grade created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await gradeService.update(req.params.id, req.body);
    return success(res, result, 'Grade updated');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await gradeService.remove(req.params.id);
    return success(res, null, 'Grade deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
