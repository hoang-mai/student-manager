const router = require('express').Router();
const controller = require('../controllers/notification.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'COMMANDER'));

// Chỉ GET + PUT (đánh dấu đọc) + DELETE, không POST (hệ thống tự tạo)
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
