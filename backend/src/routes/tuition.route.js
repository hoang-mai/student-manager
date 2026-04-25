const router = require('express').Router();
const tuitionController = require('../controllers/tuitionController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, tuitionController.getAll);
router.get('/:id', authMiddleware, tuitionController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), tuitionController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), tuitionController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), tuitionController.remove);

module.exports = router;
