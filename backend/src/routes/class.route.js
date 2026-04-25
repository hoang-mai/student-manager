const router = require('express').Router();
const classController = require('../controllers/classController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, classController.getAll);
router.get('/:id', authMiddleware, classController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), classController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), classController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), classController.remove);

module.exports = router;
