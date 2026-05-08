const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  year: yup.number().integer().min(0).required('Trường này là bắt buộc'),
  decisionNumber: yup.string().max(100).nullable(),
  decisionDate: yup.date().nullable(),
  title: yup.string().max(255).nullable(),
  hasMinistryReward: yup.boolean().nullable(),
  hasNationalReward: yup.boolean().nullable(),
  notes: yup.string().nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  year: yup.number().integer().min(0).nullable(),
  decisionNumber: yup.string().max(100).nullable(),
  decisionDate: yup.date().nullable(),
  title: yup.string().max(255).nullable(),
  hasMinistryReward: yup.boolean().nullable(),
  hasNationalReward: yup.boolean().nullable(),
  notes: yup.string().nullable(),
});

module.exports = { create, update };
