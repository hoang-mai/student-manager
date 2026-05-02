const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');

const GradeRequest = db.gradeRequest;
const SubjectResult = db.subjectResult;
const SemesterResult = db.semesterResult;
const YearlyResult = db.yearlyResult;
const Student = db.student;
const User = db.user;
const Notification = db.notification;

// ===================== Student =====================

const create = async (studentId, data) => {
  const subject = await SubjectResult.findByPk(data.subjectResultId);
  if (!subject) throw new BadRequestError('Không tìm thấy môn học');

  // Verify subject belongs to this student
  const semResult = await SemesterResult.findByPk(subject.semesterResultId);
  if (!semResult || semResult.studentId !== studentId) {
    throw new BadRequestError('Môn học không thuộc về học viên này');
  }

  return GradeRequest.create({
    studentId,
    subjectResultId: data.subjectResultId,
    requestType: data.requestType,
    reason: data.reason,
    proposedLetterGrade: data.proposedLetterGrade,
    proposedGradePoint4: data.proposedGradePoint4,
    proposedGradePoint10: data.proposedGradePoint10,
    attachmentUrl: data.attachmentUrl,
  });
};

const getMyRequests = async (studentId, query = {}) => {
  const where = { studentId };
  if (query.status) where.status = query.status;

  return GradeRequest.findAll({
    where,
    include: [
      { model: SubjectResult },
      { model: User, as: 'reviewer', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getMyRequestDetail = async (studentId, id) => {
  const req = await GradeRequest.findOne({
    where: { id, studentId },
    include: [
      { model: SubjectResult },
      { model: User, as: 'reviewer', attributes: ['id', 'username'] },
    ],
  });
  if (!req) throw new NotFoundError('Không tìm thấy đề xuất');
  return req;
};

// ===================== Commander =====================

const getAll = async (query = {}) => {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.studentId) where.studentId = query.studentId;

  return GradeRequest.findAll({
    where,
    include: [
      { model: SubjectResult },
      { model: Student, attributes: ['id', 'studentId', 'fullName'] },
      { model: User, as: 'reviewer', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getDetail = async (id) => {
  const req = await GradeRequest.findByPk(id, {
    include: [
      { model: SubjectResult },
      { model: Student, attributes: ['id', 'studentId', 'fullName'] },
      { model: User, as: 'reviewer', attributes: ['id', 'username'] },
    ],
  });
  if (!req) throw new NotFoundError('Không tìm thấy đề xuất');
  return req;
};

// ===================== CPA Recalculation =====================

async function recalculateCpa(subjectResultId) {
  const subject = await SubjectResult.findByPk(subjectResultId);
  if (!subject) return;

  // Update semester
  const semResult = await SemesterResult.findByPk(subject.semesterResultId);
  if (!semResult) return;

  const allSubjects = await SubjectResult.findAll({ where: { semesterResultId: semResult.id } });
  let semCredits = 0, semPoint4 = 0, semPoint10 = 0, failed = 0, debtCredits = 0;

  for (const s of allSubjects) {
    const credits = s.credits || 0;
    semCredits += credits;
    semPoint4 += (s.gradePoint4 || 0) * credits;
    semPoint10 += (s.gradePoint10 || 0) * credits;
    if (!s.gradePoint4 || s.gradePoint4 === 0) { failed++; debtCredits += credits; }
  }

  await semResult.update({
    totalCredits: semCredits,
    averageGrade4: semCredits ? parseFloat((semPoint4 / semCredits).toFixed(2)) : 0,
    averageGrade10: semCredits ? parseFloat((semPoint10 / semCredits).toFixed(2)) : 0,
    debtCredits,
    failedSubjects: failed,
  });

  // Update yearly
  const yearly = await YearlyResult.findByPk(semResult.yearlyResultId);
  if (!yearly) return;

  const allSemesters = await SemesterResult.findAll({ where: { yearlyResultId: yearly.id } });
  let yearCredits = 0, yearPoint4 = 0, yearPoint10 = 0, yearFailed = 0, yearDebt = 0;

  for (const sm of allSemesters) {
    yearCredits += sm.totalCredits || 0;
    yearPoint4 += (sm.averageGrade4 || 0) * (sm.totalCredits || 0);
    yearPoint10 += (sm.averageGrade10 || 0) * (sm.totalCredits || 0);
    yearFailed += sm.failedSubjects || 0;
    yearDebt += sm.debtCredits || 0;
  }

  const totalSubjects = allSemesters.reduce((s, sm) => s + sm.totalCredits / (allSubjects[0]?.credits || 3), 0);

  await yearly.update({
    totalCredits: yearCredits,
    cumulativeCredits: yearCredits,
    averageGrade4: yearCredits ? parseFloat((yearPoint4 / yearCredits).toFixed(2)) : 0,
    averageGrade10: yearCredits ? parseFloat((yearPoint10 / yearCredits).toFixed(2)) : 0,
    cumulativeGrade4: yearCredits ? parseFloat((yearPoint4 / yearCredits).toFixed(2)) : 0,
    cumulativeGrade10: yearCredits ? parseFloat((yearPoint10 / yearCredits).toFixed(2)) : 0,
    failedSubjects: yearFailed,
    debtCredits: yearDebt,
  });

  // Update student
  const student = await Student.findByPk(yearly.studentId);
  if (student) {
    await student.update({
      currentCpa4: yearCredits ? parseFloat((yearPoint4 / yearCredits).toFixed(2)) : 0,
      currentCpa10: yearCredits ? parseFloat((yearPoint10 / yearCredits).toFixed(2)) : 0,
    });
  }
}

const approve = async (id, reviewerId, reviewNote) => {
  const req = await getDetail(id);
  if (req.status !== 'PENDING') throw new BadRequestError('Chỉ đề xuất đang chờ mới được phê duyệt');

  const subject = await SubjectResult.findByPk(req.subjectResultId);
  if (!subject) throw new NotFoundError('Không tìm thấy môn học');

  if (req.requestType === 'UPDATE' || req.requestType === 'ADD') {
    await subject.update({
      letterGrade: req.proposedLetterGrade || subject.letterGrade,
      gradePoint4: req.proposedGradePoint4 ?? subject.gradePoint4,
      gradePoint10: req.proposedGradePoint10 ?? subject.gradePoint10,
    });
  } else if (req.requestType === 'DELETE') {
    await subject.destroy();
  }

  await recalculateCpa(req.subjectResultId);

  await req.update({
    status: 'APPROVED',
    reviewerId,
    reviewNote: reviewNote || null,
    reviewedAt: new Date(),
  });

  const user = await User.findOne({ where: { studentId: req.studentId } });
  if (user) {
    await Notification.create({
      userId: user.id,
      title: 'Đề xuất đã được phê duyệt',
      content: `Đề xuất ${req.requestType === 'DELETE' ? 'xóa' : 'cập nhật'} điểm môn học của bạn đã được phê duyệt.`,
      type: 'GRADE',
    });
  }

  return req.reload({
    include: [{ model: SubjectResult }, { model: Student, attributes: ['id', 'studentId', 'fullName'] }],
  });
};

const reject = async (id, reviewerId, reviewNote) => {
  const req = await getDetail(id);
  if (req.status !== 'PENDING') throw new BadRequestError('Chỉ đề xuất đang chờ mới được từ chối');

  await req.update({
    status: 'REJECTED',
    reviewerId,
    reviewNote,
    reviewedAt: new Date(),
  });

  const user = await User.findOne({ where: { studentId: req.studentId } });
  if (user) {
    await Notification.create({
      userId: user.id,
      title: 'Đề xuất đã bị từ chối',
      content: `Đề xuất của bạn đã bị từ chối. Lý do: ${reviewNote}`,
      type: 'GRADE',
    });
  }

  return req.reload({
    include: [{ model: SubjectResult }, { model: Student, attributes: ['id', 'studentId', 'fullName'] }],
  });
};

module.exports = { create, getMyRequests, getMyRequestDetail, getAll, getDetail, approve, reject };
