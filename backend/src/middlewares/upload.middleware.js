const multer = require('multer');
const { BadRequestError } = require('../utils/apiError');

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isExcel = /\.(xlsx|xls)$/i.test(file.originalname);
    if (!isExcel) return cb(new BadRequestError('Chỉ chấp nhận file Excel .xlsx hoặc .xls'));
    return cb(null, true);
  },
});

const uploadExcel = (fieldName = 'file') => (req, res, next) => {
  excelUpload.single(fieldName)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('Dung lượng file tối đa là 5MB'));
    }
    return next(err);
  });
};

module.exports = { uploadExcel };
