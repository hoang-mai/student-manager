const yup = require('yup');

const create = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ').required('Trường này là bắt buộc'),
  semester: yup.string().max(50),
  schoolYear: yup.string().max(50),
  content: yup.string(),
  year: yup.number().integer().min(0),
  title: yup.string().max(255),
  description: yup.string(),
  award: yup.string().max(255),
});

const update = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ'),
  semester: yup.string().max(50),
  schoolYear: yup.string().max(50),
  content: yup.string(),
  year: yup.number().integer().min(0),
  title: yup.string().max(255),
  description: yup.string(),
  award: yup.string().max(255),
});

module.exports = { create, update };
