const yup = require('yup');

const create = yup.object({
  userId: yup.string().uuid('userId không hợp lệ').required('Trường này là bắt buộc'),
  schoolYear: yup.string().max(50).required('Trường này là bắt buộc'),
  averageGrade4: yup.number().min(0).max(4),
  averageGrade10: yup.number().min(0).max(10),
  cumulativeGrade4: yup.number().min(0).max(4),
  cumulativeGrade10: yup.number().min(0).max(10),
  cumulativeCredits: yup.number().integer().min(0),
  totalCredits: yup.number().integer().min(0),
  totalSubjects: yup.number().integer().min(0),
  passedSubjects: yup.number().integer().min(0),
  failedSubjects: yup.number().integer().min(0),
  debtCredits: yup.number().integer().min(0),
  academicStatus: yup.string().max(50),
  studentLevel: yup.number().integer().min(0),
  semesterIds: yup.string().uuid('semesterIds không hợp lệ'),
  partyRating: yup.string().max(50),
  trainingRating: yup.string().max(50),
  partyRatingDecisionNumber: yup.string().max(100),
});

const update = yup.object({
  userId: yup.string().uuid('userId không hợp lệ'),
  schoolYear: yup.string().max(50),
  averageGrade4: yup.number().min(0).max(4),
  averageGrade10: yup.number().min(0).max(10),
  cumulativeGrade4: yup.number().min(0).max(4),
  cumulativeGrade10: yup.number().min(0).max(10),
  cumulativeCredits: yup.number().integer().min(0),
  totalCredits: yup.number().integer().min(0),
  totalSubjects: yup.number().integer().min(0),
  passedSubjects: yup.number().integer().min(0),
  failedSubjects: yup.number().integer().min(0),
  debtCredits: yup.number().integer().min(0),
  academicStatus: yup.string().max(50),
  studentLevel: yup.number().integer().min(0),
  semesterIds: yup.string().uuid('semesterIds không hợp lệ'),
  partyRating: yup.string().max(50),
  trainingRating: yup.string().max(50),
  partyRatingDecisionNumber: yup.string().max(100),
});

module.exports = { create, update };
