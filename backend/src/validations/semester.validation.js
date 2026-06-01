const yup = require('yup');

const create = yup.object({
  code: yup.string().max(50).required('Trường này là bắt buộc'),
  schoolYearId: yup.string().uuid('Mã năm học không hợp lệ').nullable(),
  schoolYear: yup.string().max(50).nullable(),
}).test('has-school-year', 'Cần truyền schoolYearId hoặc schoolYear', (value) => Boolean(value?.schoolYearId || value?.schoolYear));

const update = yup.object({
  code: yup.string().max(50).nullable(),
  schoolYearId: yup.string().uuid('Mã năm học không hợp lệ').nullable(),
  schoolYear: yup.string().max(50).nullable(),
});


const createSchoolYear = yup.object({
  schoolYear: yup.string().max(50).required('Năm học là bắt buộc'),
});

const createTerm = yup.object({
  schoolYearId: yup.string().uuid('Mã năm học không hợp lệ').nullable(),
  schoolYear: yup.string().max(50).nullable(),
  term: yup.number().integer().oneOf([1, 2], 'Kỳ học chỉ gồm 1 hoặc 2').required('Kỳ học là bắt buộc'),
}).test('has-school-year', 'Cần truyền schoolYearId hoặc schoolYear', (value) => Boolean(value?.schoolYearId || value?.schoolYear));

const gradeConvert = yup.object({
  value: yup.string().required('Trường này là bắt buộc'),
  from: yup.string().oneOf(['10', '4', 'letter']).required('Trường này là bắt buộc'),
  to: yup.string().oneOf(['10', '4', 'letter']).required('Trường này là bắt buộc'),
});

const gpaCalculate = yup.object({
  grades: yup.array().of(
    yup.object({
      point10: yup.number().min(0).max(10).required('Trường này là bắt buộc'),
      credits: yup.number().integer().min(0).required('Trường này là bắt buộc'),
    }),
  ).required('Trường này là bắt buộc'),
});

module.exports = { create, update, createSchoolYear, createTerm, gradeConvert, gpaCalculate };
