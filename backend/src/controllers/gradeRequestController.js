const Yup = require('yup');
const gradeRequestService = require('../services/gradeRequest.service');
const { success, paginated, error, validateOrThrow } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const result = await gradeRequestService.getAll(req.query);
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await gradeRequestService.getById(req.params.id);
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
      request_type: Yup.string().oneOf(['ADD', 'UPDATE', 'DELETE']).required(),
      reason: Yup.string(),
      proposed_score_10: Yup.number().min(0).max(10),
    });
    await validateOrThrow(schema, req.body);

    const result = await gradeRequestService.create(req.body);
    return success(res, result, 'Grade request created', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const review = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      status: Yup.string().oneOf(['APPROVED', 'REJECTED']).required(),
      review_note: Yup.string(),
    });
    await validateOrThrow(schema, req.body);

    const result = await gradeRequestService.review(req.params.id, req.body, req.userId);
    return success(res, result, 'Grade request reviewed');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await gradeRequestService.remove(req.params.id);
    return success(res, null, 'Grade request deleted');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, review, remove };
