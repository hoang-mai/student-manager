const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  semester: yup.string().max(50).required('Trường này là bắt buộc'),
  schoolYear: yup.string().max(50).required('Trường này là bắt buộc'),
  yearlyResultId: yup.string().uuid('Mã kết quả năm không hợp lệ').required('Trường này là bắt buộc'),
  totalCredits: yup.number().integer().min(0),
  averageGrade4: yup.number().min(0).max(4),
  averageGrade10: yup.number().min(0).max(10),
  cumulativeCredits: yup.number().integer().min(0),
  cumulativeGrade4: yup.number().min(0).max(4),
  cumulativeGrade10: yup.number().min(0).max(10),
  debtCredits: yup.number().integer().min(0),
  failedSubjects: yup.number().integer().min(0),
});

const update = yup.object({
  userId: yup.string().uuid('Mã người dùng không hợp lệ'),
  semester: yup.string().max(50),
  schoolYear: yup.string().max(50),
  yearlyResultId: yup.string().uuid('Mã kết quả năm không hợp lệ'),
  totalCredits: yup.number().integer().min(0),
  averageGrade4: yup.number().min(0).max(4),
  averageGrade10: yup.number().min(0).max(10),
  cumulativeCredits: yup.number().integer().min(0),
  cumulativeGrade4: yup.number().min(0).max(4),
  cumulativeGrade10: yup.number().min(0).max(10),
  debtCredits: yup.number().integer().min(0),
  failedSubjects: yup.number().integer().min(0),
});

module.exports = { create, update };
