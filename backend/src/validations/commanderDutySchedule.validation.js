const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã chỉ huy không hợp lệ').required('Chỉ huy là bắt buộc'),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã chỉ huy không hợp lệ').nullable(),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

module.exports = { create, update };
