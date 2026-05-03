const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Manager API',
      version: '1.0.0',
      description: `
# Hệ thống Quản lý Học viên

API cho 3 nhóm người dùng: **Học viên**, **Chỉ huy**, **Quản trị viên**

## Phân quyền
| Role | Quyền |
|------|-------|
| STUDENT | Xem/sửa hồ sơ cá nhân, KQHT, lịch học, cắt cơm, thành tích, học phí, thông báo, đề xuất điểm |
| COMMANDER | Quản lý tài khoản, hồ sơ HV, cơ sở đào tạo, phê duyệt đề xuất, lịch trực, báo cáo, học phí, học kỳ |
| ADMIN | Toàn quyền hệ thống, phân quyền |

## Cơ chế chung
- **Filter**: \`?field=value\` (vd: \`?gender=MALE&status=ACTIVE\`)
- **Sort**: \`createdAt DESC\` mặc định (hệ thống tự động)
- **Phân trang**: \`?page=1&limit=10\` (mặc định limit=10, max=100)
- **Auth**: Bearer token trong header \`Authorization: Bearer <token>\`
`,
    },
    servers: [{ url: 'http://localhost:6868/api', description: 'Local' }],
    tags: [
      { name: 'Auth', description: 'Đăng nhập & Quản lý tài khoản (HV-01)' },
      { name: 'Profile', description: 'Thông tin cá nhân (HV-02) - dùng chung cho cả HV và CH' },
      { name: 'Notifications', description: 'Thông báo (HV-09)' },
      { name: 'Students', description: 'Hồ sơ học viên (CH-03) + HV tự xem KQHT/Lịch học/Cắt cơm/Thành tích/Học phí' },
      { name: 'Grade Requests', description: 'Đề xuất KQHT (HV-04, HV-05) + Phê duyệt (CH-04)' },
      { name: 'Users', description: 'Quản lý tài khoản người dùng (CH-01, QTV-02)' },
      { name: 'Commanders', description: 'Quản lý Chỉ huy + Báo cáo + Cắt cơm (CH-06, CH-09, CH-10)' },
      { name: 'Universities', description: 'Quản lý Cơ sở đào tạo (CH-02)' },
      { name: 'Organizations', description: 'Quản lý Đơn vị/Khoa (CH-02)' },
      { name: 'Education Levels', description: 'Quản lý Trình độ đào tạo (CH-02)' },
      { name: 'Classes', description: 'Quản lý Lớp học (CH-02)' },
      { name: 'Semesters', description: 'Quản lý Học kỳ + Tiện ích điểm (CH-08, CH-11)' },
      { name: 'Time Tables', description: 'Thời khóa biểu' },
      { name: 'Tuition Fees', description: 'Quản lý Học phí (CH-07, HV-08)' },
      { name: 'Achievements', description: 'Quản lý Thành tích (CH-05, HV-08)' },
      { name: 'Cut Rice', description: 'Quản lý Lịch cắt cơm' },
      { name: 'Duty Schedules', description: 'Phân công Lịch trực (CH-10)' },
      { name: 'Academic Results', description: 'Kết quả học tập' },
    ],
    components: {
      securitySchemes: { BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Error: { type: 'object', properties: { success: { type: 'boolean' }, statusCode: { type: 'integer' }, message: { type: 'string' } } },
        Pagination: { type: 'object', properties: { pageIndex: { type: 'integer' }, pageSize: { type: 'integer' }, totalPages: { type: 'integer' }, total: { type: 'integer' } } },
        User: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, username: { type: 'string' }, role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] }, isAdmin: { type: 'boolean' }, studentId: { type: 'string' }, commanderId: { type: 'string' } } },
        Student: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, fullName: { type: 'string' }, gender: { type: 'string' }, birthday: { type: 'string' }, cccdNumber: { type: 'string' }, phoneNumber: { type: 'string' }, email: { type: 'string' }, currentAddress: { type: 'string' }, enrollment: { type: 'integer' }, rank: { type: 'string' }, unit: { type: 'string' }, positionGovernment: { type: 'string' }, positionParty: { type: 'string' }, currentCpa4: { type: 'number' }, currentCpa10: { type: 'number' }, classId: { type: 'string' }, universityId: { type: 'string' }, organizationId: { type: 'string' }, educationLevelId: { type: 'string' } } },
        Commander: { type: 'object', properties: { id: { type: 'string' }, commanderId: { type: 'string' }, fullName: { type: 'string' }, gender: { type: 'string' }, birthday: { type: 'string' }, cccd: { type: 'string' }, phoneNumber: { type: 'string' }, email: { type: 'string' }, currentAddress: { type: 'string' }, rank: { type: 'string' }, unit: { type: 'string' }, positionGovernment: { type: 'string' }, positionParty: { type: 'string' }, startWork: { type: 'integer' } } },
        University: { type: 'object', properties: { id: { type: 'string' }, universityCode: { type: 'string' }, universityName: { type: 'string' }, totalStudents: { type: 'integer' }, status: { type: 'string' } } },
        Organization: { type: 'object', properties: { id: { type: 'string' }, organizationName: { type: 'string' }, travelTime: { type: 'integer', description: 'Thời gian đi lại (phút) - dùng tính lịch cắt cơm' }, totalStudents: { type: 'integer' }, status: { type: 'string' }, universityId: { type: 'string' } } },
        EducationLevel: { type: 'object', properties: { id: { type: 'string' }, levelName: { type: 'string' }, organizationId: { type: 'string' } } },
        Class: { type: 'object', properties: { id: { type: 'string' }, className: { type: 'string' }, studentCount: { type: 'integer' }, educationLevelId: { type: 'string' } } },
        YearlyResult: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, schoolYear: { type: 'string' }, averageGrade4: { type: 'number' }, averageGrade10: { type: 'number' }, cumulativeGrade4: { type: 'number' }, cumulativeGrade10: { type: 'number' }, cumulativeCredits: { type: 'integer' }, totalCredits: { type: 'integer' }, passedSubjects: { type: 'integer' }, failedSubjects: { type: 'integer' }, debtCredits: { type: 'integer' }, partyRating: { type: 'string' }, trainingRating: { type: 'string' } } },
        SemesterResult: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, totalCredits: { type: 'integer' }, averageGrade4: { type: 'number' }, averageGrade10: { type: 'number' }, cumulativeCredits: { type: 'integer' }, cumulativeGrade4: { type: 'number' }, cumulativeGrade10: { type: 'number' }, debtCredits: { type: 'integer' }, failedSubjects: { type: 'integer' } } },
        SubjectResult: { type: 'object', properties: { id: { type: 'string' }, semesterResultId: { type: 'string' }, subjectCode: { type: 'string' }, subjectName: { type: 'string' }, credits: { type: 'integer' }, letterGrade: { type: 'string' }, gradePoint4: { type: 'number' }, gradePoint10: { type: 'number' } } },
        Semester: { type: 'object', properties: { id: { type: 'string' }, code: { type: 'string', example: '2024-2025-HK1' }, schoolYear: { type: 'string', example: '2024-2025' } } },
        TimeTable: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, schedules: { type: 'array', items: { type: 'object', properties: { day: { type: 'string' }, startTime: { type: 'string' }, endTime: { type: 'string' }, room: { type: 'string' }, subjectName: { type: 'string' } } } } } },
        TuitionFee: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, totalAmount: { type: 'number' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, content: { type: 'string' }, status: { type: 'string', enum: ['PAID', 'UNPAID'] } } },
        Achievement: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, title: { type: 'string' }, award: { type: 'string' }, semester: { type: 'string' }, schoolYear: { type: 'string' }, year: { type: 'integer' }, content: { type: 'string' }, description: { type: 'string' } } },
        CutRice: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, weekly: { type: 'object' }, isAutoGenerated: { type: 'boolean' }, lastUpdated: { type: 'string' }, notes: { type: 'string' } } },
        DutySchedule: { type: 'object', properties: { id: { type: 'integer' }, fullName: { type: 'string' }, rank: { type: 'string' }, phoneNumber: { type: 'string' }, position: { type: 'string' }, workDay: { type: 'string' } } },
        Notification: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, type: { type: 'string', enum: ['GRADE', 'CUT_RICE', 'ACHIEVEMENT', 'TUITION', 'GENERAL'] }, isRead: { type: 'boolean' } } },
        GradeRequest: { type: 'object', properties: { id: { type: 'string' }, studentId: { type: 'string' }, subjectResultId: { type: 'string' }, requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] }, reason: { type: 'string' }, proposedLetterGrade: { type: 'string' }, proposedGradePoint4: { type: 'number' }, proposedGradePoint10: { type: 'number' }, attachmentUrl: { type: 'string' }, status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] }, reviewerId: { type: 'string' }, reviewNote: { type: 'string' }, reviewedAt: { type: 'string' } } },
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
      // ==================== AUTH ====================
      '/auth/login': {
        post: {
          tags: ['Auth'], summary: 'Đăng nhập', description: 'Đăng nhập bằng tài khoản được cấp. Trả về accessToken (1h) + refreshToken (7d).', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string', example: 'hv001' }, password: { type: 'string', example: 'hocvien123' } } } } } },
          responses: { 200: { description: 'OK - accessToken + refreshToken + user' }, 401: { $ref: '#/components/responses/401' } },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Auth'], summary: 'Đăng ký', description: 'Tạo tài khoản mới.', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] }, studentId: { type: 'string' }, commanderId: { type: 'string' } } } } } },
          responses: { 201: { description: 'Created' }, 400: { $ref: '#/components/responses/400' } },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'], summary: 'Làm mới token', description: 'Dùng refreshToken để lấy accessToken mới.', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } },
          responses: { 200: { description: 'OK' }, 401: { $ref: '#/components/responses/401' } },
        },
      },
      '/auth/change-password': {
        post: {
          tags: ['Auth'], summary: 'Đổi mật khẩu', description: 'Đổi mật khẩu tài khoản hiện tại.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['oldPassword', 'newPassword'], properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string', minLength: 6 } } } } } },
          responses: { 200: { description: 'OK' }, 401: { $ref: '#/components/responses/401' } },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'], summary: 'Thông tin người dùng hiện tại',
          description: 'Trả về User kèm Student (Class, Organization, University, EducationLevel) hoặc Commander tùy role.',
          responses: { 200: { description: 'OK' } },
        },
      },
      // ==================== PROFILE (HV-02, dùng chung) ====================
      '/auth/profile': {
        get: {
          tags: ['Profile'], summary: 'Xem thông tin cá nhân', description: '**Dùng chung cho Học viên + Chỉ huy.** Tự động trả về đúng cấu trúc theo role:\n- STUDENT: User + Student + Class + Organization + University + EducationLevel\n- COMMANDER: User + Commander',
          responses: { 200: { description: 'OK' }, 401: { $ref: '#/components/responses/401' } },
        },
        put: {
          tags: ['Profile'], summary: 'Cập nhật thông tin cá nhân', description: '**Dùng chung cho Học viên + Chỉ huy.** Fields cho phép: currentAddress, phoneNumber, email, rank, unit, positionGovernment, positionParty.',
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { currentAddress: { type: 'string' }, phoneNumber: { type: 'string' }, email: { type: 'string' }, rank: { type: 'string' }, unit: { type: 'string' }, positionGovernment: { type: 'string' }, positionParty: { type: 'string' } } } } } },
          responses: { 200: { description: 'OK' }, 401: { $ref: '#/components/responses/401' } },
        },
      },
      // ==================== NOTIFICATIONS (HV-09) ====================
      '/auth/notifications': {
        get: {
          tags: ['Notifications'], summary: 'Danh sách thông báo', description: 'Thông báo của người dùng hiện tại. Filter: ?type=GRADE&isRead=false. Sort: mới nhất trước.',
          parameters: [{ name: 'type', in: 'query', schema: { type: 'string', enum: ['GRADE', 'CUT_RICE', 'ACHIEVEMENT', 'TUITION', 'GENERAL'] } }, { name: 'isRead', in: 'query', schema: { type: 'boolean' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/auth/notifications/read-all': {
        put: { tags: ['Notifications'], summary: 'Đánh dấu tất cả đã đọc', responses: { 200: { description: 'OK' } } },
      },
      '/auth/notifications/{id}': {
        get: {
          tags: ['Notifications'], summary: 'Chi tiết thông báo', description: 'Tự động đánh dấu đã đọc khi xem.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { $ref: '#/components/responses/404' } },
        },
        delete: {
          tags: ['Notifications'], summary: 'Xóa thông báo',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/auth/notifications/{id}/read': {
        put: { tags: ['Notifications'], summary: 'Đánh dấu đã đọc', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== STUDENTS (CH-03 + HV tự xem) ====================
      '/students/profile': {},
      '/students/avatar': { post: { tags: ['Students'], summary: 'Upload ảnh đại diện', description: 'Cập nhật avatar cho học viên.', responses: { 200: { description: 'OK' } } } },
      '/students/results': {
        get: {
          tags: ['Students'], summary: 'HV-03: Xem KQHT', description: 'Kết quả học tập theo năm học, kèm semesterResults -> subjectResults. Filter: ?schoolYear=2024-2025. Trả về: CPA, tín chỉ tích lũy, tín chỉ nợ.',
          parameters: [{ name: 'schoolYear', in: 'query', schema: { type: 'string', example: '2024-2025' } }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/students/time-table': {
        get: { tags: ['Students'], summary: 'HV-06: Xem lịch học', description: 'Xem thời khóa biểu cá nhân.', responses: { 200: { description: 'OK' } } },
        post: {
          tags: ['Students'], summary: 'HV-06: Thêm môn học', description: 'Thêm môn vào lịch. Tự động tạo lịch cắt cơm dựa trên lịch học + giờ ăn (06:00, 11:00, 17:30).',
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { schedules: { type: 'array', items: { type: 'object', properties: { day: { type: 'string', example: 'Thứ 2' }, startTime: { type: 'string', example: '07:00' }, endTime: { type: 'string', example: '09:25' }, room: { type: 'string' }, subjectName: { type: 'string' } } } } } } } } },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/students/time-table/{id}': {
        put: { tags: ['Students'], summary: 'HV-06: Sửa môn học', description: 'Cập nhật môn trong lịch. Tự động cập nhật lịch cắt cơm.', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Students'], summary: 'HV-06: Xóa môn học', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/students/cut-rice': {
        get: { tags: ['Students'], summary: 'HV-07: Xem lịch cắt cơm', description: 'Tự động tạo nếu chưa có. Dựa trên lịch học + thời gian đi lại + giờ ăn (06:00, 11:00, 17:30).', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Students'], summary: 'HV-07: Cập nhật lịch cắt cơm', description: 'Học viên tự điều chỉnh lịch cắt cơm.', responses: { 200: { description: 'OK' } } },
      },
      '/students/achievements': {
        get: { tags: ['Students'], summary: 'HV-08: Xem thành tích', description: 'Bao gồm: achievements + achievementProfile + yearlyAchievements (kèm scientificInitiatives, scientificTopics).', responses: { 200: { description: 'OK' } } },
      },
      '/students/tuition-fees': {
        get: { tags: ['Students'], summary: 'HV-08: Xem học phí', description: 'Học phí theo học kỳ, trạng thái thanh toán.', responses: { 200: { description: 'OK' } } },
      },
      // Students CRUD (Commander/Admin)
      '/students': {
        get: {
          tags: ['Students'], summary: 'CH-03: Danh sách học viên', description: 'Filter: ?studentId=&fullName=&gender=&enrollment=&unit=&rank=&classId=&organizationId=&universityId=. Sort: createdAt DESC. Admin/Commander only.',
          parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'fullName', in: 'query', schema: { type: 'string' } }, { name: 'gender', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Student' } }, pagination: { $ref: '#/components/schemas/Pagination' } } } } } } },
        },
        post: { tags: ['Students'], summary: 'CH-03: Thêm học viên', description: 'Tự động tạo tài khoản liên kết.', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Student' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/students/{id}': {
        get: { tags: ['Students'], summary: 'CH-03: Chi tiết học viên', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' }, 404: { $ref: '#/components/responses/404' } } },
        put: { tags: ['Students'], summary: 'CH-03: Cập nhật học viên', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Students'], summary: 'CH-03: Xóa học viên', description: 'Tự động xóa tất cả dữ liệu liên quan (user, KQHT, lịch học, cắt cơm, học phí, thành tích...).', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/students/export': {
        get: {
          tags: ['Students'], summary: 'Xuất Excel danh sách học viên', description: 'Xuất toàn bộ thông tin học viên ra Excel. Chọn trường qua ?fields=fullName,rank,unit,class.className. Hỗ trợ filter: schoolYear, unit, enrollment, fullName, studentId.',
          parameters: [
            { name: 'fields', in: 'query', schema: { type: 'string' }, description: 'Các trường cần xuất (phân cách dấu phẩy). Bỏ trống = tất cả.' },
            { name: 'schoolYear', in: 'query', schema: { type: 'string' }, description: 'Lọc theo năm học' },
            { name: 'unit', in: 'query', schema: { type: 'string' }, description: 'Lọc theo đơn vị' },
            { name: 'enrollment', in: 'query', schema: { type: 'integer' }, description: 'Lọc theo năm vào trường' },
            { name: 'fullName', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo tên' },
            { name: 'studentId', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo mã' },
          ],
          responses: { 200: { description: 'File Excel (.xlsx)' } },
        },
      },
      '/students/export': {
        get: {
          tags: ['Students'],
          summary: 'Xuất Excel danh sách học viên',
          description: 'Xuất danh sách học viên ra Excel. Hỗ trợ chọn trường qua ?fields=fullName,rank,unit,class.className. Filter hỗ trợ: schoolYear, unit, enrollment, fullName, studentId.',
          parameters: [
            { name: 'fields', in: 'query', schema: { type: 'string' }, description: 'Các trường cần xuất, phân cách bằng dấu phẩy. Bỏ trống để xuất tất cả.' },
            { name: 'schoolYear', in: 'query', schema: { type: 'string' } },
            { name: 'unit', in: 'query', schema: { type: 'string' } },
            { name: 'enrollment', in: 'query', schema: { type: 'integer' } },
            { name: 'fullName', in: 'query', schema: { type: 'string' } },
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'File Excel (.xlsx)' } },
        },
      },
      // ==================== GRADE REQUESTS (HV-04, HV-05 + CH-04) ====================
      '/students/grade-requests': {
        get: {
          tags: ['Grade Requests'], summary: 'HV-05: Danh sách đề xuất của tôi', description: 'Học viên xem đề xuất của mình. Filter: ?status=PENDING.',
          parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } }],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Grade Requests'], summary: 'HV-04: Tạo đề xuất', description: 'Tạo đề xuất thêm/sửa/xóa KQHT. Gửi đến Chỉ huy phê duyệt.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['subjectResultId', 'requestType', 'reason'], properties: { subjectResultId: { type: 'string' }, requestType: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] }, reason: { type: 'string' }, proposedLetterGrade: { type: 'string' }, proposedGradePoint4: { type: 'number' }, proposedGradePoint10: { type: 'number' }, attachmentUrl: { type: 'string' } } } } } },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/students/grade-requests/{id}': {
        get: { tags: ['Grade Requests'], summary: 'HV-05: Chi tiết đề xuất', description: 'Kèm ghi chú từ Chỉ huy (reviewNote).', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests': {
        get: {
          tags: ['Grade Requests'], summary: 'CH-04: Tất cả đề xuất (phân trang + thống kê)',
          description: 'Chỉ huy xem tất cả đề xuất. Trả về kèm summary { pending, approved, rejected, total }.',
          parameters: [
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } },
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
            { name: 'requestType', in: 'query', schema: { type: 'string', enum: ['ADD', 'UPDATE', 'DELETE'] } },
            { name: 'fullName', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo tên học viên' },
            { name: 'unit', in: 'query', schema: { type: 'string' }, description: 'Lọc theo đơn vị' },
            { name: 'semester', in: 'query', schema: { type: 'string' }, description: 'Lọc theo học kỳ' },
            { name: 'schoolYear', in: 'query', schema: { type: 'string' }, description: 'Lọc theo năm học' },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'OK + summary { pending, approved, rejected, total }' } },
        },
      },
      '/commanders/grade-requests/{id}': {
        get: { tags: ['Grade Requests'], summary: 'CH-04: Chi tiết đề xuất', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/grade-requests/{id}/approve': {
        post: {
          tags: ['Grade Requests'], summary: 'CH-04: Phê duyệt đề xuất', description: 'Phê duyệt → tự động cập nhật điểm + tính lại CPA (semester → yearly → student). Gửi thông báo cho học viên.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { reviewNote: { type: 'string', example: 'Đồng ý cập nhật' } } } } } },
          responses: { 200: { description: 'OK' }, 400: { $ref: '#/components/responses/400' } },
        },
      },
      '/commanders/grade-requests/{id}/reject': {
        post: {
          tags: ['Grade Requests'], summary: 'CH-04: Từ chối đề xuất', description: 'Từ chối + gửi thông báo kèm lý do cho học viên.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['reviewNote'], properties: { reviewNote: { type: 'string', example: 'Không đủ minh chứng' } } } } } },
          responses: { 200: { description: 'OK' } },
        },
      },
      // ==================== USERS (CH-01, QTV-02) ====================
      '/users': {
        get: {
          tags: ['Users'], summary: 'CH-01: Danh sách tài khoản', description: 'Quản lý tài khoản người dùng. Filter: ?username=&role=&isAdmin=. Admin/Commander.',
          parameters: [{ name: 'username', in: 'query', schema: { type: 'string' } }, { name: 'role', in: 'query', schema: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Users'], summary: 'CH-01: Tạo tài khoản', description: 'Tạo tài khoản mới. Admin/Commander.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string', minLength: 6 }, role: { type: 'string' }, email: { type: 'string' }, fullName: { type: 'string' }, studentId: { type: 'string' }, commanderId: { type: 'string' } } } } } },
          responses: { 201: { description: 'Created' }, 400: { $ref: '#/components/responses/400' } },
        },
      },
      '/users/batch': { post: { tags: ['Users'], summary: 'CH-01: Tạo hàng loạt', description: 'Tạo nhiều tài khoản cùng lúc.', responses: { 201: { description: 'Created' } } } },
      '/users/{id}': {
        get: { tags: ['Users'], summary: 'Chi tiết tài khoản', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Users'], summary: 'Cập nhật tài khoản', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Users'], summary: 'Xóa tài khoản (soft delete)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/users/{id}/reset-password': {
        post: { tags: ['Users'], summary: 'CH-01: Reset mật khẩu', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { newPassword: { type: 'string', minLength: 6 } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/users/{id}/toggle-active': {
        post: { tags: ['Users'], summary: 'CH-01: Khóa/Mở khóa', description: 'Vô hiệu hóa hoặc kích hoạt tài khoản.', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== COMMANDERS ====================
      '/commanders': {
        get: {
          tags: ['Commanders'], summary: 'Danh sách Chỉ huy', description: 'Filter: ?commanderId=&fullName=&unit=&rank=. Admin/Commander.',
          parameters: [{ name: 'commanderId', in: 'query', schema: { type: 'string' } }, { name: 'fullName', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
        post: { tags: ['Commanders'], summary: 'Thêm Chỉ huy', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Commander' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/commanders/{id}': {
        get: { tags: ['Commanders'], summary: 'Chi tiết Chỉ huy', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Commanders'], summary: 'Cập nhật Chỉ huy', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Commanders'], summary: 'Xóa Chỉ huy', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/cut-rice/generate/{studentId}': {
        post: { tags: ['Commanders'], summary: 'CH-06: Tạo lịch cắt cơm cho 1 HV', description: 'Dựa trên thời khóa biểu + thời gian đi lại + giờ ăn (06:00, 11:00, 17:30).', parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/commanders/cut-rice/generate-all': {
        post: { tags: ['Commanders'], summary: 'CH-06: Tạo lịch cắt cơm cho TẤT CẢ HV', description: 'Quét tất cả học viên, tạo lịch cắt cơm tự động. Trả về {success, skipped}.', responses: { 200: { description: 'OK' } } },
      },
      '/commanders/reports/academic': {
        get: { tags: ['Commanders'], summary: 'CH-09: Báo cáo KQHT', description: 'Thống kê GPA/CPA, phân loại học tập. ?schoolYear=2024-2025.', responses: { 200: { description: 'OK' } } },
      },
      '/commanders/reports/party-training': {
        get: { tags: ['Commanders'], summary: 'CH-09: Báo cáo Xếp loại Đảng/Rèn luyện', description: 'Thống kê partyRating + trainingRating.', responses: { 200: { description: 'OK' } } },
      },
      '/commanders/reports/achievements': {
        get: { tags: ['Commanders'], summary: 'CH-09: Báo cáo Thành tích', description: 'Tổng hợp khen thưởng, đề xuất khen thưởng.', responses: { 200: { description: 'OK' } } },
      },
      '/commanders/reports/tuition': {
        get: { tags: ['Commanders'], summary: 'CH-09: Báo cáo Học phí', description: 'Tổng hợp tình trạng thanh toán.', responses: { 200: { description: 'OK' } } },
      },
      // ==================== DUTY SCHEDULES (CH-10) ====================
      '/commander-duty-schedules': {
        get: { tags: ['Duty Schedules'], summary: 'CH-10: Danh sách lịch trực', parameters: [{ name: 'fullName', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Duty Schedules'], summary: 'CH-10: Phân công lịch trực', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/DutySchedule' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/commander-duty-schedules/{id}': {
        get: { tags: ['Duty Schedules'], summary: 'Chi tiết lịch trực', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Duty Schedules'], summary: 'Cập nhật lịch trực', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Duty Schedules'], summary: 'Xóa lịch trực', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== UNIVERSITIES (CH-02) ====================
      '/universities/hierarchy': {
        get: { tags: ['Universities'], summary: 'CH-02: Xem cây phân cấp', description: '**Toàn bộ cấu trúc:** University → Organization (có travelTime) → EducationLevel → Class. Dùng để xem tổng quan hệ thống đào tạo.', responses: { 200: { description: 'OK' } } },
      },
      '/universities': {
        get: { tags: ['Universities'], summary: 'Danh sách trường', description: 'Filter: ?universityCode=&universityName=&status=.', parameters: [{ name: 'universityCode', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Universities'], summary: 'Thêm trường', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/University' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/universities/{id}': {
        get: { tags: ['Universities'], summary: 'Chi tiết trường (kèm Organizations → EducationLevels → Classes)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Universities'], summary: 'Cập nhật trường', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Universities'], summary: 'Xóa trường', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== ORGANIZATIONS (CH-02) ====================
      '/organizations': {
        get: { tags: ['Organizations'], summary: 'Danh sách đơn vị', description: 'Filter: ?organizationName=&status=&universityId=. **travelTime** dùng để tính lịch cắt cơm.', parameters: [{ name: 'organizationName', in: 'query', schema: { type: 'string' } }, { name: 'universityId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Organizations'], summary: 'Thêm đơn vị', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Organization' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/organizations/{id}': {
        get: { tags: ['Organizations'], summary: 'Chi tiết đơn vị', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Organizations'], summary: 'Cập nhật đơn vị', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Organizations'], summary: 'Xóa đơn vị', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== EDUCATION LEVELS (CH-02) ====================
      '/education-levels': {
        get: { tags: ['Education Levels'], summary: 'Danh sách trình độ đào tạo', parameters: [{ name: 'levelName', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Education Levels'], summary: 'Thêm trình độ đào tạo', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EducationLevel' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/education-levels/{id}': {
        get: { tags: ['Education Levels'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Education Levels'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Education Levels'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== CLASSES (CH-02) ====================
      '/classes': {
        get: { tags: ['Classes'], summary: 'Danh sách lớp', description: 'Tự động đồng bộ sĩ số. Filter: ?className=&educationLevelId=.', parameters: [{ name: 'className', in: 'query', schema: { type: 'string' } }, { name: 'educationLevelId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Classes'], summary: 'Tạo lớp', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Class' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/classes/{id}': {
        get: { tags: ['Classes'], summary: 'Chi tiết lớp', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Classes'], summary: 'Cập nhật lớp', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Classes'], summary: 'Xóa lớp', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== SEMESTERS (CH-08 + CH-11) ====================
      '/semesters/grade-convert': {
        post: { tags: ['Semesters'], summary: 'CH-11: Chuyển đổi 1 điểm', description: 'Chuyển đổi giữa hệ 10, hệ 4, điểm chữ.', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['value', 'from', 'to'], properties: { value: { oneOf: [{ type: 'number' }, { type: 'string' }], example: 8.5 }, from: { type: 'string', enum: ['10', '4', 'letter'] }, to: { type: 'string', enum: ['10', '4', 'letter'] } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/semesters/grade-convert/batch': {
        post: { tags: ['Semesters'], summary: 'CH-11: Chuyển đổi hàng loạt', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { grades: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, from: { type: 'string' }, to: { type: 'string' } } } } } } } } }, responses: { 200: { description: 'OK' } } },
      },
      '/semesters/grade-convert/gpa': {
        post: { tags: ['Semesters'], summary: 'CH-11: Tính GPA', description: 'Tính điểm trung bình từ danh sách điểm (có trọng số tín chỉ).', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { grades: { type: 'array', items: { type: 'object', properties: { point10: { type: 'number' }, credits: { type: 'integer' } } } } } } } } }, responses: { 200: { description: 'OK - {gpa4, gpa10, totalCredits}' } } },
      },
      '/semesters/grade-convert/table': {
        get: { tags: ['Semesters'], summary: 'CH-11: Bảng quy đổi điểm', description: 'Xem thông tin chi tiết: điểm chữ, hệ 4, hệ 10, khoảng.', responses: { 200: { description: 'OK' } } },
      },
      '/semesters': {
        get: { tags: ['Semesters'], summary: 'CH-08: Danh sách học kỳ', description: 'Filter: ?code=&schoolYear=. Sort: createdAt DESC.', parameters: [{ name: 'code', in: 'query', schema: { type: 'string' } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Semesters'], summary: 'CH-08: Thêm học kỳ', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Semester' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/semesters/{id}': {
        get: { tags: ['Semesters'], summary: 'Chi tiết học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Semesters'], summary: 'CH-08: Cập nhật học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Semesters'], summary: 'CH-08: Xóa học kỳ', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== TUITION FEES (CH-07) ====================
      '/tuition-fees': {
        get: { tags: ['Tuition Fees'], summary: 'CH-07: Danh sách học phí', description: 'Filter: ?studentId=&semester=&schoolYear=&status=UNPAID.', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'semester', in: 'query', schema: { type: 'string' } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string', enum: ['PAID', 'UNPAID'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Tuition Fees'], summary: 'CH-07: Ghi nhận học phí', description: 'Thêm học phí cho học viên theo học kỳ.', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TuitionFee' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/tuition-fees/{id}': {
        get: { tags: ['Tuition Fees'], summary: 'Chi tiết học phí', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Tuition Fees'], summary: 'CH-07: Cập nhật trạng thái', description: 'Cập nhật trạng thái thanh toán (UNPAID → PAID).', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Tuition Fees'], summary: 'Xóa học phí', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== ACHIEVEMENTS (CH-05) ====================
      '/achievements': {
        get: { tags: ['Achievements'], summary: 'CH-05: Danh sách thành tích', description: 'Filter: ?studentId=&semester=&schoolYear=&year=&award=.', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'year', in: 'query', schema: { type: 'integer' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'CH-05: Thêm thành tích', description: 'Thành tích học tập, rèn luyện, giải thưởng.', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Achievement' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/achievements/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/achievement-profiles/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa hồ sơ thành tích', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/yearly-achievements/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa thành tích năm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/scientific-initiatives/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa sáng kiến', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/scientific-topics/{id}': {
        get: { tags: ['Achievements'], summary: 'Chi tiết đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Achievements'], summary: 'Cập nhật đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Achievements'], summary: 'Xóa đề tài NCKH', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== CUT RICE ====================
      '/cut-rice': {
        get: {
          tags: ['Cut Rice'], summary: 'Danh sách lịch cắt cơm',
          description: 'Trả về danh sách lịch cắt cơm kèm cột từng ngày (Sáng/Trưa/Tối). Filter: ?studentId=&unit=&fullName=.',
          parameters: [
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
            { name: 'unit', in: 'query', schema: { type: 'string' } },
            { name: 'fullName', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: { tags: ['Cut Rice'], summary: 'Thêm lịch cắt cơm', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CutRice' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/cut-rice/export': {
        get: {
          tags: ['Cut Rice'], summary: 'Xuất Excel lịch cắt cơm',
          description: 'Xuất lịch cắt cơm ra Excel. Cột: Đơn vị, Họ tên, MSSV, và 21 cột Sáng/Trưa/Tối cho 7 ngày.',
          parameters: [
            { name: 'unit', in: 'query', schema: { type: 'string' } },
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
            { name: 'fullName', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'File Excel (.xlsx)' } },
        },
      },
      '/cut-rice/{id}': {
        get: { tags: ['Cut Rice'], summary: 'Chi tiết lịch cắt cơm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Cut Rice'], summary: 'Cập nhật lịch cắt cơm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Cut Rice'], summary: 'Xóa lịch cắt cơm', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== TIME TABLES ====================
      '/time-tables': {
        get: {
          tags: ['Time Tables'], summary: 'Danh sách TKB',
          description: 'Filter: ?studentId=&fullName=. Mỗi record kèm scheduleCount, rooms, subjectNames.',
          parameters: [
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
            { name: 'fullName', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo tên học viên' },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: { tags: ['Time Tables'], summary: 'Thêm TKB', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TimeTable' } } } }, responses: { 201: { description: 'Created' } } },
      },
      '/time-tables/report': {
        get: {
          tags: ['Time Tables'], summary: 'Báo cáo lịch học (dạng phẳng)',
          description: 'Trả về danh sách lịch học dạng bảng phẳng (mỗi buổi học 1 dòng: Đơn vị, Họ tên, Số lịch, Môn học, Phòng, Tuần, Ngày, Giờ). Kèm summary { totalStudents, totalSchedules, totalSubjects, totalWeeks }.',
          responses: { 200: { description: 'OK + summary + data' } },
        },
      },
      '/time-tables/{id}': {
        get: { tags: ['Time Tables'], summary: 'Chi tiết TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Time Tables'], summary: 'Cập nhật TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Time Tables'], summary: 'Xóa TKB', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== ACADEMIC RESULTS ====================
      '/yearly-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ năm', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'schoolYear', in: 'query', schema: { type: 'string' } }, { name: 'partyRating', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Tạo KQ năm', responses: { 201: { description: 'Created' } } },
      },
      '/yearly-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/yearly-results/export': {
        get: {
          tags: ['Academic Results'], summary: 'Xuất Excel thống kê năm học',
          description: 'Xuất dữ liệu thống kê năm học ra Excel. Hỗ trợ chọn cột qua ?fields= và sắp xếp qua sortBy/sortOrder.',
          parameters: [
            { name: 'fields', in: 'query', schema: { type: 'string' }, description: 'Các cột cần xuất (phân cách dấu phẩy)' },
            { name: 'schoolYear', in: 'query', schema: { type: 'string' } },
            { name: 'unit', in: 'query', schema: { type: 'string' } },
            { name: 'studentId', in: 'query', schema: { type: 'string' } },
            { name: 'fullName', in: 'query', schema: { type: 'string' } },
            { name: 'gpaFrom', in: 'query', schema: { type: 'number' } },
            { name: 'gpaTo', in: 'query', schema: { type: 'number' } },
            { name: 'cpaFrom', in: 'query', schema: { type: 'number' } },
            { name: 'cpaTo', in: 'query', schema: { type: 'number' } },
            { name: 'isPartyMember', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
            { name: 'sortBy', in: 'query', schema: { type: 'string' } },
            { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          ],
          responses: { 200: { description: 'File Excel (.xlsx)' } },
        },
      },
      '/semester-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ học kỳ', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Tạo KQ học kỳ', responses: { 201: { description: 'Created' } } },
      },
      '/semester-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      '/subject-results': {
        get: { tags: ['Academic Results'], summary: 'Danh sách KQ môn học', parameters: [{ name: 'semesterResultId', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Academic Results'], summary: 'Tạo KQ môn học', responses: { 201: { description: 'Created' } } },
      },
      '/subject-results/{id}': {
        get: { tags: ['Academic Results'], summary: 'Chi tiết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        put: { tags: ['Academic Results'], summary: 'Cập nhật', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Academic Results'], summary: 'Xóa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      },
      // ==================== SCIENTIFIC (Thi đua & Nghiên cứu) ====================
      '/achievement-profiles': {
        get: { tags: ['Achievements'], summary: 'Hồ sơ thành tích', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Tạo hồ sơ thành tích', responses: { 201: { description: 'Created' } } },
      },
      '/yearly-achievements': {
        get: { tags: ['Achievements'], summary: 'Thành tích theo năm', parameters: [{ name: 'studentId', in: 'query', schema: { type: 'string' } }, { name: 'year', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm thành tích năm', responses: { 201: { description: 'Created' } } },
      },
      '/scientific-initiatives': {
        get: { tags: ['Achievements'], summary: 'Sáng kiến', parameters: [{ name: 'yearlyAchievementId', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm sáng kiến', responses: { 201: { description: 'Created' } } },
      },
      '/scientific-topics': {
        get: { tags: ['Achievements'], summary: 'Đề tài NCKH', parameters: [{ name: 'yearlyAchievementId', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Achievements'], summary: 'Thêm đề tài NCKH', responses: { 201: { description: 'Created' } } },
      },
      // ==================== NOTIFICATIONS ADMIN ====================
      '/notifications': {
        get: { tags: ['Notifications'], summary: 'Admin: Tất cả thông báo', parameters: [{ name: 'userId', in: 'query', schema: { type: 'string' } }, { name: 'type', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
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
