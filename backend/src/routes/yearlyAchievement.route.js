const router = require('express').Router();
const controller = require('../controllers/yearlyAchievement.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * {
 *   "/yearly-achievements": {
 *     "post": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "Thêm thành tích năm",
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
 *       "summary": "Danh sách thành tích năm",
 *       "parameters": [
 *         {
 *           "name": "userId",
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
 *   "/yearly-achievements/full": {
 *     "post": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "Tạo thành tích năm kèm sáng kiến và đề tài khoa học",
 *       "description": "Dùng cho commander nhập full luồng theo mã học viên. API tạo YearlyAchievement, sau đó tạo ScientificTopic và ScientificInitiative thuộc thành tích năm đó.",
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "required": [
 *                 "studentCode",
 *                 "year"
 *               ],
 *               "properties": {
 *                 "studentCode": {
 *                   "type": "string",
 *                   "example": "HV001"
 *                 },
 *                 "userId": {
 *                   "type": "string",
 *                   "format": "uuid"
 *                 },
 *                 "year": {
 *                   "type": "integer",
 *                   "example": 2026
 *                 },
 *                 "decisionNumber": {
 *                   "type": "string"
 *                 },
 *                 "decisionDate": {
 *                   "type": "string",
 *                   "format": "date"
 *                 },
 *                 "title": {
 *                   "type": "string"
 *                 },
 *                 "hasMinistryReward": {
 *                   "type": "boolean"
 *                 },
 *                 "hasNationalReward": {
 *                   "type": "boolean"
 *                 },
 *                 "notes": {
 *                   "type": "string"
 *                 },
 *                 "scientificTopics": {
 *                   "type": "array",
 *                   "items": {
 *                     "type": "object",
 *                     "required": [
 *                       "title"
 *                     ],
 *                     "properties": {
 *                       "title": {
 *                         "type": "string"
 *                       },
 *                       "description": {
 *                         "type": "string"
 *                       },
 *                       "year": {
 *                         "type": "integer"
 *                       },
 *                       "status": {
 *                         "type": "string"
 *                       }
 *                     }
 *                   }
 *                 },
 *                 "scientificInitiatives": {
 *                   "type": "array",
 *                   "items": {
 *                     "type": "object",
 *                     "required": [
 *                       "title"
 *                     ],
 *                     "properties": {
 *                       "title": {
 *                         "type": "string"
 *                       },
 *                       "description": {
 *                         "type": "string"
 *                       },
 *                       "year": {
 *                         "type": "integer"
 *                       },
 *                       "status": {
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
 *           "description": "Created"
 *         }
 *       }
 *     }
 *   },
 *   "/yearly-achievements/{id}": {
 *     "get": {
 *       "tags": [
 *         "Achievements"
 *       ],
 *       "summary": "Chi tiết thành tích năm",
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
 *       "summary": "Cập nhật thành tích năm",
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
 *       "summary": "Xóa thành tích năm",
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
router.post('/full', controller.createFull);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
