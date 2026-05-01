const yup = require('yup');

const create = yup.object({
  universityCode: yup.string().max(50).required('Trường này là bắt buộc'),
  universityName: yup.string().max(255).required('Trường này là bắt buộc'),
  totalStudents: yup.number().integer().min(0),
  status: yup.string().max(50),
});

const update = yup.object({
  universityCode: yup.string().max(50),
  universityName: yup.string().max(255),
  totalStudents: yup.number().integer().min(0),
  status: yup.string().max(50),
});

module.exports = { create, update };
