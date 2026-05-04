const yup = require('yup');

const create = yup.object({
  levelName: yup.string().max(255).required('Trường này là bắt buộc'),
  organizationId: yup.string().uuid('Mã đơn vị không hợp lệ'),
});

const update = yup.object({
  levelName: yup.string().max(255),
  organizationId: yup.string().uuid('Mã đơn vị không hợp lệ'),
});

module.exports = { create, update };
