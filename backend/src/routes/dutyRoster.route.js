const router = require('express').Router();
const dutyRosterController = require('../controllers/dutyRosterController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, dutyRosterController.getAll);
router.get('/:id', authMiddleware, dutyRosterController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), dutyRosterController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), dutyRosterController.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'chi_huy'), dutyRosterController.remove);

module.exports = router;
