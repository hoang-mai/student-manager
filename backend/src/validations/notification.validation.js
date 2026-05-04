const Yup = require('yup');

exports.create = Yup.object({
  userId: Yup.string().uuid('Mã người dùng không hợp lệ').required('Trường này là bắt buộc'),
  title: Yup.string().max(255).required('Trường này là bắt buộc'),
  content: Yup.string(),
  type: Yup.string().max(50),
  link: Yup.string().max(500),
  isRead: Yup.boolean(),
});

exports.update = Yup.object({
  userId: Yup.string().uuid('Mã người dùng không hợp lệ'),
  title: Yup.string().max(255),
  content: Yup.string(),
  type: Yup.string().max(50),
  link: Yup.string().max(500),
  isRead: Yup.boolean(),
});
