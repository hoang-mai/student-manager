const yup = require('yup');

const create = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ').required('Trường này là bắt buộc'),
  year: yup.number().integer().min(0).required('Trường này là bắt buộc'),
  decisionNumber: yup.string().max(100),
  decisionDate: yup.date(),
  title: yup.string().max(255),
  hasMinistryReward: yup.boolean(),
  hasNationalReward: yup.boolean(),
  notes: yup.string(),
});

const update = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ'),
  year: yup.number().integer().min(0),
  decisionNumber: yup.string().max(100),
  decisionDate: yup.date(),
  title: yup.string().max(255),
  hasMinistryReward: yup.boolean(),
  hasNationalReward: yup.boolean(),
  notes: yup.string(),
});

module.exports = { create, update };
