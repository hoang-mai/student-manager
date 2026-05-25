const router = require('express').Router();
const controller = require('../controllers/cutRice.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * {
 *   "/cut-rice": {
 *     "post": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Thêm lịch cắt cơm",
 *       "responses": {
 *         "201": {
 *           "description": "Created"
 *         }
 *       }
 *     },
 *     "get": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Danh sách lịch cắt cơm (admin)",
 *       "parameters": [
 *         {
 *           "name": "page",
 *           "in": "query",
 *           "schema": {
 *             "type": "integer"
 *           }
 *         },
 *         {
 *           "name": "limit",
 *           "in": "query",
 *           "schema": {
 *             "type": "integer"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "OK"
 *         }
 *       }
 *     }
 *   },
 *   "/cut-rice/export": {
 *     "get": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Xuất Excel lịch cắt cơm",
 *       "responses": {
 *         "200": {
 *           "description": "File Excel"
 *         }
 *       }
 *     }
 *   },
 *   "/cut-rice/{id}": {
 *     "get": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Chi tiết",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "OK"
 *         }
 *       }
 *     },
 *     "put": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Cập nhật",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "OK"
 *         }
 *       }
 *     },
 *     "delete": {
 *       "tags": [
 *         "Cut Rice"
 *       ],
 *       "summary": "Xóa",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "OK"
 *         }
 *       }
 *     }
 *   }
 * }
 */

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'COMMANDER'));

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/export', controller.exportCutRice);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
