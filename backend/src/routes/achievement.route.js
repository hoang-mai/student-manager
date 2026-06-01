const router = require('express').Router();
const controller = require('../controllers/achievement.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * {
 *   "/achievements": {
 *     "post": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "CH-05: Thêm thành tích",
 *       "requestBody": {
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/Achievement"
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "201": {
 *           "description": "Created"
 *         }
 *       }
 *     },
 *     "get": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "CH-05: Danh sách thành tích",
 *       "parameters": [
 *         {
 *           "name": "userId",
 *           "in": "query",
 *           "schema": {
 *             "type": "string",
 *             "format": "uuid"
 *           }
 *         },
 *         {
 *           "name": "semester",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "schoolYear",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "year",
 *           "in": "query",
 *           "schema": {
 *             "type": "integer"
 *           }
 *         },
 *         {
 *           "name": "award",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "fullName",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "unit",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
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
 *   "/achievements/batch": {
 *     "post": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "COMMANDER: Nhập thành tích hàng loạt theo mã học viên",
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "required": [
 *                 "items"
 *               ],
 *               "properties": {
 *                 "items": {
 *                   "type": "array",
 *                   "items": {
 *                     "type": "object",
 *                     "required": [
 *                       "studentCode"
 *                     ],
 *                     "properties": {
 *                       "studentCode": {
 *                         "type": "string"
 *                       },
 *                       "semester": {
 *                         "type": "string"
 *                       },
 *                       "schoolYear": {
 *                         "type": "string"
 *                       },
 *                       "title": {
 *                         "type": "string"
 *                       },
 *                       "description": {
 *                         "type": "string"
 *                       },
 *                       "award": {
 *                         "type": "string"
 *                       }
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "201": {
 *           "description": "Batch result"
 *         }
 *       }
 *     }
 *   },
 *   "/achievements/{id}": {
 *     "get": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "Chi tiết thành tích",
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
 *         "Achievements"
 *       ],
 *       "summary": "Cập nhật thành tích",
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
 *         "Achievements"
 *       ],
 *       "summary": "Xóa thành tích",
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
router.post('/batch', controller.createBatch);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
