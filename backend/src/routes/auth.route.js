const router = require('express').Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth.middleware');
const asyncHandler = require('express-async-handler');

router.post('/login', asyncHandler(authController.login));
router.post('/register', asyncHandler(authController.register));
router.post('/refresh-token', asyncHandler(authController.refreshToken));
router.post('/change-password', authMiddleware, asyncHandler(authController.changePassword));

module.exports = router;
