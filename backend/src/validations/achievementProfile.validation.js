const yup = require('yup');

const create = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ').required('Trường này là bắt buộc'),
  totalYears: yup.number().integer().min(0),
  totalAdvancedSoldier: yup.number().integer().min(0),
  totalCompetitiveSoldier: yup.number().integer().min(0),
  totalScientificTopics: yup.number().integer().min(0),
  totalScientificInitiatives: yup.number().integer().min(0),
  eligibleForMinistryReward: yup.boolean(),
  eligibleForNationalReward: yup.boolean(),
});

const update = yup.object({
  studentId: yup.string().uuid('studentId không hợp lệ'),
  totalYears: yup.number().integer().min(0),
  totalAdvancedSoldier: yup.number().integer().min(0),
  totalCompetitiveSoldier: yup.number().integer().min(0),
  totalScientificTopics: yup.number().integer().min(0),
  totalScientificInitiatives: yup.number().integer().min(0),
  eligibleForMinistryReward: yup.boolean(),
  eligibleForNationalReward: yup.boolean(),
});

module.exports = { create, update };
