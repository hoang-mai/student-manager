const yup = require('yup');

const create = yup.object({
  yearlyAchievementId: yup.string().uuid('Mã thành tích năm không hợp lệ').required('Trường này là bắt buộc'),
  title: yup.string().max(255).required('Trường này là bắt buộc'),
  description: yup.string(),
  year: yup.number().integer().min(0),
  status: yup.string().max(50),
});

const update = yup.object({
  yearlyAchievementId: yup.string().uuid('Mã thành tích năm không hợp lệ'),
  title: yup.string().max(255),
  description: yup.string(),
  year: yup.number().integer().min(0),
  status: yup.string().max(50),
});

module.exports = { create, update };
