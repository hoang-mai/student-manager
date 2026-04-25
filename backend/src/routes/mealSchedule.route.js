const router = require('express').Router();
const mealScheduleController = require('../controllers/mealScheduleController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, mealScheduleController.getAll);
router.get('/:id', authMiddleware, mealScheduleController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), mealScheduleController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), mealScheduleController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), mealScheduleController.remove);

module.exports = router;
