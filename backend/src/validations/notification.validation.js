const yup = require('yup');

const create = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ').required('Trường này là bắt buộc'),
  title: yup.string().max(255).required('Trường này là bắt buộc'),
  content: yup.string(),
  type: yup.string().max(50),
  link: yup.string().max(500),
  isRead: yup.boolean(),
});

const update = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ'),
  title: yup.string().max(255),
  content: yup.string(),
  type: yup.string().max(50),
  link: yup.string().max(500),
  isRead: yup.boolean(),
});

module.exports = { create, update };
