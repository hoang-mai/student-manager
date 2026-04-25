const router = require('express').Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/students', authMiddleware, requireRole('admin', 'chi_huy'), reportController.getStudentStats);
router.get('/grades', authMiddleware, requireRole('admin', 'chi_huy'), reportController.getGradeStats);
router.get('/tuitions', authMiddleware, requireRole('admin', 'chi_huy'), reportController.getTuitionStats);

module.exports = router;
