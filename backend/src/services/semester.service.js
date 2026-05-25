const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const Semester = db.semester;
const Op = db.Sequelize.Op;
const SCHOOL_YEAR_PREFIX = 'YEAR::';

const normalizeSchoolYear = (schoolYear) => (schoolYear || '').trim();
const buildSchoolYearCode = (schoolYear) => `${SCHOOL_YEAR_PREFIX}${schoolYear}`;
const buildTermCode = (schoolYear, term) => `${schoolYear}-HK${term}`;
const isSchoolYearRow = (code) => typeof code === 'string' && code.startsWith(SCHOOL_YEAR_PREFIX);

const createSchoolYear = async (data) => {
  const schoolYear = normalizeSchoolYear(data.schoolYear);
  const existed = await Semester.findOne({ where: { code: buildSchoolYearCode(schoolYear) } });
  if (existed) throw new BadRequestError('Năm học đã tồn tại');

  return Semester.create({
    schoolYear,
    code: buildSchoolYearCode(schoolYear),
  });
};

const getSchoolYears = async (query = {}) => {
  const where = {
    code: { [Op.like]: `${SCHOOL_YEAR_PREFIX}%` },
  };
  if (query.schoolYear) where.schoolYear = query.schoolYear;

  const result = await paginateQuery(Semester, query, { where });
  result.rows = result.rows.map((row) => {
    const plain = row.get({ plain: true });
    return {
      id: plain.id,
      schoolYear: plain.schoolYear,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  });
  return result;
};

const createTerm = async (data) => {
  const schoolYear = normalizeSchoolYear(data.schoolYear);
  const term = Number(data.term);

  const year = await Semester.findOne({ where: { code: buildSchoolYearCode(schoolYear) } });
  if (!year) {
    throw new BadRequestError('Chưa có năm học. Vui lòng tạo năm học trước');
  }

  const code = buildTermCode(schoolYear, term);
  const existed = await Semester.findOne({ where: { code } });
  if (existed) throw new BadRequestError(`Đã có học kỳ ${term} cho năm học ${schoolYear}`);

  return Semester.create({ schoolYear, code });
};

const create = async (data) => Semester.create(data);

const getAll = async (query) => {
  const where = {};
  if (query.code) where.code = query.code;
  if (query.schoolYear) where.schoolYear = query.schoolYear;

  if (query.includeSchoolYears !== 'true') {
    where.code = {
      ...(where.code ? { [Op.eq]: where.code } : {}),
      [Op.notLike]: `${SCHOOL_YEAR_PREFIX}%`,
    };
  }

  return paginateQuery(Semester, query, { where });
};

const getDetail = async (id) => {
  const record = await Semester.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy học kỳ');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  if (isSchoolYearRow(record.code)) {
    throw new BadRequestError('Không cập nhật trực tiếp năm học từ endpoint học kỳ');
  }
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  if (isSchoolYearRow(record.code)) {
    const hasTerms = await Semester.count({
      where: {
        schoolYear: record.schoolYear,
        code: { [Op.notLike]: `${SCHOOL_YEAR_PREFIX}%` },
      },
    });
    if (hasTerms > 0) {
      throw new BadRequestError('Không thể xóa năm học đã có học kỳ');
    }
  }
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord, createSchoolYear, getSchoolYears, createTerm };
