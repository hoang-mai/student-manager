const router = require('express').Router();
const achievementController = require('../controllers/achievementController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, achievementController.getAll);
router.get('/:id', authMiddleware, achievementController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), achievementController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), achievementController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), achievementController.remove);

module.exports = router;
