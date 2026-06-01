const router = require('express').Router();
const controller = require('../controllers/tuitionFee.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * {
 *   "/tuition-fees": {
 *     "post": {
 *       "tags": [
 *         "Tuition Fees"
 *       ],
 *       "summary": "CH-07: Ghi nhận học phí",
 *       "requestBody": {
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/TuitionFee"
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
 *         "Tuition Fees"
 *       ],
 *       "summary": "CH-07: Danh sách học phí",
 *       "parameters": [
 *         {
 *           "name": "userId",
 *           "in": "query",
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "status",
 *           "in": "query",
 *           "schema": {
 *             "type": "string",
 *             "enum": [
 *               "PAID",
 *               "UNPAID"
 *             ]
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
 *   "/tuition-fees/batch": {
 *     "post": {
 *       "tags": [
 *         "Tuition Fees"
 *       ],
 *       "summary": "COMMANDER: Nhập học phí hàng loạt theo mã học viên",
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
 *                 "semesterId": {
 *                   "type": "string",
 *                   "format": "uuid"
 *                 },
 *                 "semester": {
 *                   "type": "string"
 *                 },
 *                 "schoolYear": {
 *                   "type": "string"
 *                 },
 *                 "items": {
 *                   "type": "array",
 *                   "items": {
 *                     "type": "object",
 *                     "required": [
 *                       "studentCode"
 *                     ],
 *                     "properties": {
 *                       "studentCode": {
 *                         "type": "string",
 *                         "example": "HV001"
 *                       },
 *                       "totalAmount": {
 *                         "type": "number",
 *                         "example": 2500000
 *                       },
 *                       "content": {
 *                         "type": "string"
 *                       },
 *                       "status": {
 *                         "type": "string",
 *                         "enum": [
 *                           "PAID",
 *                           "UNPAID"
 *                         ]
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
 *   "/tuition-fees/{id}": {
 *     "get": {
 *       "tags": [
 *         "Tuition Fees"
 *       ],
 *       "summary": "Chi tiết học phí",
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
 *         "Tuition Fees"
 *       ],
 *       "summary": "CH-07: Cập nhật trạng thái",
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
 *         "Tuition Fees"
 *       ],
 *       "summary": "Xóa học phí",
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
