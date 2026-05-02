const router = require('express').Router();
const { authMiddleware, requireRole, requireStudent } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/gradeRequest.controller');

// ===================== Student (chỉ STUDENT) =====================
router.post('/students/grade-requests', authMiddleware, requireStudent, ctrl.create);
router.get('/students/grade-requests', authMiddleware, requireStudent, ctrl.getMyRequests);
router.get('/students/grade-requests/:id', authMiddleware, requireStudent, ctrl.getMyRequestDetail);

// ===================== Commander/Admin =====================
router.get('/commanders/grade-requests', authMiddleware, requireRole('ADMIN', 'COMMANDER'), ctrl.getAll);
router.get('/commanders/grade-requests/:id', authMiddleware, requireRole('ADMIN', 'COMMANDER'), ctrl.getDetail);
router.post('/commanders/grade-requests/:id/approve', authMiddleware, requireRole('ADMIN', 'COMMANDER'), ctrl.approve);
router.post('/commanders/grade-requests/:id/reject', authMiddleware, requireRole('ADMIN', 'COMMANDER'), ctrl.reject);

module.exports = router;
