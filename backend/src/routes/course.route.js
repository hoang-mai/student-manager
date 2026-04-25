const router = require('express').Router();
const courseController = require('../controllers/courseController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, courseController.getAll);
router.get('/:id', authMiddleware, courseController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), courseController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), courseController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), courseController.remove);

module.exports = router;
