const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * {
 *   "/commanders/reports/tuition": {
 *     "get": {
 *       "tags": [
 *         "Reports"
 *       ],
 *       "summary": "CH-09: Xuất báo cáo học phí",
 *       "description": "Admin/Commander tải file Excel báo cáo học phí. Filter: ?schoolYear=&semester=&semesterId=",
 *       "parameters": [
 *         {
 *           "name": "schoolYear",
 *           "in": "query",
 *           "schema": {
 *             "type": "string",
 *             "example": "2025-2026"
 *           }
 *         },
 *         {
 *           "name": "semester",
 *           "in": "query",
 *           "schema": {
 *             "type": "integer",
 *             "example": 1
 *           }
 *         },
 *         {
 *           "name": "semesterId",
 *           "in": "query",
 *           "schema": {
 *             "type": "string",
 *             "format": "uuid"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "File báo cáo học phí",
 *           "content": {
 *             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
 *               "schema": {
 *                 "type": "string",
 *                 "format": "binary"
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */

router.get('/reports/tuition', authMiddleware, requireRole('ADMIN', 'COMMANDER'), controller.exportTuitionReport);

module.exports = router;
