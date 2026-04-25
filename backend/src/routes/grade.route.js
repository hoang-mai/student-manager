const router = require('express').Router();
const gradeController = require('../controllers/gradeController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, gradeController.getAll);
router.get('/:id', authMiddleware, gradeController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), gradeController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), gradeController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), gradeController.remove);

module.exports = router;
