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

const query = yup.object({
  page: yup.number().integer().min(1).nullable(),
  limit: yup.number().integer().min(1).max(100).nullable(),
  sortBy: yup.string().nullable(),
  sortOrder: yup.string().oneOf(['asc', 'desc']).nullable(),
  className: yup.string().max(255).nullable(),
  educationLevelId: yup.string().uuid('Mã trình độ đào tạo không hợp lệ').nullable(),
  universityId: yup.string().uuid('Mã cơ sở đào tạo không hợp lệ').nullable(),
  universityName: yup.string().max(255).nullable(),
  organizationName: yup.string().max(255).nullable(),
  levelName: yup.string().max(255).nullable(),
});

module.exports = { create, update, query };
