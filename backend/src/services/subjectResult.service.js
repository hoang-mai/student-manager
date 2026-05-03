const db = require('../models');
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const SubjectResult = db.subjectResult;
const SemesterResult = db.semesterResult;

const create = async (data) => SubjectResult.create(data);
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
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };
