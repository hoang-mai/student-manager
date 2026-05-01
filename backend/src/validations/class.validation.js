const yup = require('yup');

const create = yup.object({
  className: yup.string().max(255).required('Trường này là bắt buộc'),
  studentCount: yup.number().integer().min(0),
  educationLevelId: yup.string().uuid('educationLevelId không hợp lệ'),
});

const update = yup.object({
  className: yup.string().max(255),
  studentCount: yup.number().integer().min(0),
  educationLevelId: yup.string().uuid('educationLevelId không hợp lệ'),
});

module.exports = { create, update };
