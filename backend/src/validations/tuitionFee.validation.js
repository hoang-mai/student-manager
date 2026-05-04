const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  totalAmount: yup.number().min(0),
  semester: yup.string().max(50),
  schoolYear: yup.string().max(50),
  content: yup.string().max(255),
  status: yup.string().max(50),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ'),
  totalAmount: yup.number().min(0),
  semester: yup.string().max(50),
  schoolYear: yup.string().max(50),
  content: yup.string().max(255),
  status: yup.string().max(50),
});

module.exports = { create, update };
