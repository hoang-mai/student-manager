const swaggerJsdoc = require('swagger-jsdoc');

const basePathItem = {
  get: (tag, summary, queryParams = []) => ({
    tags: [tag],
    summary,
    security: [{ BearerAuth: [] }],
    parameters: [
      { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
      { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ...queryParams,
    ],
    responses: {
      200: { description: 'Thành công' },
      401: { $ref: '#/components/responses/Unauthorized' },
      403: { $ref: '#/components/responses/Forbidden' },
    },
  }),
  post: (tag, summary, schemaRef, requiredFields) => ({
    tags: [tag],
    summary,
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: requiredFields,
            properties: schemaRef,
          },
        },
      },
    },
    responses: {
      201: { description: 'Tạo thành công' },
      400: { $ref: '#/components/responses/BadRequest' },
      401: { $ref: '#/components/responses/Unauthorized' },
      403: { $ref: '#/components/responses/Forbidden' },
    },
  }),
  put: (tag, summary) => ({
    tags: [tag],
    summary,
    security: [{ BearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object' } } },
    },
    responses: {
      200: { description: 'Cập nhật thành công' },
      404: { $ref: '#/components/responses/NotFound' },
      401: { $ref: '#/components/responses/Unauthorized' },
      403: { $ref: '#/components/responses/Forbidden' },
    },
  }),
  getById: (tag, summary) => ({
    tags: [tag],
    summary,
    security: [{ BearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: {
      200: { description: 'Thành công' },
      404: { $ref: '#/components/responses/NotFound' },
      401: { $ref: '#/components/responses/Unauthorized' },
    },
  }),
  delete: (tag, summary) => ({
    tags: [tag],
    summary,
    security: [{ BearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: {
      200: { description: 'Xóa thành công' },
      404: { $ref: '#/components/responses/NotFound' },
      401: { $ref: '#/components/responses/Unauthorized' },
      403: { $ref: '#/components/responses/Forbidden' },
    },
  }),
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Manager API',
      version: '1.0.0',
      description: 'API quản lý học viên - Hệ thống quản lý đào tạo',
    },
    servers: [{ url: 'http://localhost:6868/api', description: 'Local server' }],
    tags: [
      { name: 'Auth', description: 'Xác thực' },
      { name: 'Users', description: 'Ngườ dùng' },
      { name: 'Students', description: 'Học viên' },
      { name: 'Grades', description: 'Điểm số' },
      { name: 'GradeRequests', description: 'Đề xuất điểm' },
      { name: 'Schedules', description: 'Lịch học' },
      { name: 'MealSchedules', description: 'Lịch cắt cơm' },
      { name: 'Tuitions', description: 'Học phí' },
      { name: 'Achievements', description: 'Thành tích' },
      { name: 'DutyRosters', description: 'Lịch trực' },
      { name: 'Universities', description: 'Trường ĐH' },
      { name: 'Classes', description: 'Lớp học' },
      { name: 'Semesters', description: 'Học kỳ' },
      { name: 'Courses', description: 'Môn học' },
      { name: 'Reports', description: 'Báo cáo' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập token JWT. Ví dụ: Bearer eyJhbGciOiJIUzI1NiIs...',
        },
      },
      schemas: {
        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['username', 'email', 'password', 'full_name'],
          properties: {
            username: { type: 'string', minLength: 3, example: 'student01' },
            email: { type: 'string', format: 'email', example: 'sv01@example.com' },
            password: { type: 'string', minLength: 6, example: 'student123' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            phone: { type: 'string', example: '0900000001' },
            role_id: { type: 'integer', example: 3, description: 'Mặc định hoc_vien nếu không truyền' },
          },
        },
        RefreshTokenInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
        ChangePasswordInput: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string', example: 'oldpass123' },
            newPassword: { type: 'string', minLength: 6, example: 'newpass123' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['username', 'email', 'password', 'full_name', 'role_id'],
          properties: {
            username: { type: 'string', minLength: 3, example: 'newuser' },
            email: { type: 'string', format: 'email', example: 'new@example.com' },
            password: { type: 'string', minLength: 6, example: 'pass123456' },
            full_name: { type: 'string', example: 'Ngườ dùng mới' },
            phone: { type: 'string', example: '0900000009' },
            role_id: { type: 'integer', example: 3, description: '1=admin, 2=chi_huy, 3=hoc_vien' },
          },
        },
        StudentInput: {
          type: 'object',
          required: ['user_id', 'student_code', 'class_id'],
          properties: {
            user_id: { type: 'integer', example: 4 },
            student_code: { type: 'string', example: 'HV001' },
            class_id: { type: 'integer', example: 2 },
            university_id: { type: 'integer', example: 1 },
            major_id: { type: 'integer', example: 1 },
            academic_year_id: { type: 'integer', example: 2 },
            training_unit_id: { type: 'integer', example: 1 },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
            date_of_birth: { type: 'string', format: 'date', example: '2005-03-15' },
            id_card_number: { type: 'string', example: '001099000123' },
            military_rank: { type: 'string', example: 'Thượng sĩ' },
            unit: { type: 'string', example: 'Đơn vị 1' },
            enrollment_date: { type: 'string', format: 'date', example: '2024-09-01' },
            status: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'], example: 'STUDYING' },
          },
        },
        GradeInput: {
          type: 'object',
          required: ['student_id', 'course_id', 'semester_id'],
          properties: {
            student_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 3 },
            score_10: { type: 'number', minimum: 0, maximum: 10, example: 8.5 },
            score_4: { type: 'number', minimum: 0, maximum: 4, example: 3.5 },
            letter_grade: { type: 'string', example: 'B+' },
            status: { type: 'string', enum: ['PASSED', 'FAILED', 'PENDING'], example: 'PASSED' },
          },
        },
        GradeRequestInput: {
          type: 'object',
          required: ['student_id', 'course_id', 'semester_id', 'request_type'],
          properties: {
            student_id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 3 },
            request_type: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'], example: 'UPDATE' },
            reason: { type: 'string', example: 'Điểm thi bị nhập sai' },
            proposed_score_10: { type: 'number', minimum: 0, maximum: 10, example: 9.0 },
          },
        },
        GradeRequestReviewInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['APPROVED', 'REJECTED'], example: 'APPROVED' },
            review_note: { type: 'string', example: 'Đã kiểm tra, đồng ý cập nhật' },
          },
        },
        ScheduleInput: {
          type: 'object',
          required: ['course_id', 'semester_id', 'day_of_week', 'start_time', 'end_time'],
          properties: {
            class_id: { type: 'integer', example: 2 },
            student_id: { type: 'integer', example: 1, description: 'Null nếu là lịch lớp' },
            course_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 3 },
            day_of_week: { type: 'integer', minimum: 0, maximum: 6, example: 2, description: '0=Chủ nhật, 1=Thứ 2...' },
            start_time: { type: 'string', example: '07:00:00' },
            end_time: { type: 'string', example: '09:25:00' },
            room: { type: 'string', example: 'A101' },
            schedule_type: { type: 'string', enum: ['CLASS', 'PERSONAL'], example: 'CLASS' },
          },
        },
        MealScheduleInput: {
          type: 'object',
          required: ['student_id', 'schedule_date', 'session'],
          properties: {
            student_id: { type: 'integer', example: 1 },
            schedule_date: { type: 'string', format: 'date', example: '2024-10-01' },
            session: { type: 'string', enum: ['MORNING', 'NOON', 'AFTERNOON', 'EVENING'], example: 'NOON' },
            status: { type: 'string', enum: ['REGISTERED', 'CANCELLED'], example: 'REGISTERED' },
          },
        },
        TuitionInput: {
          type: 'object',
          required: ['student_id', 'semester_id', 'amount', 'due_date'],
          properties: {
            student_id: { type: 'integer', example: 1 },
            semester_id: { type: 'integer', example: 3 },
            amount: { type: 'number', example: 5000000 },
            paid_amount: { type: 'number', example: 5000000 },
            status: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'], example: 'PAID' },
            due_date: { type: 'string', format: 'date', example: '2024-10-15' },
            paid_at: { type: 'string', format: 'date-time' },
            note: { type: 'string', example: 'Đã thu đủ' },
          },
        },
        AchievementInput: {
          type: 'object',
          required: ['student_id', 'title', 'achievement_type'],
          properties: {
            student_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Giải nhất Olympic Tin học' },
            achievement_type: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'], example: 'REWARD' },
            level: { type: 'string', example: 'Cấp trường' },
            issue_date: { type: 'string', format: 'date', example: '2024-05-20' },
            description: { type: 'string', example: 'Đạt giải trong kỳ thi Olympic' },
            file_url: { type: 'string', example: 'https://example.com/cert.pdf' },
          },
        },
        DutyRosterInput: {
          type: 'object',
          required: ['user_id', 'duty_date', 'shift'],
          properties: {
            user_id: { type: 'integer', example: 1 },
            duty_date: { type: 'string', format: 'date', example: '2024-10-01' },
            shift: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'], example: 'NIGHT' },
            duty_type: { type: 'string', enum: ['COMMAND', 'SECURITY', 'OTHER'], example: 'COMMAND' },
            note: { type: 'string', example: 'Trực ban đêm' },
          },
        },
        UniversityInput: {
          type: 'object',
          required: ['code', 'name'],
          properties: {
            code: { type: 'string', example: 'NEU' },
            name: { type: 'string', example: 'Đại học Kinh tế Quốc dân' },
            address: { type: 'string', example: '207 Giải Phóng, Hà Nội' },
          },
        },
        ClassInput: {
          type: 'object',
          required: ['code', 'name', 'major_id', 'academic_year_id'],
          properties: {
            code: { type: 'string', example: 'CNTT-K62' },
            name: { type: 'string', example: 'Công nghệ thông tin K62' },
            major_id: { type: 'integer', example: 1 },
            academic_year_id: { type: 'integer', example: 2 },
            training_unit_id: { type: 'integer', example: 1 },
            commander_id: { type: 'integer', example: 2 },
          },
        },
        SemesterInput: {
          type: 'object',
          required: ['name', 'academic_year_id', 'start_date', 'end_date'],
          properties: {
            name: { type: 'string', example: 'Học kỳ 1 - 2024-2025' },
            academic_year_id: { type: 'integer', example: 2 },
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
        CourseInput: {
          type: 'object',
          required: ['code', 'name'],
          properties: {
            code: { type: 'string', example: 'IT101' },
            name: { type: 'string', example: 'Nhập môn lập trình' },
            credits: { type: 'integer', minimum: 0, example: 3 },
            description: { type: 'string', example: 'Môn học cơ bản về lập trình' },
          },
        },
        ResetPasswordInput: {
          type: 'object',
          properties: {
            newPassword: { type: 'string', example: '12345678', description: 'Mặc định 12345678 nếu không truyền' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Chưa xác thực hoặc token không hợp lệ',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { statusCode: { type: 'integer', example: 401 }, message: { type: 'string', example: 'Token is not valid' } } },
            },
          },
        },
        Forbidden: {
          description: 'Không có quyền truy cập',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { statusCode: { type: 'integer', example: 403 }, message: { type: 'string', example: 'Permission denied' } } },
            },
          },
        },
        NotFound: {
          description: 'Không tìm thấy',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { statusCode: { type: 'integer', example: 404 }, message: { type: 'string', example: 'Not found' } } },
            },
          },
        },
        BadRequest: {
          description: 'Dữ liệu không hợp lệ',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { statusCode: { type: 'integer', example: 400 }, message: { type: 'string', example: 'Validation error' } } },
            },
          },
        },
      },
    },
    paths: {
      // Auth
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
          },
          responses: {
            200: { description: 'Đăng nhập thành công' },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { description: 'Sai mật khẩu' },
          },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng ký tài khoản',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
          },
          responses: {
            201: { description: 'Đăng ký thành công' },
            400: { description: 'Username/email đã tồn tại hoặc validation lỗi' },
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh token',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenInput' } } },
          },
          responses: {
            200: { description: 'Refresh thành công' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/auth/change-password': {
        post: {
          tags: ['Auth'],
          summary: 'Đổi mật khẩu',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordInput' } } },
          },
          responses: {
            200: { description: 'Đổi mật khẩu thành công' },
            401: { description: 'Sai mật khẩu cũ' },
            404: { description: 'Không tìm thấy user' },
          },
        },
      },
      // Users
      '/users': {
        get: basePathItem.get('Users', 'Danh sách ngườ dùng (Admin/Chỉ huy)', [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo username, full_name, email' },
          { name: 'role', in: 'query', schema: { type: 'string' }, description: 'Lọc theo role name (admin, chi_huy, hoc_vien)' },
        ]),
        post: basePathItem.post('Users', 'Tạo user (Admin/Chỉ huy)', '#/components/schemas/UserInput', ['username', 'email', 'password', 'full_name', 'role_id']),
      },
      '/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Xem profile cá nhân',
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: 'Thành công' }, 401: { $ref: '#/components/responses/Unauthorized' } },
        },
        put: {
          tags: ['Users'],
          summary: 'Cập nhật profile cá nhân',
          security: [{ BearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Thành công' }, 404: { $ref: '#/components/responses/NotFound' } },
        },
      },
      '/users/{id}': {
        get: basePathItem.getById('Users', 'Xem user theo ID'),
        put: basePathItem.put('Users', 'Cập nhật user'),
        delete: basePathItem.delete('Users', 'Xóa user (Admin only)'),
      },
      '/users/{id}/toggle-active': {
        patch: {
          tags: ['Users'],
          summary: 'Toggle trạng thái active',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Thành công' }, 404: { $ref: '#/components/responses/NotFound' } },
        },
      },
      '/users/{id}/reset-password': {
        patch: {
          tags: ['Users'],
          summary: 'Reset mật khẩu (Admin/Chỉ huy)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordInput' } } } },
          responses: { 200: { description: 'Thành công' }, 404: { $ref: '#/components/responses/NotFound' } },
        },
      },
      // Students
      '/students': {
        get: basePathItem.get('Students', 'Danh sách học viên', [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo student_code hoặc full_name' },
          { name: 'class_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'] } },
        ]),
        post: basePathItem.post('Students', 'Tạo hồ sơ học viên (Admin/Chỉ huy)', '#/components/schemas/StudentInput', ['user_id', 'student_code', 'class_id']),
      },
      '/students/{id}': {
        get: basePathItem.getById('Students', 'Xem học viên theo ID'),
        put: basePathItem.put('Students', 'Cập nhật học viên'),
        delete: basePathItem.delete('Students', 'Xóa hồ sơ học viên (Admin only)'),
      },
      // Grades
      '/grades': {
        get: basePathItem.get('Grades', 'Danh sách điểm', [
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
          { name: 'course_id', in: 'query', schema: { type: 'integer' } },
        ]),
        post: basePathItem.post('Grades', 'Nhập điểm (Admin/Chỉ huy)', '#/components/schemas/GradeInput', ['student_id', 'course_id', 'semester_id']),
      },
      '/grades/{id}': {
        get: basePathItem.getById('Grades', 'Xem điểm theo ID'),
        put: basePathItem.put('Grades', 'Cập nhật điểm'),
        delete: basePathItem.delete('Grades', 'Xóa điểm'),
      },
      // Grade Requests
      '/grade-requests': {
        get: basePathItem.get('GradeRequests', 'Danh sách đề xuất điểm', [
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } },
        ]),
        post: {
          tags: ['GradeRequests'],
          summary: 'Tạo đề xuất điểm (Học viên)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GradeRequestInput' } } },
          },
          responses: { 201: { description: 'Tạo thành công' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' } },
        },
      },
      '/grade-requests/{id}': {
        get: basePathItem.getById('GradeRequests', 'Xem đề xuất theo ID'),
        delete: basePathItem.delete('GradeRequests', 'Xóa đề xuất'),
      },
      '/grade-requests/{id}/review': {
        put: {
          tags: ['GradeRequests'],
          summary: 'Phê duyệt/Từ chối đề xuất (Admin/Chỉ huy)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GradeRequestReviewInput' } } },
          },
          responses: {
            200: { description: 'Duyệt thành công' },
            400: { description: 'Đã duyệt trước đó hoặc validation lỗi' },
            404: { $ref: '#/components/responses/NotFound' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },
      // Schedules
      '/schedules': {
        get: basePathItem.get('Schedules', 'Danh sách lịch học', [
          { name: 'class_id', in: 'query', schema: { type: 'integer' } },
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
        ]),
        post: basePathItem.post('Schedules', 'Tạo lịch học (Admin/Chỉ huy)', '#/components/schemas/ScheduleInput', ['course_id', 'semester_id', 'day_of_week', 'start_time', 'end_time']),
      },
      '/schedules/{id}': {
        get: basePathItem.getById('Schedules', 'Xem lịch học theo ID'),
        put: basePathItem.put('Schedules', 'Cập nhật lịch học'),
        delete: basePathItem.delete('Schedules', 'Xóa lịch học'),
      },
      // Meal Schedules
      '/meal-schedules': {
        get: basePathItem.get('MealSchedules', 'Danh sách lịch cắt cơm', [
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } },
        ]),
        post: basePathItem.post('MealSchedules', 'Tạo lịch cắt cơm (Admin/Chỉ huy)', '#/components/schemas/MealScheduleInput', ['student_id', 'schedule_date', 'session']),
      },
      '/meal-schedules/{id}': {
        get: basePathItem.getById('MealSchedules', 'Xem lịch cắt cơm theo ID'),
        put: basePathItem.put('MealSchedules', 'Cập nhật lịch cắt cơm'),
        delete: basePathItem.delete('MealSchedules', 'Xóa lịch cắt cơm'),
      },
      // Tuitions
      '/tuitions': {
        get: basePathItem.get('Tuitions', 'Danh sách học phí', [
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'semester_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'UNPAID', 'PARTIAL'] } },
        ]),
        post: basePathItem.post('Tuitions', 'Tạo học phí (Admin/Chỉ huy)', '#/components/schemas/TuitionInput', ['student_id', 'semester_id', 'amount', 'due_date']),
      },
      '/tuitions/{id}': {
        get: basePathItem.getById('Tuitions', 'Xem học phí theo ID'),
        put: basePathItem.put('Tuitions', 'Cập nhật học phí'),
        delete: basePathItem.delete('Tuitions', 'Xóa học phí'),
      },
      // Achievements
      '/achievements': {
        get: basePathItem.get('Achievements', 'Danh sách thành tích', [
          { name: 'student_id', in: 'query', schema: { type: 'integer' } },
          { name: 'achievement_type', in: 'query', schema: { type: 'string', enum: ['REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'] } },
        ]),
        post: basePathItem.post('Achievements', 'Thêm thành tích (Admin/Chỉ huy)', '#/components/schemas/AchievementInput', ['student_id', 'title', 'achievement_type']),
      },
      '/achievements/{id}': {
        get: basePathItem.getById('Achievements', 'Xem thành tích theo ID'),
        put: basePathItem.put('Achievements', 'Cập nhật thành tích'),
        delete: basePathItem.delete('Achievements', 'Xóa thành tích'),
      },
      // Duty Rosters
      '/duty-rosters': {
        get: basePathItem.get('DutyRosters', 'Danh sách lịch trực', [
          { name: 'user_id', in: 'query', schema: { type: 'integer' } },
          { name: 'duty_date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'shift', in: 'query', schema: { type: 'string', enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL'] } },
        ]),
        post: basePathItem.post('DutyRosters', 'Tạo lịch trực (Admin/Chỉ huy)', '#/components/schemas/DutyRosterInput', ['user_id', 'duty_date', 'shift']),
      },
      '/duty-rosters/{id}': {
        get: basePathItem.getById('DutyRosters', 'Xem lịch trực theo ID'),
        put: basePathItem.put('DutyRosters', 'Cập nhật lịch trực'),
        delete: basePathItem.delete('DutyRosters', 'Xóa lịch trực'),
      },
      // Universities
      '/universities': {
        get: basePathItem.get('Universities', 'Danh sách trường ĐH', [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo code hoặc name' },
        ]),
        post: basePathItem.post('Universities', 'Thêm trường ĐH (Admin/Chỉ huy)', '#/components/schemas/UniversityInput', ['code', 'name']),
      },
      '/universities/{id}': {
        get: basePathItem.getById('Universities', 'Xem trường ĐH theo ID'),
        put: basePathItem.put('Universities', 'Cập nhật trường ĐH'),
        delete: basePathItem.delete('Universities', 'Xóa trường ĐH (Admin only)'),
      },
      // Classes
      '/classes': {
        get: basePathItem.get('Classes', 'Danh sách lớp học', [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo code hoặc name' },
          { name: 'major_id', in: 'query', schema: { type: 'integer' } },
          { name: 'academic_year_id', in: 'query', schema: { type: 'integer' } },
        ]),
        post: basePathItem.post('Classes', 'Tạo lớp học (Admin/Chỉ huy)', '#/components/schemas/ClassInput', ['code', 'name', 'major_id', 'academic_year_id']),
      },
      '/classes/{id}': {
        get: basePathItem.getById('Classes', 'Xem lớp học theo ID (kèm danh sách HV)'),
        put: basePathItem.put('Classes', 'Cập nhật lớp học'),
        delete: basePathItem.delete('Classes', 'Xóa lớp học (Admin only)'),
      },
      // Semesters
      '/semesters': {
        get: basePathItem.get('Semesters', 'Danh sách học kỳ', [
          { name: 'academic_year_id', in: 'query', schema: { type: 'integer' } },
          { name: 'is_active', in: 'query', schema: { type: 'boolean' } },
        ]),
        post: basePathItem.post('Semesters', 'Tạo học kỳ (Admin/Chỉ huy)', '#/components/schemas/SemesterInput', ['name', 'academic_year_id', 'start_date', 'end_date']),
      },
      '/semesters/{id}': {
        get: basePathItem.getById('Semesters', 'Xem học kỳ theo ID'),
        put: basePathItem.put('Semesters', 'Cập nhật học kỳ'),
        delete: basePathItem.delete('Semesters', 'Xóa học kỳ (Admin only)'),
      },
      // Courses
      '/courses': {
        get: basePathItem.get('Courses', 'Danh sách môn học', [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm theo code hoặc name' },
        ]),
        post: basePathItem.post('Courses', 'Thêm môn học (Admin/Chỉ huy)', '#/components/schemas/CourseInput', ['code', 'name']),
      },
      '/courses/{id}': {
        get: basePathItem.getById('Courses', 'Xem môn học theo ID'),
        put: basePathItem.put('Courses', 'Cập nhật môn học'),
        delete: basePathItem.delete('Courses', 'Xóa môn học (Admin only)'),
      },
      // Reports
      '/reports/students': {
        get: {
          tags: ['Reports'],
          summary: 'Thống kê học viên',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Tổng số, đang học, tốt nghiệp, bảo lưu' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },
      '/reports/grades': {
        get: {
          tags: ['Reports'],
          summary: 'Thống kê điểm số',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'semester_id', in: 'query', schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Điểm TB, số lượng đạt/rớt/chờ' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },
      '/reports/tuitions': {
        get: {
          tags: ['Reports'],
          summary: 'Thống kê học phí',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Số lượng đã đóng, chưa đóng, một phần' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },
      // Health
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          security: [],
          responses: { 200: { description: 'Server đang chạy' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
