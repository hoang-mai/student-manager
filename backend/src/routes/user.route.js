const router = require('express').Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, userController.getMyProfile);
router.put('/me', authMiddleware, userController.updateMyProfile);

router.get('/', authMiddleware, requireRole('admin', 'chi_huy'), userController.getAllUsers);
router.get('/:id', authMiddleware, requireRole('admin', 'chi_huy'), userController.getUserById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), userController.createUser);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), userController.updateUser);
router.delete('/:id', authMiddleware, requireRole('admin'), userController.deleteUser);
router.patch('/:id/toggle-active', authMiddleware, requireRole('admin', 'chi_huy'), userController.toggleActive);
router.patch('/:id/reset-password', authMiddleware, requireRole('admin', 'chi_huy'), userController.resetPassword);

module.exports = router;
