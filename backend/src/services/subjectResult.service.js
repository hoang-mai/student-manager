const db = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const SubjectResult = db.subjectResult;
const SemesterResult = db.semesterResult;
const User = db.user;

const assertStudentSemesterResult = async (semesterResultId) => {
  const semesterResult = await SemesterResult.findByPk(semesterResultId, {
    include: [{ model: User }],
  });
  if (!semesterResult) throw new BadRequestError('Không tìm thấy kết quả học kỳ');
  if (!semesterResult.User || semesterResult.User.role !== 'STUDENT') {
    throw new BadRequestError('Môn học chỉ được nhập cho học viên');
  }
  return semesterResult;
};

const create = async (data) => {
  await assertStudentSemesterResult(data.semesterResultId);
  return SubjectResult.create(data);
};
const getAll = async (query) => paginateQuery(SubjectResult, query, {
  filterFields: ['semesterResultId', 'subjectCode', 'subjectName', 'letterGrade'],
  include: [{ model: SemesterResult }],
});

const getDetail = async (id) => {
  const record = await SubjectResult.findByPk(id, {
    include: [{ model: SemesterResult }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy kết quả môn học');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  if (data.semesterResultId !== undefined) {
    await assertStudentSemesterResult(data.semesterResultId);
  }
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };
