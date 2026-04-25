const router = require('express').Router();
const gradeRequestController = require('../controllers/gradeRequestController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, gradeRequestController.getAll);
router.get('/:id', authMiddleware, gradeRequestController.getById);
router.post('/', authMiddleware, gradeRequestController.create);
router.put('/:id/review', authMiddleware, requireRole('admin', 'chi_huy'), gradeRequestController.review);
router.delete('/:id', authMiddleware, gradeRequestController.remove);

module.exports = router;
