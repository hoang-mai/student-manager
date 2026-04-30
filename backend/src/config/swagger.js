const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Manager API',
      version: '1.0.0',
      description: 'API documentation for Student Management System',
    },
    servers: [
      {
        url: 'http://localhost:6868/api',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Students', description: 'Student records' },
      { name: 'Commanders', description: 'Commander records' },
      { name: 'Universities', description: 'University management' },
      { name: 'Organizations', description: 'Organization management' },
      { name: 'EducationLevels', description: 'Education level management' },
      { name: 'Classes', description: 'Class management' },
      { name: 'YearlyResults', description: 'Yearly academic results' },
      { name: 'SemesterResults', description: 'Semester academic results' },
      { name: 'SubjectResults', description: 'Subject results' },
      { name: 'Semesters', description: 'Semester management' },
      { name: 'TimeTables', description: 'Timetable management' },
      { name: 'TuitionFees', description: 'Tuition fee management' },
      { name: 'Achievements', description: 'Student achievements' },
      { name: 'AchievementProfiles', description: 'Achievement profiles' },
      { name: 'YearlyAchievements', description: 'Yearly achievements' },
      { name: 'ScientificInitiatives', description: 'Scientific initiatives' },
      { name: 'ScientificTopics', description: 'Scientific topics' },
      { name: 'CutRice', description: 'Meal schedule management' },
      { name: 'CommanderDutySchedules', description: 'Duty schedules' },
      { name: 'Notifications', description: 'Notifications' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'] },
            isAdmin: { type: 'boolean' },
            studentId: { type: 'string', format: 'uuid' },
            commanderId: { type: 'string', format: 'uuid' },
          },
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string' },
            fullName: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', format: 'date-time' },
            hometown: { type: 'string' },
            ethnicity: { type: 'string' },
            religion: { type: 'string' },
            currentAddress: { type: 'string' },
            placeOfBirth: { type: 'string' },
            phoneNumber: { type: 'string' },
            email: { type: 'string' },
            cccdNumber: { type: 'string' },
            partyMemberCardNumber: { type: 'string' },
            enrollment: { type: 'integer' },
            graduationDate: { type: 'string', format: 'date-time' },
            unit: { type: 'string' },
            rank: { type: 'string' },
            positionGovernment: { type: 'string' },
            positionParty: { type: 'string' },
            fullPartyMember: { type: 'string', format: 'date-time' },
            probationaryPartyMember: { type: 'string', format: 'date-time' },
            dateOfEnlistment: { type: 'string', format: 'date-time' },
            avatar: { type: 'string' },
            currentCpa4: { type: 'number' },
            currentCpa10: { type: 'number' },
            familyMember: { type: 'object' },
            foreignRelations: { type: 'object' },
          },
        },
        Commander: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            commanderId: { type: 'string' },
            fullName: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', format: 'date-time' },
            placeOfBirth: { type: 'string' },
            hometown: { type: 'string' },
            ethnicity: { type: 'string' },
            religion: { type: 'string' },
            currentAddress: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            cccd: { type: 'string' },
            partyMemberCardNumber: { type: 'string' },
            startWork: { type: 'integer' },
            organization: { type: 'string' },
            unit: { type: 'string' },
            rank: { type: 'string' },
            positionGovernment: { type: 'string' },
            positionParty: { type: 'string' },
            fullPartyMember: { type: 'string', format: 'date-time' },
            probationaryPartyMember: { type: 'string', format: 'date-time' },
            dateOfEnlistment: { type: 'string', format: 'date-time' },
            avatar: { type: 'string' },
          },
        },
        University: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            universityCode: { type: 'string' },
            universityName: { type: 'string' },
            totalStudents: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationName: { type: 'string' },
            travelTime: { type: 'integer' },
            totalStudents: { type: 'integer' },
            status: { type: 'string' },
            universityId: { type: 'string', format: 'uuid' },
          },
        },
        EducationLevel: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            levelName: { type: 'string' },
            organizationId: { type: 'string', format: 'uuid' },
          },
        },
        Class: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            className: { type: 'string' },
            studentCount: { type: 'integer' },
            educationLevelId: { type: 'string', format: 'uuid' },
          },
        },
        YearlyResult: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            schoolYear: { type: 'string' },
            averageGrade4: { type: 'number' },
            averageGrade10: { type: 'number' },
            cumulativeGrade4: { type: 'number' },
            cumulativeGrade10: { type: 'number' },
            cumulativeCredits: { type: 'integer' },
            totalCredits: { type: 'integer' },
            totalSubjects: { type: 'integer' },
            passedSubjects: { type: 'integer' },
            failedSubjects: { type: 'integer' },
            debtCredits: { type: 'integer' },
            academicStatus: { type: 'string' },
            studentLevel: { type: 'integer' },
            semesterIds: { type: 'string', format: 'uuid' },
            partyRating: { type: 'string' },
            trainingRating: { type: 'string' },
            partyRatingDecisionNumber: { type: 'string' },
          },
        },
        SemesterResult: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            semester: { type: 'string' },
            schoolYear: { type: 'string' },
            yearlyResultId: { type: 'string', format: 'uuid' },
            totalCredits: { type: 'integer' },
            averageGrade4: { type: 'number' },
            averageGrade10: { type: 'number' },
            cumulativeCredits: { type: 'integer' },
            cumulativeGrade4: { type: 'number' },
            cumulativeGrade10: { type: 'number' },
            debtCredits: { type: 'integer' },
            failedSubjects: { type: 'integer' },
          },
        },
        SubjectResult: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            semesterResultId: { type: 'string', format: 'uuid' },
            subjectCode: { type: 'string' },
            subjectName: { type: 'string' },
            credits: { type: 'integer' },
            letterGrade: { type: 'string' },
            gradePoint4: { type: 'number' },
            gradePoint10: { type: 'number' },
          },
        },
        Semester: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string' },
            schoolYear: { type: 'string' },
          },
        },
        TimeTable: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            schedules: { type: 'object' },
          },
        },
        TuitionFee: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            totalAmount: { type: 'number' },
            semester: { type: 'string' },
            schoolYear: { type: 'string' },
            content: { type: 'string' },
            status: { type: 'string' },
          },
        },
        Achievement: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            semester: { type: 'string' },
            schoolYear: { type: 'string' },
            content: { type: 'string' },
            year: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            award: { type: 'string' },
          },
        },
        AchievementProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            totalYears: { type: 'integer' },
            totalAdvancedSoldier: { type: 'integer' },
            totalCompetitiveSoldier: { type: 'integer' },
            totalScientificTopics: { type: 'integer' },
            totalScientificInitiatives: { type: 'integer' },
            eligibleForMinistryReward: { type: 'boolean' },
            eligibleForNationalReward: { type: 'boolean' },
          },
        },
        YearlyAchievement: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            year: { type: 'integer' },
            decisionNumber: { type: 'string' },
            decisionDate: { type: 'string', format: 'date-time' },
            title: { type: 'string' },
            hasMinistryReward: { type: 'boolean' },
            hasNationalReward: { type: 'boolean' },
            notes: { type: 'string' },
          },
        },
        ScientificInitiative: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            yearlyAchievementId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            year: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        ScientificTopic: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            yearlyAchievementId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            year: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        CutRice: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            weekly: { type: 'object' },
            isAutoGenerated: { type: 'boolean' },
            lastUpdated: { type: 'string', format: 'date-time' },
            notes: { type: 'string' },
          },
        },
        CommanderDutySchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            fullName: { type: 'string' },
            rank: { type: 'string' },
            phoneNumber: { type: 'string' },
            position: { type: 'string' },
            workDay: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            type: { type: 'string' },
            link: { type: 'string' },
            isRead: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            message: { type: 'string' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ForbiddenError: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFoundError: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
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
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          description: 'Authenticate user and return JWT tokens',
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
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer', example: 200 },
                      message: { type: 'string', example: 'Login successful' },
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
          tags: ['Auth'],
          summary: 'Register',
          description: 'Create a new user account',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password', 'role'],
                  properties: {
                    username: { type: 'string', example: 'newuser' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['STUDENT', 'COMMANDER', 'ADMIN'], example: 'STUDENT' },
                    studentId: { type: 'string', format: 'uuid' },
                    commanderId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Account created successfully' },
            400: { $ref: '#/components/responses/ValidationError' },
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh token',
          description: 'Get new access token using refresh token',
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
            200: { description: 'Token refreshed successfully' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/auth/change-password': {
        post: {
          tags: ['Auth'],
          summary: 'Change password',
          description: 'Change current user password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['oldPassword', 'newPassword'],
                  properties: {
                    oldPassword: { type: 'string', example: 'oldpass123' },
                    newPassword: { type: 'string', example: 'newpass123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Password changed successfully' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Create user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            201: { description: 'User created successfully' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'User details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update user',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            200: { description: 'User updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'User deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/students': {
        get: {
          tags: ['Students'],
          summary: 'Get all students',
          responses: {
            200: {
              description: 'List of students',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Students'],
          summary: 'Create student',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          responses: {
            201: { description: 'Student created successfully' },
          },
        },
      },
      '/students/{id}': {
        get: {
          tags: ['Students'],
          summary: 'Get student by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Student details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Student' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Students'],
          summary: 'Update student',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          responses: {
            200: { description: 'Student updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Students'],
          summary: 'Delete student',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Student deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/commanders': {
        get: {
          tags: ['Commanders'],
          summary: 'Get all commanders',
          responses: {
            200: {
              description: 'List of commanders',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Commander' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Commanders'],
          summary: 'Create commander',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Commander' },
              },
            },
          },
          responses: {
            201: { description: 'Commander created successfully' },
          },
        },
      },
      '/commanders/{id}': {
        get: {
          tags: ['Commanders'],
          summary: 'Get commander by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Commander details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Commander' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Commanders'],
          summary: 'Update commander',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Commander' },
              },
            },
          },
          responses: {
            200: { description: 'Commander updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Commanders'],
          summary: 'Delete commander',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Commander deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/universities': {
        get: {
          tags: ['Universities'],
          summary: 'Get all universities',
          responses: {
            200: {
              description: 'List of universities',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/University' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Universities'],
          summary: 'Create university',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' },
              },
            },
          },
          responses: {
            201: { description: 'University created successfully' },
          },
        },
      },
      '/universities/{id}': {
        get: {
          tags: ['Universities'],
          summary: 'Get university by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'University details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/University' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Universities'],
          summary: 'Update university',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' },
              },
            },
          },
          responses: {
            200: { description: 'University updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Universities'],
          summary: 'Delete university',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'University deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/organizations': {
        get: {
          tags: ['Organizations'],
          summary: 'Get all organizations',
          responses: {
            200: {
              description: 'List of organizations',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Organization' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Organizations'],
          summary: 'Create organization',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' },
              },
            },
          },
          responses: {
            201: { description: 'Organization created successfully' },
          },
        },
      },
      '/organizations/{id}': {
        get: {
          tags: ['Organizations'],
          summary: 'Get organization by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Organization details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Organization' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Organizations'],
          summary: 'Update organization',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' },
              },
            },
          },
          responses: {
            200: { description: 'Organization updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Organizations'],
          summary: 'Delete organization',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Organization deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/education-levels': {
        get: {
          tags: ['EducationLevels'],
          summary: 'Get all education levels',
          responses: {
            200: {
              description: 'List of education levels',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/EducationLevel' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['EducationLevels'],
          summary: 'Create education level',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EducationLevel' },
              },
            },
          },
          responses: {
            201: { description: 'Education level created successfully' },
          },
        },
      },
      '/education-levels/{id}': {
        get: {
          tags: ['EducationLevels'],
          summary: 'Get education level by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Education level details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/EducationLevel' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['EducationLevels'],
          summary: 'Update education level',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EducationLevel' },
              },
            },
          },
          responses: {
            200: { description: 'Education level updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['EducationLevels'],
          summary: 'Delete education level',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Education level deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/classes': {
        get: {
          tags: ['Classes'],
          summary: 'Get all classes',
          responses: {
            200: {
              description: 'List of classes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Class' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Classes'],
          summary: 'Create class',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Class' },
              },
            },
          },
          responses: {
            201: { description: 'Class created successfully' },
          },
        },
      },
      '/classes/{id}': {
        get: {
          tags: ['Classes'],
          summary: 'Get class by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Class details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Class' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Classes'],
          summary: 'Update class',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Class' },
              },
            },
          },
          responses: {
            200: { description: 'Class updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Classes'],
          summary: 'Delete class',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Class deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/yearly-results': {
        get: {
          tags: ['YearlyResults'],
          summary: 'Get all yearly results',
          responses: {
            200: {
              description: 'List of yearly results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/YearlyResult' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['YearlyResults'],
          summary: 'Create yearly result',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/YearlyResult' },
              },
            },
          },
          responses: {
            201: { description: 'Yearly result created successfully' },
          },
        },
      },
      '/yearly-results/{id}': {
        get: {
          tags: ['YearlyResults'],
          summary: 'Get yearly result by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Yearly result details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/YearlyResult' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['YearlyResults'],
          summary: 'Update yearly result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/YearlyResult' },
              },
            },
          },
          responses: {
            200: { description: 'Yearly result updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['YearlyResults'],
          summary: 'Delete yearly result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Yearly result deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/semester-results': {
        get: {
          tags: ['SemesterResults'],
          summary: 'Get all semester results',
          responses: {
            200: {
              description: 'List of semester results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SemesterResult' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['SemesterResults'],
          summary: 'Create semester result',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SemesterResult' },
              },
            },
          },
          responses: {
            201: { description: 'Semester result created successfully' },
          },
        },
      },
      '/semester-results/{id}': {
        get: {
          tags: ['SemesterResults'],
          summary: 'Get semester result by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Semester result details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SemesterResult' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['SemesterResults'],
          summary: 'Update semester result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SemesterResult' },
              },
            },
          },
          responses: {
            200: { description: 'Semester result updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['SemesterResults'],
          summary: 'Delete semester result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Semester result deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/subject-results': {
        get: {
          tags: ['SubjectResults'],
          summary: 'Get all subject results',
          responses: {
            200: {
              description: 'List of subject results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SubjectResult' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['SubjectResults'],
          summary: 'Create subject result',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubjectResult' },
              },
            },
          },
          responses: {
            201: { description: 'Subject result created successfully' },
          },
        },
      },
      '/subject-results/{id}': {
        get: {
          tags: ['SubjectResults'],
          summary: 'Get subject result by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Subject result details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SubjectResult' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['SubjectResults'],
          summary: 'Update subject result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubjectResult' },
              },
            },
          },
          responses: {
            200: { description: 'Subject result updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['SubjectResults'],
          summary: 'Delete subject result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Subject result deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/semesters': {
        get: {
          tags: ['Semesters'],
          summary: 'Get all semesters',
          responses: {
            200: {
              description: 'List of semesters',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Semester' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Semesters'],
          summary: 'Create semester',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Semester' },
              },
            },
          },
          responses: {
            201: { description: 'Semester created successfully' },
          },
        },
      },
      '/semesters/{id}': {
        get: {
          tags: ['Semesters'],
          summary: 'Get semester by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Semester details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Semester' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Semesters'],
          summary: 'Update semester',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Semester' },
              },
            },
          },
          responses: {
            200: { description: 'Semester updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Semesters'],
          summary: 'Delete semester',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Semester deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/time-tables': {
        get: {
          tags: ['TimeTables'],
          summary: 'Get all timetables',
          responses: {
            200: {
              description: 'List of timetables',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/TimeTable' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['TimeTables'],
          summary: 'Create timetable',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TimeTable' },
              },
            },
          },
          responses: {
            201: { description: 'Timetable created successfully' },
          },
        },
      },
      '/time-tables/{id}': {
        get: {
          tags: ['TimeTables'],
          summary: 'Get timetable by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Timetable details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TimeTable' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['TimeTables'],
          summary: 'Update timetable',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TimeTable' },
              },
            },
          },
          responses: {
            200: { description: 'Timetable updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['TimeTables'],
          summary: 'Delete timetable',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Timetable deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/tuition-fees': {
        get: {
          tags: ['TuitionFees'],
          summary: 'Get all tuition fees',
          responses: {
            200: {
              description: 'List of tuition fees',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/TuitionFee' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['TuitionFees'],
          summary: 'Create tuition fee',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TuitionFee' },
              },
            },
          },
          responses: {
            201: { description: 'Tuition fee created successfully' },
          },
        },
      },
      '/tuition-fees/{id}': {
        get: {
          tags: ['TuitionFees'],
          summary: 'Get tuition fee by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Tuition fee details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TuitionFee' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['TuitionFees'],
          summary: 'Update tuition fee',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TuitionFee' },
              },
            },
          },
          responses: {
            200: { description: 'Tuition fee updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['TuitionFees'],
          summary: 'Delete tuition fee',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Tuition fee deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/achievements': {
        get: {
          tags: ['Achievements'],
          summary: 'Get all achievements',
          responses: {
            200: {
              description: 'List of achievements',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Achievement' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Achievements'],
          summary: 'Create achievement',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Achievement' },
              },
            },
          },
          responses: {
            201: { description: 'Achievement created successfully' },
          },
        },
      },
      '/achievements/{id}': {
        get: {
          tags: ['Achievements'],
          summary: 'Get achievement by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Achievement details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Achievement' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Achievements'],
          summary: 'Update achievement',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Achievement' },
              },
            },
          },
          responses: {
            200: { description: 'Achievement updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Achievements'],
          summary: 'Delete achievement',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Achievement deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/achievement-profiles': {
        get: {
          tags: ['AchievementProfiles'],
          summary: 'Get all achievement profiles',
          responses: {
            200: {
              description: 'List of achievement profiles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/AchievementProfile' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['AchievementProfiles'],
          summary: 'Create achievement profile',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AchievementProfile' },
              },
            },
          },
          responses: {
            201: { description: 'Achievement profile created successfully' },
          },
        },
      },
      '/achievement-profiles/{id}': {
        get: {
          tags: ['AchievementProfiles'],
          summary: 'Get achievement profile by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Achievement profile details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AchievementProfile' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['AchievementProfiles'],
          summary: 'Update achievement profile',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AchievementProfile' },
              },
            },
          },
          responses: {
            200: { description: 'Achievement profile updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['AchievementProfiles'],
          summary: 'Delete achievement profile',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Achievement profile deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/yearly-achievements': {
        get: {
          tags: ['YearlyAchievements'],
          summary: 'Get all yearly achievements',
          responses: {
            200: {
              description: 'List of yearly achievements',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/YearlyAchievement' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['YearlyAchievements'],
          summary: 'Create yearly achievement',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/YearlyAchievement' },
              },
            },
          },
          responses: {
            201: { description: 'Yearly achievement created successfully' },
          },
        },
      },
      '/yearly-achievements/{id}': {
        get: {
          tags: ['YearlyAchievements'],
          summary: 'Get yearly achievement by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Yearly achievement details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/YearlyAchievement' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['YearlyAchievements'],
          summary: 'Update yearly achievement',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/YearlyAchievement' },
              },
            },
          },
          responses: {
            200: { description: 'Yearly achievement updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['YearlyAchievements'],
          summary: 'Delete yearly achievement',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Yearly achievement deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/scientific-initiatives': {
        get: {
          tags: ['ScientificInitiatives'],
          summary: 'Get all scientific initiatives',
          responses: {
            200: {
              description: 'List of scientific initiatives',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ScientificInitiative' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['ScientificInitiatives'],
          summary: 'Create scientific initiative',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScientificInitiative' },
              },
            },
          },
          responses: {
            201: { description: 'Scientific initiative created successfully' },
          },
        },
      },
      '/scientific-initiatives/{id}': {
        get: {
          tags: ['ScientificInitiatives'],
          summary: 'Get scientific initiative by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Scientific initiative details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ScientificInitiative' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['ScientificInitiatives'],
          summary: 'Update scientific initiative',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScientificInitiative' },
              },
            },
          },
          responses: {
            200: { description: 'Scientific initiative updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['ScientificInitiatives'],
          summary: 'Delete scientific initiative',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Scientific initiative deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/scientific-topics': {
        get: {
          tags: ['ScientificTopics'],
          summary: 'Get all scientific topics',
          responses: {
            200: {
              description: 'List of scientific topics',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ScientificTopic' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['ScientificTopics'],
          summary: 'Create scientific topic',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScientificTopic' },
              },
            },
          },
          responses: {
            201: { description: 'Scientific topic created successfully' },
          },
        },
      },
      '/scientific-topics/{id}': {
        get: {
          tags: ['ScientificTopics'],
          summary: 'Get scientific topic by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Scientific topic details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ScientificTopic' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['ScientificTopics'],
          summary: 'Update scientific topic',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScientificTopic' },
              },
            },
          },
          responses: {
            200: { description: 'Scientific topic updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['ScientificTopics'],
          summary: 'Delete scientific topic',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Scientific topic deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/cut-rice': {
        get: {
          tags: ['CutRice'],
          summary: 'Get all cut rice records',
          responses: {
            200: {
              description: 'List of cut rice records',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CutRice' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['CutRice'],
          summary: 'Create cut rice record',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CutRice' },
              },
            },
          },
          responses: {
            201: { description: 'Cut rice record created successfully' },
          },
        },
      },
      '/cut-rice/{id}': {
        get: {
          tags: ['CutRice'],
          summary: 'Get cut rice record by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Cut rice record details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CutRice' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['CutRice'],
          summary: 'Update cut rice record',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CutRice' },
              },
            },
          },
          responses: {
            200: { description: 'Cut rice record updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['CutRice'],
          summary: 'Delete cut rice record',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Cut rice record deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/commander-duty-schedules': {
        get: {
          tags: ['CommanderDutySchedules'],
          summary: 'Get all commander duty schedules',
          responses: {
            200: {
              description: 'List of commander duty schedules',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CommanderDutySchedule' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['CommanderDutySchedules'],
          summary: 'Create commander duty schedule',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommanderDutySchedule' },
              },
            },
          },
          responses: {
            201: { description: 'Commander duty schedule created successfully' },
          },
        },
      },
      '/commander-duty-schedules/{id}': {
        get: {
          tags: ['CommanderDutySchedules'],
          summary: 'Get commander duty schedule by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: {
              description: 'Commander duty schedule details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CommanderDutySchedule' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['CommanderDutySchedules'],
          summary: 'Update commander duty schedule',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommanderDutySchedule' },
              },
            },
          },
          responses: {
            200: { description: 'Commander duty schedule updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['CommanderDutySchedules'],
          summary: 'Delete commander duty schedule',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Commander duty schedule deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Get all notifications',
          responses: {
            200: {
              description: 'List of notifications',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Notifications'],
          summary: 'Create notification',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Notification' },
              },
            },
          },
          responses: {
            201: { description: 'Notification created successfully' },
          },
        },
      },
      '/notifications/{id}': {
        get: {
          tags: ['Notifications'],
          summary: 'Get notification by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: {
              description: 'Notification details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Notification' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        put: {
          tags: ['Notifications'],
          summary: 'Update notification',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Notification' },
              },
            },
          },
          responses: {
            200: { description: 'Notification updated successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Notifications'],
          summary: 'Delete notification',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Notification deleted successfully' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
