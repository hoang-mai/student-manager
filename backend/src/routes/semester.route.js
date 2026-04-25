const router = require('express').Router();
const semesterController = require('../controllers/semesterController');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, semesterController.getAll);
router.get('/:id', authMiddleware, semesterController.getById);
router.post('/', authMiddleware, requireRole('admin', 'chi_huy'), semesterController.create);
router.put('/:id', authMiddleware, requireRole('admin', 'chi_huy'), semesterController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), semesterController.remove);

module.exports = router;
