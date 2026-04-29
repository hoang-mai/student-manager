const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hệ thống Quản lý Học viên - Student Manager API',
      version: '1.0.0',
      description: `Tài liệu mô tả chi tiết các API của hệ thống quản lý học viên.
      Hệ thống hỗ trợ 3 nhóm người dùng chính: **Quản trị viên**, **Chỉ huy** và **Học viên**.

      Các chức năng chính bao gồm:
      - Quản lý tài khoản và phân quyền (RBAC)
      - Quản lý hồ sơ học viên, điểm số, học kỳ
      - Quản lý đề xuất kết quả học tập và phê duyệt
      - Quản lý lịch học, lịch cắt cơm, lịch trực
      - Quản lý học phí, thành tích
      - Thống kê báo cáo`,
      contact: {
        name: 'Support Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:6868/api',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Xác thực', description: 'Đăng nhập, đăng ký, quản lý token và mật khẩu' },
      { name: 'Người dùng', description: 'Quản lý tài khoản người dùng trong hệ thống (Admin / Chỉ huy)' },
      { name: 'Học viên', description: 'Quản lý hồ sơ, thông tin học viên' },
      { name: 'Điểm số', description: 'Quản lý điểm môn học của học viên' },
      { name: 'Đề xuất điểm', description: 'Học viên đề xuất cập nhật điểm, Chỉ huy phê duyệt' },
      { name: 'Lịch học', description: 'Thời khóa biểu học tập' },
      { name: 'Lịch cắt cơm', description: 'Lịch đăng ký bữa ăn theo ca' },
      { name: 'Học phí', description: 'Quản lý thông tin học phí, thanh toán' },
      { name: 'Thành tích', description: 'Khen thưởng, đề tài khoa học, rèn luyện' },
      { name: 'Lịch trực', description: 'Phân công ca trực cho cán bộ / chỉ huy' },
      { name: 'Trường ĐH', description: 'Quản lý trường đại học liên kết' },
      { name: 'Lớp học', description: 'Quản lý lớp học' },
      { name: 'Học kỳ', description: 'Quản lý học kỳ, niên khóa' },
      { name: 'Môn học', description: 'Quản lý danh mục môn học' },
      { name: 'Báo cáo', description: 'Thống kê tổng hợp dữ liệu' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập token JWT được cấp sau khi đăng nhập. Ví dụ: Bearer eyJhbGciOiJIUzI1NiIs...',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
            phone: { type: 'string', example: '0987654321' },
            avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
            roleId: { type: 'integer', example: 1 },
            isActive: { type: 'boolean', example: true },
            lastLoginAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        StudentProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 2 },
            studentCode: { type: 'string', example: 'HV001' },
            classId: { type: 'integer', example: 1 },
            universityId: { type: 'integer', example: 1 },
            majorId: { type: 'integer', example: 1 },
            academicYearId: { type: 'integer', example: 1 },
            trainingUnitId: { type: 'integer', example: 1 },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
            dateOfBirth: { type: 'string', format: 'date', example: '2000-01-15' },
            idCardNumber: { type: 'string', example: '012345678901' },
            militaryRank: { type: 'string', example: 'Thượng sĩ' },
            unit: { type: 'string', example: 'Đơn vị 1' },
            enrollmentDate: { type: 'string', format: 'date', example: '2023-09-01' },
            status: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'], example: 'STUDYING' },
          },
        },
        Grade: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 1 },
            courseId: { type: 'integer', example: 1 },
            semesterId: { type: 'integer', example: 1 },
            score10: { type: 'number', example: 8.5 },
            score4: { type: 'number', example: 3.5 },
            letterGrade: { type: 'string', example: 'B+' },
            status: { type: 'string', enum: ['PASSED', 'FAILED', 'PENDING'], example: 'PASSED' },
            createdBy: { type: 'integer', example: 1 },
          },
        },
        GradeRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 1 },
            courseId: { type: 'integer', example: 1 },
            semesterId: { type: 'integer', example: 1 },
            requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'], example: 'UPDATE' },
            reason: { type: 'string', example: 'Điểm thi cuối kỳ bị nhập sai' },
            proposedScore10: { type: 'number', example: 8.0 },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
            reviewerId: { type: 'integer', example: null },
            reviewNote: { type: 'string', example: null },
            reviewedAt: { type: 'string', format: 'date-time', example: null },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            classId: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: null },
            courseId: { type: 'integer', example: 1 },
            semesterId: { type: 'integer', example: 1 },
            dayOfWeek: { type: 'integer', minimum: 0, maximum: 6, example: 2, description: '0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7' },
            startTime: { type: 'string', example: '07:00:00' },
            endTime: { type: 'string', example: '09:25:00' },
            room: { type: 'string', example: 'A101' },
            scheduleType: { type: 'string', enum: ['CLASS', 'PERSONAL'], example: 'CLASS' },
          },
        },
        MealSchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 1 },
            scheduleDate: { type: 'string', format: 'date', example: '2024-10-01' },
            session: { type: 'string', enum: ['MORNING', 'NOON', 'AFTERNOON', 'EVENING'], example: 'NOON', description: 'Buổi ăn: Sáng, Trưa, Chiều, Tối' },
            status: { type: 'string', enum: ['REGISTERED', 'CANCELLED'], example: 'REGISTERED' },
          },
        },
        Tuition: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 1 },
            semesterId: { type: 'integer', example: 1 },
            amount: { type: 'number', example: 5000000 },
            paidAmount: { type: 'number', example: 5000000 },
            status: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'], example: 'PAID' },
            dueDate: { type: 'string', format: 'date', example: '2024-10-15' },
            paidAt: { type: 'string', format: 'date-time', example: '2024-10-10T08:00:00Z' },
            note: { type: 'string', example: 'Đã thu đủ' },
          },
        },
        Achievement: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Giải nhất Olympic Toán' },
            achievementType: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'], example: 'REWARD' },
            level: { type: 'string', example: 'Cấp trường' },
            issueDate: { type: 'string', format: 'date', example: '2024-05-20' },
            description: { type: 'string', example: 'Đạt giải trong kỳ thi Olympic Toán toàn trường' },
            fileUrl: { type: 'string', example: 'https://example.com/cert.pdf' },
            createdBy: { type: 'integer', example: 1 },
          },
        },
        DutyRoster: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 3 },
            dutyDate: { type: 'string', format: 'date', example: '2024-10-01' },
            shift: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'], example: 'NIGHT' },
            dutyType: { type: 'string', enum: ['COMMAND', 'SECURITY', 'OTHER'], example: 'COMMAND' },
            note: { type: 'string', example: 'Trực ban đêm' },
            createdBy: { type: 'integer', example: 1 },
          },
        },
        University: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'NEU' },
            name: { type: 'string', example: 'Đại học Kinh tế Quốc dân' },
            address: { type: 'string', example: '207 Giải Phóng, Hà Nội' },
          },
        },
        Class: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'CNTT-K62' },
            name: { type: 'string', example: 'Công nghệ thông tin K62' },
            majorId: { type: 'integer', example: 1 },
            academicYearId: { type: 'integer', example: 1 },
            trainingUnitId: { type: 'integer', example: 1 },
            commanderId: { type: 'integer', example: 2 },
          },
        },
        Semester: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Học kỳ 1 - 2024-2025' },
            academicYearId: { type: 'integer', example: 1 },
            startDate: { type: 'string', format: 'date', example: '2024-09-01' },
            endDate: { type: 'string', format: 'date', example: '2025-01-15' },
            registrationStart: { type: 'string', format: 'date', example: '2024-08-15' },
            registrationEnd: { type: 'string', format: 'date', example: '2024-08-30' },
            examStart: { type: 'string', format: 'date', example: '2024-12-15' },
            examEnd: { type: 'string', format: 'date', example: '2024-12-30' },
            gradeEntryDeadline: { type: 'string', format: 'date', example: '2025-01-10' },
            isActive: { type: 'boolean', example: true },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'IT101' },
            name: { type: 'string', example: 'Nhập môn lập trình' },
            credits: { type: 'integer', example: 3 },
            description: { type: 'string', example: 'Môn học cơ bản về lập trình' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Lỗi xác thực' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Chưa xác thực hoặc token không hợp lệ',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 401, message: 'Token không hợp lệ' },
            },
          },
        },
        ForbiddenError: {
          description: 'Không có quyền truy cập (role không phù hợp)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 403, message: 'Bạn không có quyền truy cập' },
            },
          },
        },
        NotFoundError: {
          description: 'Không tìm thấy tài nguyên',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 404, message: 'Không tìm thấy' },
            },
          },
        },
        ValidationError: {
          description: 'Dữ liệu đầu vào không hợp lệ',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 400, message: 'username là bắt buộc' },
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      // ==================== AUTH ====================
      '/auth/login': {
        post: {
          tags: ['Xác thực'],
          summary: 'Đăng nhập hệ thống',
          description: 'Người dùng đăng nhập bằng username và mật khẩu để nhận JWT token.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string', example: 'admin' },
                    password: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Đăng nhập thành công',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer', example: 200 },
                      message: { type: 'string', example: 'Thành công' },
                      data: {
                        type: 'object',
                        properties: {
                          accessToken: { type: 'string' },
                          refreshToken: { type: 'string' },
                          user: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Xác thực'],
          summary: 'Đăng ký tài khoản mới',
          description: 'Tạo tài khoản người dùng mới. Mặc định vai trò là học viên nếu không chỉ định roleId.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'fullName'],
                  properties: {
                    username: { type: 'string', example: 'hocsinh01' },
                    email: { type: 'string', example: 'hs01@example.com' },
                    password: { type: 'string', example: '123456' },
                    fullName: { type: 'string', example: 'Trần Văn B' },
                    phone: { type: 'string', example: '0912345678' },
                    roleId: { type: 'integer', example: 3, description: 'ID vai trò (1=admin, 2=chi_huy, 3=hoc_vien)' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo tài khoản thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Xác thực'],
          summary: 'Làm mới access token',
          description: 'Dùng refresh token để lấy access token mới khi access token hết hạn.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Refresh thành công' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/auth/change-password': {
        post: {
          tags: ['Xác thực'],
          summary: 'Đổi mật khẩu',
          description: 'Người dùng đã đăng nhập đổi mật khẩu của chính mình.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['oldPassword', 'newPassword'],
                  properties: {
                    oldPassword: { type: 'string', example: 'admin123' },
                    newPassword: { type: 'string', example: 'newpass123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đổi mật khẩu thành công' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      // ==================== USERS ====================
      '/users': {
        get: {
          tags: ['Người dùng'],
          summary: 'Lấy danh sách người dùng',
          description: 'Admin / Chỉ huy xem toàn bộ tài khoản. Hỗ trợ tìm kiếm và phân trang.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo username, fullName, email' },
            { name: 'role', in: 'query', schema: { type: 'string' }, description: 'Lọc theo tên vai trò (admin, chi_huy, hoc_vien)' },
          ],
          responses: {
            200: { description: 'Danh sách người dùng (có phân trang)' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
        post: {
          tags: ['Người dùng'],
          summary: 'Tạo tài khoản mới (Admin/Chỉ huy)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'fullName', 'roleId'],
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    roleId: { type: 'integer', description: '1=admin, 2=chi_huy, 3=hoc_vien' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/users/me': {
        get: {
          tags: ['Người dùng'],
          summary: 'Xem thông tin cá nhân',
          description: 'Người dùng đã đăng nhập xem profile của chính mình, bao gồm cả hồ sơ học viên nếu có.',
          responses: {
            200: { description: 'Thông tin cá nhân' },
          },
        },
        put: {
          tags: ['Người dùng'],
          summary: 'Cập nhật thông tin cá nhân',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                    avatarUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Người dùng'],
          summary: 'Xem chi tiết tài khoản theo ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Thông tin tài khoản' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Người dùng'],
          summary: 'Cập nhật tài khoản',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                    roleId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Người dùng'],
          summary: 'Xóa tài khoản (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/users/{id}/toggle-active': {
        patch: {
          tags: ['Người dùng'],
          summary: 'Khóa / Mở khóa tài khoản',
          description: 'Chuyển đổi trạng thái isActive của tài khoản.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Thay đổi trạng thái thành công' },
          },
        },
      },
      '/users/{id}/reset-password': {
        patch: {
          tags: ['Người dùng'],
          summary: 'Reset mật khẩu',
          description: 'Admin / Chỉ huy reset mật khẩu cho người dùng khác.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    newPassword: { type: 'string', example: '12345678' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Reset thành công' },
          },
        },
      },
      // ==================== STUDENTS ====================
      '/students': {
        get: {
          tags: ['Học viên'],
          summary: 'Lấy danh sách học viên',
          description: 'Xem danh sách hồ sơ học viên với thông tin lớp, trường, chuyên ngành. Hỗ trợ tìm kiếm theo tên/mã học viên.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'classId', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'] } },
          ],
          responses: {
            200: { description: 'Danh sách học viên (có phân trang)' },
          },
        },
        post: {
          tags: ['Học viên'],
          summary: 'Tạo hồ sơ học viên',
          description: 'Gắn thông tin học viên cho một user đã tồn tại.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'studentCode', 'classId'],
                  properties: {
                    userId: { type: 'integer' },
                    studentCode: { type: 'string' },
                    classId: { type: 'integer' },
                    universityId: { type: 'integer' },
                    majorId: { type: 'integer' },
                    academicYearId: { type: 'integer' },
                    trainingUnitId: { type: 'integer' },
                    gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
                    dateOfBirth: { type: 'string', format: 'date' },
                    idCardNumber: { type: 'string' },
                    militaryRank: { type: 'string' },
                    unit: { type: 'string' },
                    enrollmentDate: { type: 'string', format: 'date' },
                    status: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo hồ sơ thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/students/{id}': {
        get: {
          tags: ['Học viên'],
          summary: 'Xem chi tiết hồ sơ học viên',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết học viên' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Học viên'],
          summary: 'Cập nhật hồ sơ học viên',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    studentCode: { type: 'string' },
                    classId: { type: 'integer' },
                    universityId: { type: 'integer' },
                    majorId: { type: 'integer' },
                    academicYearId: { type: 'integer' },
                    trainingUnitId: { type: 'integer' },
                    gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
                    dateOfBirth: { type: 'string', format: 'date' },
                    idCardNumber: { type: 'string' },
                    militaryRank: { type: 'string' },
                    unit: { type: 'string' },
                    enrollmentDate: { type: 'string', format: 'date' },
                    status: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Học viên'],
          summary: 'Xóa hồ sơ học viên (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== GRADES ====================
      '/grades': {
        get: {
          tags: ['Điểm số'],
          summary: 'Lấy danh sách điểm',
          description: 'Xem bảng điểm của học viên theo học kỳ / môn học.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'semesterId', in: 'query', schema: { type: 'integer' } },
            { name: 'courseId', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách điểm (có phân trang)' },
          },
        },
        post: {
          tags: ['Điểm số'],
          summary: 'Nhập điểm môn học',
          description: 'Admin / Chỉ huy nhập điểm cho học viên.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId', 'courseId', 'semesterId'],
                  properties: {
                    studentId: { type: 'integer' },
                    courseId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                    score10: { type: 'number', minimum: 0, maximum: 10 },
                    score4: { type: 'number', minimum: 0, maximum: 4 },
                    letterGrade: { type: 'string' },
                    status: { type: 'string', enum: ['PASSED', 'FAILED', 'PENDING'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Nhập điểm thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/grades/{id}': {
        get: {
          tags: ['Điểm số'],
          summary: 'Xem chi tiết điểm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết điểm' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Điểm số'],
          summary: 'Cập nhật điểm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    score10: { type: 'number', minimum: 0, maximum: 10 },
                    score4: { type: 'number', minimum: 0, maximum: 4 },
                    letterGrade: { type: 'string' },
                    status: { type: 'string', enum: ['PASSED', 'FAILED', 'PENDING'] },
                    courseId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Điểm số'],
          summary: 'Xóa điểm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== GRADE REQUESTS ====================
      '/grade-requests': {
        get: {
          tags: ['Đề xuất điểm'],
          summary: 'Lấy danh sách đề xuất điểm',
          description: 'Học viên xem đề xuất của mình; Chỉ huy / Admin xem toàn bộ để duyệt.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } },
          ],
          responses: {
            200: { description: 'Danh sách đề xuất (có phân trang)' },
          },
        },
        post: {
          tags: ['Đề xuất điểm'],
          summary: 'Tạo đề xuất cập nhật điểm',
          description: 'Học viên gửi yêu cầu thêm/sửa/xóa điểm kèm lý do.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId', 'courseId', 'semesterId', 'requestType'],
                  properties: {
                    studentId: { type: 'integer' },
                    courseId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                    requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] },
                    reason: { type: 'string' },
                    proposedScore10: { type: 'number', minimum: 0, maximum: 10 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo đề xuất thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
          },
        },
      },
      '/grade-requests/{id}': {
        get: {
          tags: ['Đề xuất điểm'],
          summary: 'Xem chi tiết đề xuất',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết đề xuất' },
          },
        },
        delete: {
          tags: ['Đề xuất điểm'],
          summary: 'Xóa đề xuất',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      '/grade-requests/{id}/review': {
        put: {
          tags: ['Đề xuất điểm'],
          summary: 'Phê duyệt / Từ chối đề xuất',
          description: `Chỉ huy / Admin duyệt hoặc từ chối đề xuất.
          Nếu APPROVED, hệ thống tự động cập nhật điểm vào bảng grades.
          Nếu DELETE + APPROVED, hệ thống xóa điểm tương ứng.`,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['APPROVED', 'REJECTED'], example: 'APPROVED' },
                    reviewNote: { type: 'string', example: 'Đã kiểm tra minh chứng, đồng ý cập nhật' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Duyệt thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== SCHEDULES ====================
      '/schedules': {
        get: {
          tags: ['Lịch học'],
          summary: 'Lấy danh sách lịch học',
          description: 'Xem thời khóa biểu theo lớp, học viên hoặc học kỳ.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'classId', in: 'query', schema: { type: 'integer' } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'semesterId', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách lịch học (có phân trang)' },
          },
        },
        post: {
          tags: ['Lịch học'],
          summary: 'Tạo lịch học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['courseId', 'semesterId', 'dayOfWeek', 'startTime', 'endTime'],
                  properties: {
                    classId: { type: 'integer' },
                    studentId: { type: 'integer' },
                    courseId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                    dayOfWeek: { type: 'integer', minimum: 0, maximum: 6, description: '0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7' },
                    startTime: { type: 'string', example: '07:00:00' },
                    endTime: { type: 'string', example: '09:25:00' },
                    room: { type: 'string' },
                    scheduleType: { type: 'string', enum: ['CLASS', 'PERSONAL'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo lịch học thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/schedules/{id}': {
        get: {
          tags: ['Lịch học'],
          summary: 'Xem chi tiết lịch học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết lịch học' },
          },
        },
        put: {
          tags: ['Lịch học'],
          summary: 'Cập nhật lịch học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    classId: { type: 'integer' },
                    studentId: { type: 'integer' },
                    courseId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                    dayOfWeek: { type: 'integer', minimum: 0, maximum: 6 },
                    startTime: { type: 'string' },
                    endTime: { type: 'string' },
                    room: { type: 'string' },
                    scheduleType: { type: 'string', enum: ['CLASS', 'PERSONAL'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Lịch học'],
          summary: 'Xóa lịch học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== MEAL SCHEDULES ====================
      '/meal-schedules': {
        get: {
          tags: ['Lịch cắt cơm'],
          summary: 'Lấy danh sách lịch cắt cơm',
          description: 'Xem lịch đăng ký ăn theo tuần/ngày của học viên.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: {
            200: { description: 'Danh sách lịch cắt cơm (có phân trang)' },
          },
        },
        post: {
          tags: ['Lịch cắt cơm'],
          summary: 'Tạo lịch cắt cơm',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId', 'scheduleDate', 'session'],
                  properties: {
                    studentId: { type: 'integer' },
                    scheduleDate: { type: 'string', format: 'date' },
                    session: { type: 'string', enum: ['MORNING', 'NOON', 'AFTERNOON', 'EVENING'] },
                    status: { type: 'string', enum: ['REGISTERED', 'CANCELLED'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/meal-schedules/{id}': {
        get: {
          tags: ['Lịch cắt cơm'],
          summary: 'Xem chi tiết lịch cắt cơm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết' },
          },
        },
        put: {
          tags: ['Lịch cắt cơm'],
          summary: 'Cập nhật lịch cắt cơm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    scheduleDate: { type: 'string', format: 'date' },
                    session: { type: 'string', enum: ['MORNING', 'NOON', 'AFTERNOON', 'EVENING'] },
                    status: { type: 'string', enum: ['REGISTERED', 'CANCELLED'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Lịch cắt cơm'],
          summary: 'Xóa lịch cắt cơm',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== TUITIONS ====================
      '/tuitions': {
        get: {
          tags: ['Học phí'],
          summary: 'Lấy danh sách học phí',
          description: 'Theo dõi công nợ học phí của học viên theo học kỳ.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'semesterId', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'] } },
          ],
          responses: {
            200: { description: 'Danh sách học phí (có phân trang)' },
          },
        },
        post: {
          tags: ['Học phí'],
          summary: 'Gán học phí cho học viên',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId', 'semesterId', 'amount', 'dueDate'],
                  properties: {
                    studentId: { type: 'integer' },
                    semesterId: { type: 'integer' },
                    amount: { type: 'number', exclusiveMinimum: 0 },
                    paidAmount: { type: 'number' },
                    status: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'] },
                    dueDate: { type: 'string', format: 'date' },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/tuitions/{id}': {
        get: {
          tags: ['Học phí'],
          summary: 'Xem chi tiết học phí',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết học phí' },
          },
        },
        put: {
          tags: ['Học phí'],
          summary: 'Cập nhật học phí / trạng thái thanh toán',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', exclusiveMinimum: 0 },
                    paidAmount: { type: 'number' },
                    status: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'] },
                    dueDate: { type: 'string', format: 'date' },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Học phí'],
          summary: 'Xóa bản ghi học phí',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== ACHIEVEMENTS ====================
      '/achievements': {
        get: {
          tags: ['Thành tích'],
          summary: 'Lấy danh sách thành tích',
          description: 'Xem khen thưởng, giải thưởng và đề tài khoa học của học viên.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'studentId', in: 'query', schema: { type: 'integer' } },
            { name: 'achievementType', in: 'query', schema: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'] } },
          ],
          responses: {
            200: { description: 'Danh sách thành tích (có phân trang)' },
          },
        },
        post: {
          tags: ['Thành tích'],
          summary: 'Thêm thành tích cho học viên',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId', 'title', 'achievementType'],
                  properties: {
                    studentId: { type: 'integer' },
                    title: { type: 'string' },
                    achievementType: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'] },
                    level: { type: 'string' },
                    issueDate: { type: 'string', format: 'date' },
                    description: { type: 'string' },
                    fileUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/achievements/{id}': {
        get: {
          tags: ['Thành tích'],
          summary: 'Xem chi tiết thành tích',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết' },
          },
        },
        put: {
          tags: ['Thành tích'],
          summary: 'Cập nhật thành tích',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    achievementType: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'] },
                    level: { type: 'string' },
                    issueDate: { type: 'string', format: 'date' },
                    description: { type: 'string' },
                    fileUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Thành tích'],
          summary: 'Xóa thành tích',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== DUTY ROSTERS ====================
      '/duty-rosters': {
        get: {
          tags: ['Lịch trực'],
          summary: 'Lấy danh sách lịch trực',
          description: 'Xem bảng phân công trực theo ngày/ca.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'userId', in: 'query', schema: { type: 'integer' } },
            { name: 'dutyDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'shift', in: 'query', schema: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'] } },
          ],
          responses: {
            200: { description: 'Danh sách lịch trực (có phân trang)' },
          },
        },
        post: {
          tags: ['Lịch trực'],
          summary: 'Tạo lịch trực',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'dutyDate', 'shift'],
                  properties: {
                    userId: { type: 'integer' },
                    dutyDate: { type: 'string', format: 'date' },
                    shift: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'] },
                    dutyType: { type: 'string', enum: ['COMMAND', 'SECURITY', 'OTHER'] },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/duty-rosters/{id}': {
        get: {
          tags: ['Lịch trực'],
          summary: 'Xem chi tiết lịch trực',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết' },
          },
        },
        put: {
          tags: ['Lịch trực'],
          summary: 'Cập nhật lịch trực',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'integer' },
                    dutyDate: { type: 'string', format: 'date' },
                    shift: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'] },
                    dutyType: { type: 'string', enum: ['COMMAND', 'SECURITY', 'OTHER'] },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Lịch trực'],
          summary: 'Xóa lịch trực',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
          },
        },
      },
      // ==================== UNIVERSITIES ====================
      '/universities': {
        get: {
          tags: ['Trường ĐH'],
          summary: 'Lấy danh sách trường đại học',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Danh sách trường ĐH (có phân trang)' },
          },
        },
        post: {
          tags: ['Trường ĐH'],
          summary: 'Thêm trường đại học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['code', 'name'],
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    address: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/universities/{id}': {
        get: {
          tags: ['Trường ĐH'],
          summary: 'Xem chi tiết trường ĐH',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết trường ĐH' },
          },
        },
        put: {
          tags: ['Trường ĐH'],
          summary: 'Cập nhật trường ĐH',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    address: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Trường ĐH'],
          summary: 'Xóa trường ĐH (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== CLASSES ====================
      '/classes': {
        get: {
          tags: ['Lớp học'],
          summary: 'Lấy danh sách lớp học',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'majorId', in: 'query', schema: { type: 'integer' } },
            { name: 'academicYearId', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách lớp (có phân trang)' },
          },
        },
        post: {
          tags: ['Lớp học'],
          summary: 'Tạo lớp học mới',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['code', 'name', 'majorId', 'academicYearId'],
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    majorId: { type: 'integer' },
                    academicYearId: { type: 'integer' },
                    trainingUnitId: { type: 'integer' },
                    commanderId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/classes/{id}': {
        get: {
          tags: ['Lớp học'],
          summary: 'Xem chi tiết lớp học (kèm danh sách học viên)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết lớp' },
          },
        },
        put: {
          tags: ['Lớp học'],
          summary: 'Cập nhật lớp học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    majorId: { type: 'integer' },
                    academicYearId: { type: 'integer' },
                    trainingUnitId: { type: 'integer' },
                    commanderId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Lớp học'],
          summary: 'Xóa lớp học (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== SEMESTERS ====================
      '/semesters': {
        get: {
          tags: ['Học kỳ'],
          summary: 'Lấy danh sách học kỳ',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'academicYearId', in: 'query', schema: { type: 'integer' } },
            { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: {
            200: { description: 'Danh sách học kỳ (có phân trang)' },
          },
        },
        post: {
          tags: ['Học kỳ'],
          summary: 'Tạo học kỳ mới',
          description: 'Thiết lập các mốc thời gian: đăng ký môn, thi, nhập điểm.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'academicYearId', 'startDate', 'endDate'],
                  properties: {
                    name: { type: 'string' },
                    academicYearId: { type: 'integer' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    registrationStart: { type: 'string', format: 'date' },
                    registrationEnd: { type: 'string', format: 'date' },
                    examStart: { type: 'string', format: 'date' },
                    examEnd: { type: 'string', format: 'date' },
                    gradeEntryDeadline: { type: 'string', format: 'date' },
                    isActive: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/semesters/{id}': {
        get: {
          tags: ['Học kỳ'],
          summary: 'Xem chi tiết học kỳ',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết học kỳ' },
          },
        },
        put: {
          tags: ['Học kỳ'],
          summary: 'Cập nhật học kỳ',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    academicYearId: { type: 'integer' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    registrationStart: { type: 'string', format: 'date' },
                    registrationEnd: { type: 'string', format: 'date' },
                    examStart: { type: 'string', format: 'date' },
                    examEnd: { type: 'string', format: 'date' },
                    gradeEntryDeadline: { type: 'string', format: 'date' },
                    isActive: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Học kỳ'],
          summary: 'Xóa học kỳ (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== COURSES ====================
      '/courses': {
        get: {
          tags: ['Môn học'],
          summary: 'Lấy danh sách môn học',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Danh sách môn học (có phân trang)' },
          },
        },
        post: {
          tags: ['Môn học'],
          summary: 'Thêm môn học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['code', 'name'],
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    credits: { type: 'integer', default: 0 },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
            400: { $ref: '#/components/responses/ValidationError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/courses/{id}': {
        get: {
          tags: ['Môn học'],
          summary: 'Xem chi tiết môn học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Chi tiết môn học' },
          },
        },
        put: {
          tags: ['Môn học'],
          summary: 'Cập nhật môn học',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    credits: { type: 'integer' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Môn học'],
          summary: 'Xóa môn học (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      // ==================== REPORTS ====================
      '/reports/students': {
        get: {
          tags: ['Báo cáo'],
          summary: 'Thống kê học viên',
          description: 'Tổng số học viên, đang học, đã tốt nghiệp, bảo lưu.',
          responses: {
            200: { description: 'Số liệu thống kê' },
          },
        },
      },
      '/reports/grades': {
        get: {
          tags: ['Báo cáo'],
          summary: 'Thống kê điểm số',
          description: 'Điểm trung bình, số lượng đạt / rớt / chờ xử lý theo học kỳ.',
          parameters: [
            { name: 'semester_id', in: 'query', schema: { type: 'integer' }, description: 'Lọc theo học kỳ' },
          ],
          responses: {
            200: { description: 'Số liệu thống kê điểm' },
          },
        },
      },
      '/reports/tuitions': {
        get: {
          tags: ['Báo cáo'],
          summary: 'Thống kê học phí',
          description: 'Số lượng đã đóng, chưa đóng, đóng một phần.',
          responses: {
            200: { description: 'Số liệu học phí' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
