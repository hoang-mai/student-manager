const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('userId không hợp lệ').required('Trường này là bắt buộc'),
  schedules: yup.object(),
});

const update = yup.object({
  userId: yup.string().uuid('userId không hợp lệ'),
  schedules: yup.object(),
});

module.exports = { create, update };
