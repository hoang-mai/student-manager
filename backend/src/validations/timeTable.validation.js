const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  schedules: yup.object().nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  schedules: yup.object().nullable(),
});

module.exports = { create, update };
