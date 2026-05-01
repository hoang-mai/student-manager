const yup = require('yup');

const create = yup.object({
  code: yup.string().max(50).required('Trường này là bắt buộc'),
  schoolYear: yup.string().max(50).required('Trường này là bắt buộc'),
});

const update = yup.object({
  code: yup.string().max(50),
  schoolYear: yup.string().max(50),
});

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

module.exports = { create, update, gradeConvert, gpaCalculate };
