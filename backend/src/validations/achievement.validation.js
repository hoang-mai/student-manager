const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  semester: yup.string().max(50).nullable(),
  schoolYear: yup.string().max(50).nullable(),
  content: yup.string().nullable(),
  year: yup.number().integer().min(0).nullable(),
  title: yup.string().max(255).nullable(),
  description: yup.string().nullable(),
  award: yup.string().max(255).nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  semester: yup.string().max(50).nullable(),
  schoolYear: yup.string().max(50).nullable(),
  content: yup.string().nullable(),
  year: yup.number().integer().min(0).nullable(),
  title: yup.string().max(255).nullable(),
  description: yup.string().nullable(),
  award: yup.string().max(255).nullable(),
});

module.exports = { create, update };
