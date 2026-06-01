const yup = require('yup');

const scheduleItem = yup.object({
  day: yup.string().required('Trường này là bắt buộc'),
  startTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
  endTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
  room: yup.string().required('Trường này là bắt buộc'),
  subjectName: yup.string().nullable(),
  week: yup.number().integer().min(1).nullable(),
});

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  semesterId: yup.string().uuid('Mã học kỳ không hợp lệ').nullable(),
  schedules: yup.array().of(scheduleItem).nullable(),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').nullable(),
  semesterId: yup.string().uuid('Mã học kỳ không hợp lệ').nullable(),
  schedules: yup.array().of(scheduleItem).nullable(),
});

const batchItem = yup.object({
  studentCode: yup.string().max(50).required('Mã học viên là bắt buộc'),
  semesterId: yup.string().uuid('Mã học kỳ không hợp lệ').nullable(),
  schedules: yup.array().of(scheduleItem).min(1, 'Danh sách lịch học không được rỗng').required('Danh sách lịch học là bắt buộc'),
});

const batch = yup.object({
  semesterId: yup.string().uuid('Mã học kỳ không hợp lệ').nullable(),
  items: yup.array().of(batchItem).min(1, 'Danh sách thời khóa biểu không được rỗng').required('Danh sách thời khóa biểu là bắt buộc'),
});

module.exports = { create, update, batch };
