const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  year: yup.number().integer().min(0).required('Trường này là bắt buộc'),
  decisionNumber: yup.string().max(100),
  decisionDate: yup.date(),
  title: yup.string().max(255),
  hasMinistryReward: yup.boolean(),
  hasNationalReward: yup.boolean(),
  notes: yup.string(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ'),
  year: yup.number().integer().min(0),
  decisionNumber: yup.string().max(100),
  decisionDate: yup.date(),
  title: yup.string().max(255),
  hasMinistryReward: yup.boolean(),
  hasNationalReward: yup.boolean(),
  notes: yup.string(),
});

module.exports = { create, update };
