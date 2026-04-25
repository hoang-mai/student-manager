const router = require('express').Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
