const router = require('express').Router();
const universityController = require('../controllers/universityController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, universityController.getAll);
router.get('/:id', authMiddleware, universityController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), universityController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), universityController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), universityController.remove);

module.exports = router;
