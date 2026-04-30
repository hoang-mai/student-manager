const router = require('express').Router();
const controller = require('../controllers/subjectResult.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'COMMANDER'));

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
