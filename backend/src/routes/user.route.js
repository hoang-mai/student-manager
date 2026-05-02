const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'COMMANDER'));

/**
 * @swagger
 * /users/batch:
 *   post:
 *     tags: [Users]
 *     summary: CH-01 - Tạo tài khoản hàng loạt
 *     description: Admin tạo nhiều tài khoản cùng lúc. Mỗi user có username, password, role, studentId/commanderId. Trả về kết quả từng tài khoản
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Kết quả tạo hàng loạt
 */
router.post('/batch', controller.createBatchUsers);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: CH-01 - Reset mật khẩu
 *     description: Admin đặt lại mật khẩu cho người dùng. Mặc định là 123456 nếu không cung cấp
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 */
router.post('/:id/reset-password', controller.resetPassword);

/**
 * @swagger
 * /users/{id}/toggle-active:
 *   post:
 *     tags: [Users]
 *     summary: CH-01 - Khóa/Mở khóa tài khoản
 *     description: Admin khóa (soft delete) hoặc mở khóa (restore) tài khoản người dùng
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trạng thái mới (ACTIVE hoặc LOCKED)
 */
router.post('/:id/toggle-active', controller.toggleActive);

// CRUD Người dùng
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
