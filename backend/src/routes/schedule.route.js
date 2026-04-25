const router = require('express').Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, scheduleController.getAll);
router.get('/:id', authMiddleware, scheduleController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), scheduleController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), scheduleController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), scheduleController.remove);

module.exports = router;
