const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Manager API',
      version: '2.0.0',
      description: `
# Hệ thống Quản lý Học viên

API cho 3 nhóm: **Học viên**, **Chỉ huy**, **Quản trị viên**

## Kiến trúc
- **User** 1:1 **Profile** (gộp Student + Commander)
- Child models (YearlyResult, TimeTable, CutRice, ...) → FK: \`userId\`
- Profile → FK: \`classId\`, \`organizationId\`, \`universityId\`, \`educationLevelId\`

## Auth
- Bearer token: \`Authorization: Bearer <token>\`
- Login: \`POST /api/auth/login\` → accessToken (5h) + refreshToken (7d)
`,
    },
    servers: [{ url: 'http://localhost:6868/api', description: 'Local' }],
    tags: [
      { name: 'Auth', description: 'HV-01: Đăng nhập & Quản lý tài khoản' },
      { name: 'Profile', description: 'HV-02: Thông tin cá nhân' },
      { name: 'Notifications', description: 'HV-09: Thông báo' },
      { name: 'Users', description: 'CH-01, QTV-02: Quản lý tài khoản người dùng' },
      { name: 'Profiles', description: 'CH-03: Quản lý hồ sơ (gộp Student + Commander)' },
      { name: 'Grade Requests', description: 'HV-04/05 + CH-04: Đề xuất & Phê duyệt KQHT' },
      { name: 'Reports', description: 'CH-09: Thống kê & Báo cáo' },
      { name: 'Cut Rice', description: 'HV-07 + CH-06: Lịch cắt cơm' },
      { name: 'Universities', description: 'CH-02: Trường đại học' },
      { name: 'Organizations', description: 'CH-02: Đơn vị/Khoa' },
      { name: 'Education Levels', description: 'CH-02: Trình độ đào tạo' },
      { name: 'Classes', description: 'CH-02: Lớp học' },
      { name: 'Semesters', description: 'CH-08 + CH-11: Học kỳ & Tiện ích điểm' },
      { name: 'Time Tables', description: 'Thời khóa biểu' },
      { name: 'Tuition Fees', description: 'CH-07: Học phí' },
      { name: 'Achievements', description: 'CH-05: Thành tích' },
      { name: 'Duty Schedules', description: 'CH-10: Lịch trực' },
      { name: 'Academic Results', description: 'HV-03: Kết quả học tập' },
      { name: 'Resources', description: 'CRUD chung: yearly-results, semester-results, subject-results, scientific...' },
    ],
    components: {
      securitySchemes: { BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Error: { type: 'object', properties: { success: { type: 'boolean' }, statusCode: { type: 'integer' }, message: { type: 'string' } } },
        Pagination: { type: 'object', properties: { pageIndex: { type: 'integer' }, pageSize: { type: 'integer' }, totalPages: { type: 'integer' }, total: { type: 'integer' } } },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' }, username: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] },
            isAdmin: { type: 'boolean' }, profileId: { type: 'string', format: 'uuid' },
            isActive: { type: 'boolean' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' }, code: { type: 'string', description: 'Mã HV/CH' },
            fullName: { type: 'string' }, email: { type: 'string' }, gender: { type: 'string' },
            birthday: { type: 'string', format: 'date' }, hometown: { type: 'string' },
            ethnicity: { type: 'string' }, religion: { type: 'string' },
            currentAddress: { type: 'string' }, placeOfBirth: { type: 'string' },
            phoneNumber: { type: 'string' }, cccd: { type: 'string' },
            partyMemberCardNumber: { type: 'string' },
            unit: { type: 'string' }, rank: { type: 'string' },
            positionGovernment: { type: 'string' }, positionParty: { type: 'string' },
            fullPartyMember: { type: 'string', format: 'date' },
            probationaryPartyMember: { type: 'string', format: 'date' },
            dateOfEnlistment: { type: 'string', format: 'date' },
            avatar: { type: 'string' },
            enrollment: { type: 'integer', description: 'Khóa học (Student)' },
            graduationDate: { type: 'string', format: 'date' },
            currentCpa4: { type: 'number' }, currentCpa10: { type: 'number' },
            familyMember: { type: 'object' }, foreignRelations: { type: 'object' },
            startWork: { type: 'integer', description: 'Năm bắt đầu công tác (Commander)' },
            organization: { type: 'string', description: 'Cơ quan (Commander)' },
            classId: { type: 'string', format: 'uuid' }, organizationId: { type: 'string', format: 'uuid' },
            universityId: { type: 'string', format: 'uuid' }, educationLevelId: { type: 'string', format: 'uuid' },
          },
        },
        YearlyResult: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, schoolYear: { type: 'string' }, averageGrade4: { type: 'number' }, averageGrade10: { type: 'number' }, cumulativeGrade4: { type: 'number' }, cumulativeGrade10: { type: 'number' }, cumulativeCredits: { type: 'integer' }, totalCredits: { type: 'integer' }, passedSubjects: { type: 'integer' }, failedSubjects: { type: 'integer' }, debtCredits: { type: 'integer' }, partyRating: { type: 'string' }, trainingRating: { type: 'string' } } },
        SemesterResult: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, yearlyResultId: { type: 'string' }, totalCredits: { type: 'integer' }, averageGrade4: { type: 'number' }, averageGrade10: { type: 'number' }, cumulativeCredits: { type: 'integer' }, cumulativeGrade4: { type: 'number' }, cumulativeGrade10: { type: 'number' }, debtCredits: { type: 'integer' }, failedSubjects: { type: 'integer' } } },
        SubjectResult: { type: 'object', properties: { id: { type: 'string' }, semesterResultId: { type: 'string' }, subjectCode: { type: 'string' }, subjectName: { type: 'string' }, credits: { type: 'integer' }, letterGrade: { type: 'string' }, gradePoint4: { type: 'number' }, gradePoint10: { type: 'number' } } },
        Semester: { type: 'object', properties: { id: { type: 'string' }, code: { type: 'string', example: '2024-2025-HK1' }, schoolYear: { type: 'string', example: '2024-2025' } } },
        TimeTable: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, schedules: { type: 'array', items: { type: 'object', properties: { day: { type: 'string' }, startTime: { type: 'string' }, endTime: { type: 'string' }, room: { type: 'string' }, subjectName: { type: 'string' } } } } } },
        TuitionFee: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, totalAmount: { type: 'number' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, content: { type: 'string' }, status: { type: 'string', enum: ['PAID', 'UNPAID'] } } },
        Achievement: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, title: { type: 'string' }, award: { type: 'string' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, year: { type: 'integer' }, content: { type: 'string' }, description: { type: 'string' } } },
        CutRice: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, weekly: { type: 'object' }, isAutoGenerated: { type: 'boolean' }, lastUpdated: { type: 'string' }, notes: { type: 'string' } } },
        DutySchedule: { type: 'object', properties: { id: { type: 'integer' }, fullName: { type: 'string' }, rank: { type: 'string' }, phoneNumber: { type: 'string' }, position: { type: 'string' }, workDay: { type: 'string' } } },
        Notification: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, type: { type: 'string', enum: ['GRADE', 'CUT_RICE', 'ACHIEVEMENT', 'TUITION', 'GENERAL'] }, isRead: { type: 'boolean' } } },
        GradeRequest: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, subjectResultId: { type: 'string' }, requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] }, reason: { type: 'string' }, proposedLetterGrade: { type: 'string' }, proposedGradePoint4: { type: 'number' }, proposedGradePoint10: { type: 'number' }, attachmentUrl: { type: 'string' }, status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] }, reviewerId: { type: 'string' }, reviewNote: { type: 'string' }, reviewedAt: { type: 'string' } } },
      },
      responses: {
        400: { description: 'Lỗi dữ liệu', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        401: { description: 'Chưa xác thực', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        403: { description: 'Không có quyền', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        404: { description: 'Không tìm thấy', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      },
    },
    security: [{ BearerAuth: [] }],
    paths: {
      // ═══════════ AUTH (HV-01) ═══════════
      '/auth/login': {
        post: {
          tags: ['Auth'], summary: 'HV-01: Đăng nhập', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string', example: 'hv001' }, password: { type: 'string', example: 'hocvien123' } } } } } },
          responses: { 200: { description: 'accessToken + refreshToken + user' } },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Auth'], summary: 'HV-01: Đăng ký', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string', minLength: 6 }, role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] }, fullName: { type: 'string' }, email: { type: 'string' }, code: { type: 'string', description: 'Mã HV/CH' } } } } } },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/auth/refresh-token': {
        post: { tags: ['Auth'], summary: 'HV-01: Làm mới token', security: [], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/auth/change-password': {
        post: { tags: ['Auth'], summary: 'HV-01: Đổi mật khẩu', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['oldPassword', 'newPassword'], properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string', minLength: 6 } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/auth/me': {
        get: { tags: ['Auth'], summary: 'HV-01: Thông tin người dùng hiện tại', description: 'User kèm Profile + nested University, Class, Organization, EducationLevel.', responses: { 200: { description: 'OK' } } },
      },
      '/auth/profile': {
        get: { tags: ['Auth', 'Profile'], summary: 'HV-02: Xem hồ sơ cá nhân', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Auth', 'Profile'], summary: 'HV-02: Cập nhật hồ sơ', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { currentAddress: { type: 'string' }, phoneNumber: { type: 'string' }, email: { type: 'string' }, rank: { type: 'string' }, unit: { type: 'string' }, positionGovernment: { type: 'string' }, positionParty: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ NOTIFICATIONS (HV-09) ═══════════
      '/auth/notifications': {
        get: { tags: ['Notifications'], summary: 'HV-09: Danh sách thông báo', parameters: [{ name: 'type', in: 'query', schema: { type: 'string', enum: ['GRADE', 'CUT_RICE', 'ACHIEVEMENT', 'TUITION', 'GENERAL'] } }, { name: 'isRead', in: 'query', schema: { type: 'boolean' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      },
      '/auth/notifications/read-all': {
        put: { tags: ['Notifications'], summary: 'HV-09: Đánh dấu tất cả đã đọc', responses: { 200: { description: 'OK' } } },
      },
      '/auth/notifications/{id}': {
        get: { tags: ['Notifications'], summary: 'HV-09: Chi tiết thông báo (tự động đánh dấu đọc)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Notifications'], summary: 'HV-09: Xóa thông báo', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/auth/notifications/{id}/read': {
        put: { tags: ['Notifications'], summary: 'HV-09: Đánh dấu 1 thông báo đã đọc', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ USERS (CH-01, QTV) ═══════════
      '/users': {
        get: {
          tags: ['Users'], summary: 'CH-01: Danh sách tài khoản',
          parameters: [{ name: 'username', in: 'query', schema: { type: 'string' } }, { name: 'role', in: 'query', schema: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'User[] + Profile (nested University/Class/Org/EduLevel)' } },
        },
        post: {
          tags: ['Users'], summary: 'CH-01: Tạo tài khoản + tự động tạo Profile',
          description: 'Nếu role=STUDENT/COMMANDER và có fullName → tự tạo Profile. code tự sinh nếu không cung cấp.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string', minLength: 6 }, role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] }, fullName: { type: 'string' }, email: { type: 'string' }, code: { type: 'string' }, classId: { type: 'string' }, organizationId: { type: 'string' }, universityId: { type: 'string' }, educationLevelId: { type: 'string' }, phoneNumber: { type: 'string' }, unit: { type: 'string' }, rank: { type: 'string' }, enrollment: { type: 'integer' } } } } } },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/users/batch': {
        post: { tags: ['Users'], summary: 'CH-01: Tạo hàng loạt (deprecated)', description: 'Mỗi user có thể kèm fullName/email để tự tạo Profile.', deprecated: true, requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { users: { type: 'array', items: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' }, role: { type: 'string' }, fullName: { type: 'string' }, email: { type: 'string' }, code: { type: 'string' } } } } } } } } }, responses: { 201: { description: 'Created [{username, status}]' } } },
      },
      '/users/batch-users': {
        post: {
          tags: ['Users'],
          summary: 'CH-01: Tạo hàng loạt user + profile',
          description: 'Tạo danh sách tài khoản kèm hồ sơ học viên. Mỗi item được xử lý độc lập, item lỗi không ảnh hưởng item khác.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['users'],
                  properties: {
                    users: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['username'],
                        properties: {
                          username: { type: 'string', description: 'Tên đăng nhập' },
                          password: { type: 'string', description: 'Mật khẩu (mặc định 123456)' },
                          role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'], default: 'STUDENT' },
                          fullName: { type: 'string', description: 'Họ tên' },
                          email: { type: 'string' },
                          code: { type: 'string', description: 'Mã HV/CH (tự sinh nếu không cung cấp)' },
                          phoneNumber: { type: 'string' },
                          gender: { type: 'string' },
                          birthday: { type: 'string', format: 'date' },
                          hometown: { type: 'string' },
                          enrollment: { type: 'integer' },
                          classId: { type: 'string', format: 'uuid' },
                          organizationId: { type: 'string', format: 'uuid' },
                          universityId: { type: 'string', format: 'uuid' },
                          educationLevelId: { type: 'string', format: 'uuid' },
                        },
                      },
                    },
                  },
                },
                example: {
                  users: [
                    {
                      username: 'hv001',
                      password: '123456',
                      role: 'STUDENT',
                      fullName: 'Nguyễn Văn A',
                      email: 'a@example.com',
                      code: 'HV001',
                      phoneNumber: '0123456789',
                      gender: 'Nam',
                      birthday: '2000-01-01',
                      hometown: 'Hà Nội',
                      enrollment: 2024,
                    },
                  ],
                },
              },
            },
          },
          responses: {
            201: { description: '[{ id, username, profileId, status }]' },
            400: { $ref: '#/components/responses/400' },
            401: { $ref: '#/components/responses/401' },
            403: { $ref: '#/components/responses/403' },
          },
        },
      },
      '/users/batch-profiles': {
        put: {
          tags: ['Users'],
          summary: 'CH-01: Cập nhật hàng loạt profile theo mã code',
          description: 'Cập nhật thông tin hồ sơ hàng loạt dựa trên mã code (mã HV/CH). Mỗi item được xử lý độc lập, item lỗi không ảnh hưởng item khác.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['code'],
                    properties: {
                      code: { type: 'string', description: 'Mã HV/CH để xác định hồ sơ' },
                      fullName: { type: 'string' },
                      email: { type: 'string' },
                      phoneNumber: { type: 'string' },
                      gender: { type: 'string' },
                      birthday: { type: 'string', format: 'date' },
                      hometown: { type: 'string' },
                      ethnicity: { type: 'string' },
                      religion: { type: 'string' },
                      currentAddress: { type: 'string' },
                      placeOfBirth: { type: 'string' },
                      cccd: { type: 'string' },
                      partyMemberCardNumber: { type: 'string' },
                      unit: { type: 'string' },
                      rank: { type: 'string' },
                      positionGovernment: { type: 'string' },
                      positionParty: { type: 'string' },
                      fullPartyMember: { type: 'string', format: 'date' },
                      probationaryPartyMember: { type: 'string', format: 'date' },
                      dateOfEnlistment: { type: 'string', format: 'date' },
                      enrollment: { type: 'integer' },
                      graduationDate: { type: 'string', format: 'date' },
                      currentCpa4: { type: 'number' },
                      currentCpa10: { type: 'number' },
                      classId: { type: 'string', format: 'uuid' },
                      organizationId: { type: 'string', format: 'uuid' },
                      universityId: { type: 'string', format: 'uuid' },
                      educationLevelId: { type: 'string', format: 'uuid' },
                    },
                  },
                },
                example: [
                  { code: 'HV001', phoneNumber: '0987654321', currentAddress: '123 Đường Mới' },
                  { code: 'HV002', email: 'updated@example.com', rank: 'Thượng sĩ' },
                ],
              },
            },
          },
          responses: {
            200: { description: '[{ code, status }]' },
            400: { $ref: '#/components/responses/400' },
            401: { $ref: '#/components/responses/401' },
            403: { $ref: '#/components/responses/403' },
          },
        },
      },
      '/users/{id}': {
        get: { tags: ['Users'], summary: 'Chi tiết tài khoản (kèm Profile + University/Class/Org/EduLevel)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Users'], summary: 'Cập nhật tài khoản + Profile (nếu có fullName/email...)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Users'], summary: 'Xóa tài khoản (soft delete)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/users/{id}/reset-password': {
        post: { tags: ['Users'], summary: 'CH-01: Reset mật khẩu', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { newPassword: { type: 'string', minLength: 6 } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/users/{id}/toggle-active': {
        post: { tags: ['Users'], summary: 'CH-01: Khóa/Mở khóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ PROFILE (HV-02 + CH-03) ═══════════
      '/users/profile': {
        get: { tags: ['Profile'], summary: 'HV-02: Xem hồ sơ cá nhân', description: 'STUDENT/COMMANDER role.', responses: { 200: { description: 'Profile' } } },
        put: { tags: ['Profile'], summary: 'HV-02: Cập nhật hồ sơ cá nhân', description: 'Cập nhật mọi field của Profile.', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/users/avatar': {
        post: { tags: ['Profile'], summary: 'HV-02: Upload avatar', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { avatar: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/users/academic-results': {
        get: { tags: ['Profile'], summary: 'HV-03: Xem kết quả học tập', description: 'KQHT theo năm học, kèm semester→subject. Filter: ?schoolYear=', parameters: [{ name: 'schoolYear', in: 'query', schema: { type: 'string', example: '2024-2025' } }], responses: { 200: { description: 'OK' } } },
      },
      '/users/time-table': {
        get: { tags: ['Profile'], summary: 'HV-06: Xem lịch học', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Profile'], summary: 'HV-06: Thêm môn học', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { schedules: { type: 'array', items: { type: 'object', properties: { day: { type: 'string' }, startTime: { type: 'string' }, endTime: { type: 'string' }, room: { type: 'string' } } } } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/users/time-table/{id}': {
        put: { tags: ['Profile'], summary: 'HV-06: Sửa môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Profile'], summary: 'HV-06: Xóa môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/users/cut-rice': {
        get: { tags: ['Cut Rice'], summary: 'HV-07: Xem lịch cắt cơm', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Cut Rice'], summary: 'HV-07: Cập nhật lịch cắt cơm', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { weekly: { type: 'object' } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/users/achievements': {
        get: { tags: ['Profile'], summary: 'HV-08: Xem thành tích', responses: { 200: { description: 'OK' } } },
      },
      '/users/tuition-fees': {
        get: { tags: ['Profile'], summary: 'HV-08: Xem học phí', responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ PROFILES (CH-03: Quản lý hồ sơ) ═══════════
      '/users/profiles': {
        get: {
          tags: ['Profiles'], summary: 'CH-03: Danh sách hồ sơ',
          description: 'Filter: ?code=&fullName=&gender=&unit=&rank=&classId=&organizationId=&universityId=',
          parameters: [{ name: 'code', in: 'query', schema: { type: 'string' } }, { name: 'fullName', in: 'query', schema: { type: 'string' } }, { name: 'unit', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'Profile[]' } },
        },
      },
      '/users/profiles/export': {
        get: { tags: ['Profiles'], summary: 'CH-03: Xuất Excel danh sách hồ sơ', parameters: [{ name: 'fields', in: 'query', schema: { type: 'string' } }, { name: 'unit', in: 'query', schema: { type: 'string' } }, { name: 'fullName', in: 'query', schema: { type: 'string' } }, { name: 'code', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'File Excel (.xlsx)' } } },
      },
      '/users/profiles/{id}': {
        get: { tags: ['Profiles'], summary: 'CH-03: Chi tiết hồ sơ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Profiles'], summary: 'CH-03: Cập nhật hồ sơ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Profiles'], summary: 'CH-03: Xóa hồ sơ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ CUT RICE (CH-06) ═══════════
      '/users/cut-rice/generate/{userId}': {
        post: { tags: ['Cut Rice'], summary: 'CH-06: Tạo lịch cắt cơm cho 1 user', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/users/cut-rice/generate-all': {
        post: { tags: ['Cut Rice'], summary: 'CH-06: Tạo lịch cắt cơm cho TẤT CẢ', responses: { 200: { description: '{success, skipped}' } } },
      },

      // ═══════════ REPORTS (CH-09) ═══════════
      '/users/reports/academic': {
        get: { tags: ['Reports'], summary: 'CH-09: Báo cáo KQHT', parameters: [{ name: 'schoolYear', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: '{detail, summary}' } } },
      },
      '/users/reports/achievements': {
        get: { tags: ['Reports'], summary: 'CH-09: Báo cáo Thành tích', responses: { 200: { description: '{achievements, yearlyAchievements, summary}' } } },
      },
      '/users/reports/party-training': {
        get: { tags: ['Reports'], summary: 'CH-09: Báo cáo Xếp loại Đảng/Rèn luyện', parameters: [{ name: 'schoolYear', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: '{detail, partySummary, trainingSummary}' } } },
      },
      '/users/reports/tuition': {
        get: { tags: ['Reports'], summary: 'CH-09: Báo cáo Học phí', parameters: [{ name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'semester', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: '{detail, summary}' } } },
      },

      // ═══════════ GRADE REQUESTS (HV-04/05 + CH-04) ═══════════
      '/students/grade-requests': {
        get: { tags: ['Grade Requests'], summary: 'HV-05: Danh sách đề xuất của tôi', parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Grade Requests'], summary: 'HV-04: Tạo đề xuất', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['subjectResultId', 'requestType', 'reason'], properties: { subjectResultId: { type: 'string' }, requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] }, reason: { type: 'string' }, proposedLetterGrade: { type: 'string' }, proposedGradePoint4: { type: 'number' }, proposedGradePoint10: { type: 'number' }, attachmentUrl: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/students/grade-requests/{id}': {
        get: { tags: ['Grade Requests'], summary: 'HV-05: Chi tiết đề xuất', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests': {
        get: { tags: ['Grade Requests'], summary: 'CH-04: Tất cả đề xuất (phân trang)', parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests/{id}': {
        get: { tags: ['Grade Requests'], summary: 'CH-04: Chi tiết đề xuất', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests/{id}/approve': {
        post: { tags: ['Grade Requests'], summary: 'CH-04: Phê duyệt', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { reviewNote: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests/{id}/reject': {
        post: { tags: ['Grade Requests'], summary: 'CH-04: Từ chối', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['reviewNote'], properties: { reviewNote: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ UNIVERSITIES (CH-02) ═══════════
      '/universities/hierarchy': {
        get: { tags: ['Universities'], summary: 'CH-02: Cây phân cấp (Uni → Org → EduLevel → Class)', responses: { 200: { description: 'OK' } } },
      },
      '/universities': {
        get: { tags: ['Universities'], summary: 'Danh sách trường', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Universities'], summary: 'Thêm trường', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { universityCode: { type: 'string' }, universityName: { type: 'string' }, status: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/universities/{id}': {
        get: { tags: ['Universities'], summary: 'Chi tiết trường', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Universities'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Universities'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ ORGANIZATIONS (CH-02) ═══════════
      '/organizations': {
        get: { tags: ['Organizations'], summary: 'Danh sách đơn vị', parameters: [{ name: 'universityId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Organizations'], summary: 'Thêm đơn vị', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { organizationName: { type: 'string' }, universityId: { type: 'string' }, travelTime: { type: 'integer' }, status: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/organizations/{id}': {
        get: { tags: ['Organizations'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Organizations'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Organizations'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ EDUCATION LEVELS (CH-02) ═══════════
      '/education-levels': {
        get: { tags: ['Education Levels'], summary: 'Danh sách trình độ', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Education Levels'], summary: 'Thêm', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { levelName: { type: 'string' }, organizationId: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/education-levels/{id}': {
        get: { tags: ['Education Levels'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Education Levels'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Education Levels'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ CLASSES (CH-02) ═══════════
      '/classes': {
        get: { tags: ['Classes'], summary: 'Danh sách lớp', parameters: [{ name: 'educationLevelId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Classes'], summary: 'Tạo lớp', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { className: { type: 'string' }, classCode: { type: 'string' }, educationLevelId: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/classes/{id}': {
        get: { tags: ['Classes'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Classes'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Classes'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ SEMESTERS (CH-08 + CH-11) ═══════════
      '/semesters/grade-convert': {
        post: { tags: ['Semesters'], summary: 'CH-11: Chuyển đổi 1 điểm', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['value', 'from', 'to'], properties: { value: { type: 'string' }, from: { type: 'string', enum: ['10', '4', 'letter'] }, to: { type: 'string', enum: ['10', '4', 'letter'] } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/semesters/grade-convert/batch': {
        post: { tags: ['Semesters'], summary: 'CH-11: Chuyển đổi hàng loạt', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { grades: { type: 'array', items: { type: 'string' } } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/semesters/grade-convert/gpa': {
        post: { tags: ['Semesters'], summary: 'CH-11: Tính GPA', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { grades: { type: 'array', items: { type: 'object', properties: { point10: { type: 'number' }, credits: { type: 'integer' } } } } } } } } }, responses: { 200: { description: '{gpa4, gpa10, totalCredits}' } } },
      },
      '/semesters/grade-convert/table': {
        get: { tags: ['Semesters'], summary: 'CH-11: Bảng quy đổi điểm', responses: { 200: { description: 'OK' } } },
      },
      '/semesters': {
        get: { tags: ['Semesters'], summary: 'CH-08: Danh sách học kỳ', parameters: [{ name: 'code', in: 'query', schema: { type: 'string' } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Semesters'], summary: 'CH-08: Thêm học kỳ', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Semester' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/semesters/{id}': {
        get: { tags: ['Semesters'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Semesters'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Semesters'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ YEARLY RESULTS ═══════════
      '/yearly-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ năm', parameters: [{ name: 'userId', in: 'query', schema: { type: 'string' } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Thêm KQ năm', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/YearlyResult' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/yearly-results/export': {
        get: { tags: ['Academic Results'], summary: 'Xuất Excel KQ năm', responses: { 200: { description: 'File Excel' } } },
      },
      '/yearly-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết KQ năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật KQ năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa KQ năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ SEMESTER RESULTS ═══════════
      '/semester-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ học kỳ', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Thêm KQ học kỳ', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SemesterResult' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/semester-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết KQ học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật KQ học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa KQ học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ SUBJECT RESULTS ═══════════
      '/subject-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ môn học', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Thêm KQ môn học', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SubjectResult' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/subject-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết KQ môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật KQ môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa KQ môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ TIME TABLES ═══════════
      '/time-tables': {
        get: { tags: ['Time Tables'], summary: 'Danh sách TKB', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Time Tables'], summary: 'Thêm TKB', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TimeTable' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/time-tables/report': {
        get: { tags: ['Time Tables'], summary: 'Báo cáo TKB', responses: { 200: { description: 'OK' } } },
      },
      '/time-tables/{id}': {
        get: { tags: ['Time Tables'], summary: 'Chi tiết TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Time Tables'], summary: 'Cập nhật TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Time Tables'], summary: 'Xóa TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ TUITION FEES ═══════════
      '/tuition-fees': {
        get: { tags: ['Tuition Fees'], summary: 'CH-07: Danh sách học phí', parameters: [{ name: 'userId', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'UNPAID'] } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Tuition Fees'], summary: 'CH-07: Ghi nhận học phí', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TuitionFee' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/tuition-fees/{id}': {
        get: { tags: ['Tuition Fees'], summary: 'Chi tiết học phí', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Tuition Fees'], summary: 'CH-07: Cập nhật trạng thái', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Tuition Fees'], summary: 'Xóa học phí', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ ACHIEVEMENTS ═══════════
      '/achievements': {
        get: { tags: ['Achievements'], summary: 'CH-05: Danh sách thành tích', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'CH-05: Thêm thành tích', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Achievement' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/achievements/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/achievement-profiles': {
        get: { tags: ['Achievements'], summary: 'Danh sách hồ sơ thành tích', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm hồ sơ thành tích', responses: { 201: { description: 'Created' } } },
      },
      '/achievement-profiles/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/yearly-achievements': {
        get: { tags: ['Achievements'], summary: 'Danh sách thành tích năm', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm thành tích năm', responses: { 201: { description: 'Created' } } },
      },
      '/yearly-achievements/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/scientific-initiatives': {
        get: { tags: ['Achievements'], summary: 'Danh sách sáng kiến', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm sáng kiến', responses: { 201: { description: 'Created' } } },
      },
      '/scientific-initiatives/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/scientific-topics': {
        get: { tags: ['Achievements'], summary: 'Danh sách đề tài NCKH', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm đề tài NCKH', responses: { 201: { description: 'Created' } } },
      },
      '/scientific-topics/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ CUT RICE (admin) ═══════════
      '/cut-rice': {
        get: { tags: ['Cut Rice'], summary: 'Danh sách lịch cắt cơm (admin)', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Cut Rice'], summary: 'Thêm lịch cắt cơm', responses: { 201: { description: 'Created' } } },
      },
      '/cut-rice/export': {
        get: { tags: ['Cut Rice'], summary: 'Xuất Excel lịch cắt cơm', responses: { 200: { description: 'File Excel' } } },
      },
      '/cut-rice/{id}': {
        get: { tags: ['Cut Rice'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Cut Rice'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Cut Rice'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ DUTY SCHEDULES ═══════════
      '/commander-duty-schedules': {
        get: { tags: ['Duty Schedules'], summary: 'CH-10: Danh sách lịch trực', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Duty Schedules'], summary: 'CH-10: Phân công lịch trực', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/DutySchedule' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/commander-duty-schedules/{id}': {
        get: { tags: ['Duty Schedules'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Duty Schedules'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Duty Schedules'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      },

      // ═══════════ NOTIFICATIONS (admin) ═══════════
      '/notifications': {
        get: { tags: ['Notifications'], summary: 'Tất cả thông báo (admin)', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Notifications'], summary: 'Tạo thông báo', responses: { 201: { description: 'Created' } } },
      },
      '/notifications/{id}': {
        get: { tags: ['Notifications'], summary: 'Chi tiết thông báo', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Notifications'], summary: 'Cập nhật thông báo', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Notifications'], summary: 'Xóa thông báo', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
