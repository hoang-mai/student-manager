const yup = require('yup');

const create = yup.object({
  organizationName: yup.string().max(255).required('Trường này là bắt buộc'),
  travelTime: yup.number().integer().min(0),
  totalStudents: yup.number().integer().min(0),
  status: yup.string().max(50),
  universityId: yup.string().uuid('universityId không hợp lệ'),
});

const update = yup.object({
  organizationName: yup.string().max(255),
  travelTime: yup.number().integer().min(0),
  totalStudents: yup.number().integer().min(0),
  status: yup.string().max(50),
  universityId: yup.string().uuid('universityId không hợp lệ'),
});

module.exports = { create, update };
