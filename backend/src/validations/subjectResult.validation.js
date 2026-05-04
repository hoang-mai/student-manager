const yup = require('yup');

const create = yup.object({
  semesterResultId: yup.string().uuid('Mã kết quả học kỳ không hợp lệ').required('Trường này là bắt buộc'),
  subjectCode: yup.string().max(50).required('Trường này là bắt buộc'),
  subjectName: yup.string().max(255).required('Trường này là bắt buộc'),
  credits: yup.number().integer().min(0),
  letterGrade: yup.string().max(5),
  gradePoint4: yup.number().min(0).max(4),
  gradePoint10: yup.number().min(0).max(10),
});

const update = yup.object({
  semesterResultId: yup.string().uuid('Mã kết quả học kỳ không hợp lệ'),
  subjectCode: yup.string().max(50),
  subjectName: yup.string().max(255),
  credits: yup.number().integer().min(0),
  letterGrade: yup.string().max(5),
  gradePoint4: yup.number().min(0).max(4),
  gradePoint10: yup.number().min(0).max(10),
});

module.exports = { create, update };
