const yup = require('yup');

const create = yup.object({
  className: yup.string().max(255).required('Trường này là bắt buộc'),
  studentCount: yup.number().integer().min(0).nullable(),
  educationLevelId: yup.string().uuid('Mã trình độ đào tạo không hợp lệ').nullable(),
});

const update = yup.object({
  className: yup.string().max(255).nullable(),
  studentCount: yup.number().integer().min(0).nullable(),
  educationLevelId: yup.string().uuid('Mã trình độ đào tạo không hợp lệ').nullable(),
});

module.exports = { create, update };
