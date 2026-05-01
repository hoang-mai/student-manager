const yup = require('yup');

const create = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255).required('Trường này là bắt buộc'),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  studentId: yup.string().uuid('studentId không hợp lệ'),
  commanderId: yup.string().uuid('commanderId không hợp lệ'),
  deleteAt: yup.date(),
});

const update = yup.object({
  username: yup.string().max(50),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  studentId: yup.string().uuid('studentId không hợp lệ'),
  commanderId: yup.string().uuid('commanderId không hợp lệ'),
  deleteAt: yup.date(),
});

const batch = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  studentId: yup.string().uuid('studentId không hợp lệ'),
  commanderId: yup.string().uuid('commanderId không hợp lệ'),
  deleteAt: yup.date(),
});

const resetPassword = yup.object({
  newPassword: yup.string().min(6).required('Trường này là bắt buộc'),
});

module.exports = { create, update, batch, resetPassword };
