const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authMiddleware, requireAdmin } = require('../middlewares/auth.middleware');

router.post('/login', ctrl.login);
router.get('/me', authMiddleware, ctrl.me);
router.get('/profile', authMiddleware, ctrl.me);
router.put('/profile', authMiddleware, ctrl.updateProfile);
router.post('/register', authMiddleware, requireAdmin, ctrl.register);
router.post('/refresh-token', ctrl.refreshToken);
router.post('/change-password', authMiddleware, ctrl.changePassword);

// Notifications (dùng chung cho mọi role)
router.get('/notifications', authMiddleware, ctrl.getMyNotifications);
router.get('/notifications/:id', authMiddleware, ctrl.getMyNotificationDetail);
router.put('/notifications/:id/read', authMiddleware, ctrl.markNotificationRead);
router.put('/notifications/read-all', authMiddleware, ctrl.markAllNotificationsRead);
router.delete('/notifications/:id', authMiddleware, ctrl.deleteMyNotification);

module.exports = router;
