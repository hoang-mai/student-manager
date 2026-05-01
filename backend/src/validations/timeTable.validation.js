const yup = require('yup');

const create = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ').required('Trường này là bắt buộc'),
  schedules: yup.object(),
});

const update = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ'),
  schedules: yup.object(),
});

module.exports = { create, update };
