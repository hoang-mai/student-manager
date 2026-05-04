const yup = require('yup');

const create = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255).required('Trường này là bắt buộc'),
  isAdmin: yup.boolean(),
  role: yup.string().max(50).oneOf(['STUDENT', 'COMMANDER', 'ADMIN'], 'Vai trò không hợp lệ'),
  refreshToken: yup.string(),
  fullName: yup.string().max(100),
  email: yup.string().max(100).email('Email không hợp lệ'),
  studentId: yup.string().max(50),
  commanderId: yup.string().max(50),
  deleteAt: yup.date(),
});

const update = yup.object({
  username: yup.string().max(50),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  fullName: yup.string().max(100),
  email: yup.string().max(100).email('Email không hợp lệ'),
  studentId: yup.string().max(50),
  commanderId: yup.string().max(50),
  deleteAt: yup.date(),
});

const batch = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  fullName: yup.string().max(100),
  email: yup.string().max(100).email('Email không hợp lệ'),
  studentId: yup.string().max(50),
  commanderId: yup.string().max(50),
  deleteAt: yup.date(),
});

const resetPassword = yup.object({
  newPassword: yup.string().min(6).required('Trường này là bắt buộc'),
});

module.exports = { create, update, batch, resetPassword };
