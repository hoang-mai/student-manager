const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, studentController.getAll);
router.get('/:id', authMiddleware, studentController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), studentController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), studentController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), studentController.remove);

module.exports = router;
