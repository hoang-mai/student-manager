const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hệ thống Quản lý Học viên - Student Manager API',
      version: '1.0.0',
      description: `Tài liệu mô tả chi tiết các API của hệ thống quản lý học viên. 
      Hệ thống hỗ trợ 3 nhóm ngườ dùng chính: **Quản trị viên**, **Chỉ huy** và **Học viên**.
      
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
        url: 'http://localhost:3001/api',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Xác thực', description: 'Đăng nhập, đăng ký, quản lý token và mật khẩu' },
      { name: 'Ngườ dùng', description: 'Quản lý tài khoản ngườ dùng trong hệ thống (Admin / Chỉ huy)' },
      { name: 'Học viên', description: 'Quản lý hồ sơ, thông tin học viên' },
      { name: 'Điểm số', description: 'Quản lý điểm môn học của học viên' },
      { name: 'Đề xuất điểm', description: 'Học viên đề xuất cập nhật điểm, Chỉ huy phê duyệt' },
      { name: 'Lịch học', description: 'Thờ khóa biểu học tập' },
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
          description: 'Nhập token JWT đượ cấp sau khi đăng nhập. Ví dụ: Bearer eyJhbGciOiJIUzI1NiIs...',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@example.com' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            phone: { type: 'string', example: '0987654321' },
            avatar_url: { type: 'string', example: 'https://example.com/avatar.jpg' },
            role_id: { type: 'integer', example: 1 },
            is_active: { type: 'boolean', example: true },
            last_login_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        StudentProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 2 },
            student_code: { type: 'string', example: 'HV001' },
            class_id: { type: 'integer', example: 1 },
            university_id: { type: 'integer', example: 1 },
            major_id: { type: 'integer', example: 1 },
            academic_year_id: { type: 'integer', example: 1 },
            training_unit_id: { type: 'integer', example: 1 },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
            date_of_birth: { type: 'string', format: 'date', example: '2000-01-15' },
            id_card_number: { type: 'string', example: '012345678901' },
            military_rank: { type: 'string', example: 'Thượng sĩ' },
            unit: { type: 'string', example: 'Đơn vị 1' },
            enrollment_date: { type: 'string', format: 'date', example: '2023-09-01' },
            status: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'], example: 'STUDYING' },
          },
        },
        Grade: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 1 },
            score_10: { type: 'number', example: 8.5 },
            score_4: { type: 'number', example: 3.5 },
            letter_grade: { type: 'string', example: 'B+' },
            status: { type: 'string', enum: ['PASSED', 'FAILED', 'PENDING'], example: 'PASSED' },
            created_by: { type: 'integer', example: 1 },
          },
        },
        GradeRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 1 },
            request_type: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'], example: 'UPDATE' },
            reason: { type: 'string', example: 'Điểm thi cuối kỳ bị nhập sai' },
            proposed_score_10: { type: 'number', example: 8.0 },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
            reviewer_id: { type: 'integer', example: null },
            review_note: { type: 'string', example: null },
            reviewed_at: { type: 'string', format: 'date-time', example: null },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            class_id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: null },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 1 },
            day_of_week: { type: 'integer', minimum: 0, maximum: 6, example: 2, description: '0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7' },
            start_time: { type: 'string', example: '07:00:00' },
            end_time: { type: 'string', example: '09:25:00' },
            room: { type: 'string', example: 'A101' },
            schedule_type: { type: 'string', enum: ['CLASS', 'PERSONAL'], example: 'CLASS' },
          },
        },
        MealSchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 1 },
            schedule_date: { type: 'string', format: 'date', example: '2024-10-01' },
            session: { type: 'string', enum: ['MORNING', 'NOON', 'AFTERNOON', 'EVENING'], example: 'NOON', description: 'Buổi ăn: Sáng, Trưa, Chiều, Tối' },
            status: { type: 'string', enum: ['REGISTERED', 'CANCELLED'], example: 'REGISTERED' },
          },
        },
        Tuition: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 1 },
            amount: { type: 'number', example: 5000000 },
            paid_amount: { type: 'number', example: 5000000 },
            status: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'], example: 'PAID' },
            due_date: { type: 'string', format: 'date', example: '2024-10-15' },
            paid_at: { type: 'string', format: 'date-time', example: '2024-10-10T08:00:00Z' },
            note: { type: 'string', example: 'Đã thu đủ' },
          },
        },
        Achievement: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Giải nhất Olympic Toán' },
            achievement_type: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'], example: 'REWARD' },
            level: { type: 'string', example: 'Cấp trường' },
            issue_date: { type: 'string', format: 'date', example: '2024-05-20' },
            description: { type: 'string', example: 'Đạt giải trong kỳ thi Olympic Toán toàn trường' },
            file_url: { type: 'string', example: 'https://example.com/cert.pdf' },
          },
        },
        DutyRoster: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 3 },
            duty_date: { type: 'string', format: 'date', example: '2024-10-01' },
            shift: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'], example: 'NIGHT' },
            duty_type: { type: 'string', enum: ['COMMAND', 'SECURITY', 'OTHER'], example: 'COMMAND' },
            note: { type: 'string', example: 'Trực ban đêm' },
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
            major_id: { type: 'integer', example: 1 },
            academic_year_id: { type: 'integer', example: 1 },
            training_unit_id: { type: 'integer', example: 1 },
            commander_id: { type: 'integer', example: 2 },
          },
        },
        Semester: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Học kỳ 1 - 2024-2025' },
            academic_year_id: { type: 'integer', example: 1 },
            start_date: { type: 'string', format: 'date', example: '2024-09-01' },
            end_date: { type: 'string', format: 'date', example: '2025-01-15' },
            registration_start: { type: 'string', format: 'date', example: '2024-08-15' },
            registration_end: { type: 'string', format: 'date', example: '2024-08-30' },
            exam_start: { type: 'string', format: 'date', example: '2024-12-15' },
            exam_end: { type: 'string', format: 'date', example: '2024-12-30' },
            grade_entry_deadline: { type: 'string', format: 'date', example: '2025-01-10' },
            is_active: { type: 'boolean', example: true },
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
              example: { statusCode: 401, message: 'Token is not valid' },
            },
          },
        },
        ForbiddenError: {
          description: 'Không có quyền truy cập (role không phù hợp)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 403, message: 'Permission denied' },
            },
          },
        },
        NotFoundError: {
          description: 'Không tìm thấy tài nguyên',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 404, message: 'Not found' },
            },
          },
        },
        ValidationError: {
          description: 'Dữ liệu đầu vào không hợp lệ',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { statusCode: 400, message: ['username is required'] },
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
          description: 'Ngườ dùng đăng nhập bằng username và mật khẩu để nhận JWT token.',
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
                    password: { type: 'string', example: '12345678' },
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
                      message: { type: 'string', example: 'OK' },
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
          description: 'Tạo tài khoản ngườ dùng mới. Mặc định vai trò là học viên nếu không chỉ định role_id.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'full_name'],
                  properties: {
                    username: { type: 'string', example: 'hocsinh01' },
                    email: { type: 'string', example: 'hs01@example.com' },
                    password: { type: 'string', example: '123456' },
                    full_name: { type: 'string', example: 'Trần Văn B' },
                    phone: { type: 'string', example: '0912345678' },
                    role_id: { type: 'integer', example: 2, description: 'ID vai trò (bắt buộc nếu admin tạo tài khoản)' },
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
          description: 'Ngườ dùng đã đăng nhập đổi mật khẩu của chính mình.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['oldPassword', 'newPassword'],
                  properties: {
                    oldPassword: { type: 'string', example: '12345678' },
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
          tags: ['Ngườ dùng'],
          summary: 'Lấy danh sách ngườ dùng',
          description: 'Admin / Chỉ huy xem toàn bộ tài khoản. Hỗ trợ tìm kiếm và phân trang.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo username, full_name, email' },
            { name: 'role', in: 'query', schema: { type: 'string' }, description: 'Lọc theo tên vai trò (admin, chi_huy, hoc_vien)' },
          ],
          responses: {
            200: { description: 'Danh sách ngườ dùng' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
        post: {
          tags: ['Ngườ dùng'],
          summary: 'Tạo tài khoản mới (Admin/Chỉ huy)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'full_name', 'role_id'],
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    full_name: { type: 'string' },
                    phone: { type: 'string' },
                    role_id: { type: 'integer', description: '1=admin, 2=chi_huy, 3=hoc_vien' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
          },
        },
      },
      '/users/me': {
        get: {
          tags: ['Ngườ dùng'],
          summary: 'Xem thông tin cá nhân',
          description: 'Ngườ dùng đã đăng nhập xem profile của chính mình, bao gồm cả hồ sơ học viên nếu có.',
          responses: {
            200: { description: 'Thông tin cá nhân' },
          },
        },
        put: {
          tags: ['Ngườ dùng'],
          summary: 'Cập nhật thông tin cá nhân',
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Ngườ dùng'],
          summary: 'Xem chi tiết tài khoản theo ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Thông tin tài khoản' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Ngườ dùng'],
          summary: 'Cập nhật tài khoản',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Ngườ dùng'],
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
          tags: ['Ngườ dùng'],
          summary: 'Khóa / Mở khóa tài khoản',
          description: 'Chuyển đổi trạng thái is_active của tài khoản.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Thay đổi trạng thái thành công' },
          },
        },
      },
      '/users/{id}/reset-password': {
        patch: {
          tags: ['Ngườ dùng'],
          summary: 'Reset mật khẩu',
          description: 'Admin / Chỉ huy reset mật khẩu về mặc định (hoặc mật khẩu mới được cung cấp).',
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
            { name: 'class_id', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'] } },
          ],
          responses: {
            200: { description: 'Danh sách học viên' },
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
                schema: { $ref: '#/components/schemas/StudentProfile' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo hồ sơ thành công' },
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
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Học viên'],
          summary: 'Xóa hồ sơ học viên',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
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
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
            { name: 'course_id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách điểm' },
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
                schema: { $ref: '#/components/schemas/Grade' },
              },
            },
          },
          responses: {
            201: { description: 'Nhập điểm thành công' },
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
          description: 'Học viên xem đề xuất của mình; Chỉ huy xem toàn bộ để duyệt.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } },
          ],
          responses: {
            200: { description: 'Danh sách đề xuất' },
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
                schema: { $ref: '#/components/schemas/GradeRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo đề xuất thành công' },
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
          description: `Chỉ huy duyệt hoặc từ chối đề xuất. 
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
                    review_note: { type: 'string', example: 'Đã kiểm tra minh chứng, đồng ý cập nhật' },
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
          description: 'Xem thờ khóa biểu theo lớp, học viên hoặc học kỳ.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'class_id', in: 'query', schema: { type: 'integer' } },
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách lịch học' },
          },
        },
        post: {
          tags: ['Lịch học'],
          summary: 'Tạo lịch học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Schedule' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo lịch học thành công' },
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
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: {
            200: { description: 'Danh sách lịch cắt cơm' },
          },
        },
        post: {
          tags: ['Lịch cắt cơm'],
          summary: 'Tạo lịch cắt cơm',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MealSchedule' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
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
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'] } },
          ],
          responses: {
            200: { description: 'Danh sách học phí' },
          },
        },
        post: {
          tags: ['Học phí'],
          summary: 'Gán học phí cho học viên',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Tuition' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
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
            { name: 'student_id', in: 'query', schema: { type: 'integer' } },
            { name: 'achievement_type', in: 'query', schema: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'] } },
          ],
          responses: {
            200: { description: 'Danh sách thành tích' },
          },
        },
        post: {
          tags: ['Thành tích'],
          summary: 'Thêm thành tích cho học viên',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Achievement' },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
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
            { name: 'user_id', in: 'query', schema: { type: 'integer' } },
            { name: 'duty_date', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'shift', in: 'query', schema: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'] } },
          ],
          responses: {
            200: { description: 'Danh sách lịch trực' },
          },
        },
        post: {
          tags: ['Lịch trực'],
          summary: 'Tạo lịch trực',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DutyRoster' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
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
            200: { description: 'Danh sách trường ĐH' },
          },
        },
        post: {
          tags: ['Trường ĐH'],
          summary: 'Thêm trường đại học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
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
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Trường ĐH'],
          summary: 'Xóa trường ĐH (Admin)',
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
            { name: 'major_id', in: 'query', schema: { type: 'integer' } },
            { name: 'academic_year_id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Danh sách lớp' },
          },
        },
        post: {
          tags: ['Lớp học'],
          summary: 'Tạo lớp học mới',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Class' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
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
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Lớp học'],
          summary: 'Xóa lớp học (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
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
            { name: 'academic_year_id', in: 'query', schema: { type: 'integer' } },
            { name: 'is_active', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: {
            200: { description: 'Danh sách học kỳ' },
          },
        },
        post: {
          tags: ['Học kỳ'],
          summary: 'Tạo học kỳ mới',
          description: 'Thiết lập các mốc thờ gian: đăng ký môn, thi, nhập điểm.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Semester' },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công' },
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
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Học kỳ'],
          summary: 'Xóa học kỳ (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
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
            200: { description: 'Danh sách môn học' },
          },
        },
        post: {
          tags: ['Môn học'],
          summary: 'Thêm môn học',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Course' },
              },
            },
          },
          responses: {
            201: { description: 'Thêm thành công' },
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
          responses: {
            200: { description: 'Cập nhật thành công' },
          },
        },
        delete: {
          tags: ['Môn học'],
          summary: 'Xóa môn học (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Xóa thành công' },
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
            200: {
              description: 'Số liệu thống kê',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      data: {
                        type: 'object',
                        properties: {
                          totalStudents: { type: 'integer' },
                          studying: { type: 'integer' },
                          graduated: { type: 'integer' },
                          suspended: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
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
            200: {
              description: 'Số liệu thống kê điểm',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      data: {
                        type: 'object',
                        properties: {
                          averageScore10: { type: 'number' },
                          passed: { type: 'integer' },
                          failed: { type: 'integer' },
                          pending: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/reports/tuitions': {
        get: {
          tags: ['Báo cáo'],
          summary: 'Thống kê học phí',
          description: 'Số lượng đã đóng, chưa đóng, đóng một phần.',
          responses: {
            200: {
              description: 'Số liệu học phí',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      data: {
                        type: 'object',
                        properties: {
                          paid: { type: 'integer' },
                          unpaid: { type: 'integer' },
                          partial: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
