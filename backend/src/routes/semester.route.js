const router = require('express').Router();
const controller = require('../controllers/semester.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'COMMANDER'));

/**
 * @swagger
 * /semesters/grade-convert:
 *   post:
 *     tags: [Semesters]
 *     summary: CH-11 - Chuyển đổi điểm (1 giá trị)
 *     description: Chuyển đổi điểm giữa các hệ 10, 4, chữ (A+ đến F). Gửi value, from, to
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Kết quả chuyển đổi
 */
router.post('/grade-convert', controller.convertGrade);

/**
 * @swagger
 * /semesters/grade-convert/batch:
 *   post:
 *     tags: [Semesters]
 *     summary: CH-11 - Chuyển đổi điểm hàng loạt
 *     description: Chuyển đổi nhiều điểm cùng lúc. Gửi mảng grades chứa value, from, to
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Danh sách kết quả chuyển đổi
 */
router.post('/grade-convert/batch', controller.convertMultipleGrades);

/**
 * @swagger
 * /semesters/grade-convert/gpa:
 *   post:
 *     tags: [Semesters]
 *     summary: CH-11 - Tính GPA/CPA nhanh
 *     description: Tính điểm trung bình hệ 4 và hệ 10 từ danh sách điểm. Gửi mảng grades chứa point10, credits
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Kết quả GPA
 */
router.post('/grade-convert/gpa', controller.calculateGpa);

/**
 * @swagger
 * /semesters/grade-convert/table:
 *   get:
 *     tags: [Semesters]
 *     summary: CH-11 - Xem bảng quy đổi điểm
 *     description: Tra cứu bảng quy đổi giữa điểm chữ, hệ 4, hệ 10 kèm khoảng giá trị
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Bảng quy đổi điểm
 */
router.get('/grade-convert/table', controller.getGradeTable);

// CRUD Học kỳ
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
