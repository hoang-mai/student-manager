const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authMiddleware, requireRole, requireStudent, requireAdmin } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// ===================== Student: Học tập =====================
router.get('/academic-results', requireStudent, controller.getAcademicResults);

// ===================== Student: Thời khóa biểu =====================
router.get('/time-table', requireStudent, controller.getMyTimeTable);
router.post('/time-table', requireStudent, controller.createMyTimeTable);
router.put('/time-table/:id', requireStudent, controller.updateMyTimeTable);
router.delete('/time-table/:id', requireStudent, controller.deleteMyTimeTable);

// ===================== Student: Cắt cơm =====================
router.get('/cut-rice', requireStudent, controller.getMyCutRice);
router.put('/cut-rice', requireStudent, controller.updateMyCutRice);

// ===================== Student: Thành tích & Học phí =====================
router.get('/achievements', requireStudent, controller.getMyAchievements);
router.get('/tuition-fees', requireStudent, controller.getMyTuitionFees);

// ===================== Profile (cá nhân) =====================
router.get('/profile', requireRole('STUDENT', 'COMMANDER'), controller.getMyProfile);
router.put('/profile', requireRole('STUDENT', 'COMMANDER'), controller.updateMyProfile);
router.post('/avatar', requireRole('STUDENT', 'COMMANDER'), controller.uploadAvatar);

// ===================== Admin/Commander: Quản lý hồ sơ =====================
router.use(requireRole('ADMIN', 'COMMANDER'));

router.get('/profiles/export', controller.exportProfiles);
router.get('/profiles', controller.getAllProfiles);
router.get('/profiles/:id', controller.getProfileDetail);
router.put('/profiles/:id', controller.updateProfile);
router.delete('/profiles/:id', requireAdmin, controller.deleteProfile);

// ===================== Commander: Cắt cơm hàng loạt =====================
router.post('/cut-rice/generate/:userId', controller.generateCutRice);
router.post('/cut-rice/generate-all', controller.generateAllCutRice);

// ===================== Commander: Báo cáo =====================
router.get('/reports/academic', controller.getAcademicReport);
router.get('/reports/party-training', controller.getPartyTrainingReport);
router.get('/reports/achievements', controller.getAchievementReport);
router.get('/reports/tuition', controller.getTuitionReport);

// ===================== Admin/Commander: User CRUD (read + update) =====================
router.put('/batch-profiles', controller.updateBatchProfiles);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);

// ===================== Admin only =====================
router.use(requireAdmin);

router.post('/', controller.create);
router.post('/batch', controller.createBatchUsers);
router.post('/batch-users', controller.createBatchUsersProfiles);
router.post('/:id/reset-password', controller.resetPassword);
router.post('/:id/toggle-active', controller.toggleActive);
router.delete('/:id', controller.delete);

module.exports = router;
