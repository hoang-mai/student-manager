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

const getAll = async ({ page = 1, limit = 20, studentId, status }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (studentId) where.studentId = studentId;
  if (status) where.status = status;

  const { count, rows } = await GradeRequest.findAndCountAll({
    where,
    include: [
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'reviewer', attributes: ['id', 'fullName'] },
      { model: GradeRequestAttachment },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['createdAt', 'DESC']],
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
      { model: StudentProfile, as: 'student', include: [{ model: User, attributes: ['fullName'] }] },
      { model: Course },
      { model: Semester },
      { model: User, as: 'reviewer', attributes: ['id', 'fullName'] },
      { model: GradeRequestAttachment },
    ],
  });
  if (!request) throw new NotFoundError('Không tìm thấy đề xuất điểm');
  return request;
};

const create = async (data) => {
  return await GradeRequest.create(data);
};

const review = async (id, { status, reviewNote }, reviewerId) => {
  const request = await GradeRequest.findByPk(id);
  if (!request) throw new NotFoundError('Không tìm thấy đề xuất điểm');
  if (request.status !== 'PENDING') throw new BadRequestError('Đề xuất này đã được xử lý');

  request.status = status;
  request.reviewerId = reviewerId;
  request.reviewNote = reviewNote;
  request.reviewedAt = new Date();
  await request.save();

  if (status === 'APPROVED') {
    if (request.requestType === 'DELETE') {
      await Grade.destroy({ where: { studentId: request.studentId, courseId: request.courseId, semesterId: request.semesterId } });
    } else {
      const [grade, created] = await Grade.findOrCreate({
        where: { studentId: request.studentId, courseId: request.courseId, semesterId: request.semesterId },
        defaults: { score10: request.proposedScore10, createdBy: reviewerId },
      });
      if (!created) await grade.update({ score10: request.proposedScore10, createdBy: reviewerId });
    }
  }

  return request;
};

const remove = async (id) => {
  const request = await GradeRequest.findByPk(id);
  if (!request) throw new NotFoundError('Không tìm thấy đề xuất điểm');
  await request.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  review,
  remove,
};
