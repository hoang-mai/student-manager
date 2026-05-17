const yup = require('yup');

const scheduleItem = yup.object({
  day: yup.string().required('Trường này là bắt buộc'),
  startTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
  endTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
  room: yup.string().nullable(),
  subjectName: yup.string().max(255).nullable(),
  week: yup.string().max(50).nullable(),
});

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  schedules: yup.array().of(scheduleItem).nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  schedules: yup.array().of(scheduleItem).nullable(),
});

module.exports = { create, update };
