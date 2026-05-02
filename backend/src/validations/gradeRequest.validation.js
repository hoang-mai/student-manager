const Yup = require('yup');

exports.create = Yup.object({
  subjectResultId: Yup.string().uuid('subjectResultId không hợp lệ').required('Môn học là bắt buộc'),
  requestType: Yup.string().oneOf(['ADD', 'UPDATE', 'DELETE'], 'Loại đề xuất không hợp lệ').required('Loại đề xuất là bắt buộc'),
  reason: Yup.string().required('Lý do là bắt buộc'),
  proposedLetterGrade: Yup.string().max(5),
  proposedGradePoint4: Yup.number().min(0).max(4),
  proposedGradePoint10: Yup.number().min(0).max(10),
  attachmentUrl: Yup.string().max(500),
});

exports.approve = Yup.object({
  reviewNote: Yup.string(),
});

exports.reject = Yup.object({
  reviewNote: Yup.string().required('Lý do từ chối là bắt buộc'),
});
