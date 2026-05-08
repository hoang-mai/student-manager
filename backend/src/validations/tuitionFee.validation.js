const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  totalAmount: yup.number().min(0).nullable(),
  semester: yup.string().max(50).nullable(),
  schoolYear: yup.string().max(50).nullable(),
  content: yup.string().max(255).nullable(),
  status: yup.string().max(50).nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  totalAmount: yup.number().min(0).nullable(),
  semester: yup.string().max(50).nullable(),
  schoolYear: yup.string().max(50).nullable(),
  content: yup.string().max(255).nullable(),
  status: yup.string().max(50).nullable(),
});

module.exports = { create, update };
