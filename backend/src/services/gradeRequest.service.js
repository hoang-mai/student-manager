const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');

const GradeRequest = db.gradeRequest;
const GradeRequestAttachment = db.gradeRequestAttachment;
const StudentProfile = db.studentProfile;
const Course = db.course;
const Semester = db.semester;
const User = db.user;
const Grade = db.grade;
const Op = db.Sequelize.Op;

const getAll = async ({ page = 1, limit = 20, student_id, status }) => {
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

  return {
    data: rows,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getById = async (id) => {
  const request = await GradeRequest.findByPk(id, {
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['full_name'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'reviewer', attributes: ['id', 'full_name'] },
      { model: GradeRequestAttachment },
    ],
  });
  if (!request) throw new NotFoundError('Grade request not found');
  return request;
};

const create = async (data) => {
  return await GradeRequest.create(data);
};

const review = async (id, { status, review_note }, reviewerId) => {
  const request = await GradeRequest.findByPk(id);
  if (!request) throw new NotFoundError('Grade request not found');
  if (request.status !== 'PENDING') throw new BadRequestError('Request already reviewed');

  request.status = status;
  request.reviewer_id = reviewerId;
  request.review_note = review_note;
  request.reviewed_at = new Date();
  await request.save();

  if (status === 'APPROVED') {
    if (request.request_type === 'DELETE') {
      await Grade.destroy({ where: { student_id: request.student_id, course_id: request.course_id, semester_id: request.semester_id } });
    } else {
      const [grade, created] = await Grade.findOrCreate({
        where: { student_id: request.student_id, course_id: request.course_id, semester_id: request.semester_id },
        defaults: { score_10: request.proposed_score_10, created_by: reviewerId },
      });
      if (!created) await grade.update({ score_10: request.proposed_score_10, created_by: reviewerId });
    }
  }

  return request;
};

const remove = async (id) => {
  const request = await GradeRequest.findByPk(id);
  if (!request) throw new NotFoundError('Grade request not found');
  await request.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  review,
  remove,
};
