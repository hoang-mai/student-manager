const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const GradeRequest = db.gradeRequest;
const GradeRequestAttachment = db.gradeRequestAttachment;
const StudentProfile = db.studentProfile;
const Course = db.course;
const Semester = db.semester;
const User = db.user;
const Grade = db.grade;
const Op = db.Sequelize.Op;

const getAll = async (req, res) => {
  const { page = 1, limit = 20, student_id, status } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (student_id) where.student_id = student_id;
  if (status) where.status = status;

  const { count, rows } = await GradeRequest.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'reviewer', attributes: ['id', 'full_name'] },
      { model: GradeRequestAttachment },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getById = async (req, res) => {
  const request = await GradeRequest.findByPk(req.params.id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'reviewer', attributes: ['id', 'full_name'] },
      { model: GradeRequestAttachment },
    ],
  });
  if (!request) return success(res, null, 'Grade request not found', 404);
  return success(res, request);
};

const create = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().integer().required(),
    course_id: Yup.number().integer().required(),
    semester_id: Yup.number().integer().required(),
    request_type: Yup.string().oneOf(['ADD', 'UPDATE', 'DELETE']).required(),
    reason: Yup.string(),
    proposed_score_10: Yup.number().min(0).max(10),
  });
  await validateOrThrow(schema, req.body);

  const request = await GradeRequest.create(req.body);
  return success(res, request, 'Grade request created', 201);
};

const review = async (req, res) => {
  const schema = Yup.object().shape({
    status: Yup.string().oneOf(['APPROVED', 'REJECTED']).required(),
    review_note: Yup.string(),
  });
  await validateOrThrow(schema, req.body);

  const request = await GradeRequest.findByPk(req.params.id);
  if (!request) return success(res, null, 'Grade request not found', 404);
  if (request.status !== 'PENDING') return success(res, null, 'Request already reviewed', 400);

  const { status, review_note } = req.body;
  request.status = status;
  request.reviewer_id = req.userId;
  request.review_note = review_note;
  request.reviewed_at = new Date();
  await request.save();

  if (status === 'APPROVED') {
    if (request.request_type === 'DELETE') {
      await Grade.destroy({ where: { student_id: request.student_id, course_id: request.course_id, semester_id: request.semester_id } });
    } else {
      const [grade, created] = await Grade.findOrCreate({
        where: { student_id: request.student_id, course_id: request.course_id, semester_id: request.semester_id },
        defaults: { score_10: request.proposed_score_10, created_by: req.userId },
      });
      if (!created) await grade.update({ score_10: request.proposed_score_10, created_by: req.userId });
    }
  }

  return success(res, request, 'Grade request reviewed');
};

const remove = async (req, res) => {
  const request = await GradeRequest.findByPk(req.params.id);
  if (!request) return success(res, null, 'Grade request not found', 404);
  await request.destroy();
  return success(res, null, 'Grade request deleted');
};

module.exports = { getAll, getById, create, review, remove };
