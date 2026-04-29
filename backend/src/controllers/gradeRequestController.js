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
      studentId: Yup.number().integer().required(),
      courseId: Yup.number().integer().required(),
      semesterId: Yup.number().integer().required(),
      requestType: Yup.string().oneOf(['ADD', 'UPDATE', 'DELETE']).required(),
      reason: Yup.string(),
      proposedScore10: Yup.number().min(0).max(10),
    });
    await validateOrThrow(schema, req.body);

    const result = await gradeRequestService.create(req.body);
    return success(res, result, 'Tạo đề xuất điểm thành công', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const review = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      status: Yup.string().oneOf(['APPROVED', 'REJECTED']).required(),
      reviewNote: Yup.string(),
    });
    await validateOrThrow(schema, req.body);

    const result = await gradeRequestService.review(req.params.id, req.body, req.userId);
    return success(res, result, 'Đề xuất điểm đã được xử lý');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await gradeRequestService.remove(req.params.id);
    return success(res, null, 'Xóa đề xuất điểm thành công');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getAll, getById, create, review, remove };
