const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
      dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false
          }
      },
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==========================
// Models
// ==========================

// Nhóm Quản lý Tổ chức & Cơ sở
db.university = require('./university.js')(sequelize, DataTypes);
db.organization = require('./organization.js')(sequelize, DataTypes);
db.educationLevel = require('./educationLevel.js')(sequelize, DataTypes);
db.class = require('./class.js')(sequelize, DataTypes);

// Nhóm Hồ sơ Sinh viên
db.student = require('./student.js')(sequelize, DataTypes);
db.commander = require('./commander.js')(sequelize, DataTypes);
db.user = require('./user.js')(sequelize, DataTypes);

// Nhóm Kết quả Học tập & Đào tạo
db.yearlyResult = require('./yearlyResult.js')(sequelize, DataTypes);
db.semesterResult = require('./semesterResult.js')(sequelize, DataTypes);
db.subjectResult = require('./subjectResult.js')(sequelize, DataTypes);
db.semester = require('./semester.js')(sequelize, DataTypes);
db.timeTable = require('./timeTable.js')(sequelize, DataTypes);
db.tuitionFee = require('./tuitionFee.js')(sequelize, DataTypes);

// Nhóm Thi đua & Nghiên cứu
db.achievement = require('./achievement.js')(sequelize, DataTypes);
db.achievementProfile = require('./achievementProfile.js')(sequelize, DataTypes);
db.yearlyAchievement = require('./yearlyAchievement.js')(sequelize, DataTypes);
db.scientificInitiative = require('./scientificInitiative.js')(sequelize, DataTypes);
db.scientificTopic = require('./scientificTopic.js')(sequelize, DataTypes);

// Nhóm Bổ trợ & Lịch trình
db.commanderDutySchedule = require('./commanderDutySchedule.js')(sequelize, DataTypes);
db.cutRice = require('./cutRice.js')(sequelize, DataTypes);
db.notification = require('./notification.js')(sequelize, DataTypes);
db.gradeRequest = require('./gradeRequest.js')(sequelize, DataTypes);

// ==========================
// Relations
// ==========================

// --- Nhóm Quản lý Tổ chức & Cơ sở ---

// University 1:N Organization
db.university.hasMany(db.organization, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.organization.belongsTo(db.university, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// Organization 1:N EducationLevel
db.organization.hasMany(db.educationLevel, { foreignKey: 'organization_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.educationLevel.belongsTo(db.organization, { foreignKey: 'organization_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// EducationLevel 1:N Class
db.educationLevel.hasMany(db.class, { foreignKey: 'education_level_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.class.belongsTo(db.educationLevel, { foreignKey: 'education_level_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// --- Nhóm Hồ sơ Sinh viên ---

// Class 1:N Student
db.class.hasMany(db.student, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.student.belongsTo(db.class, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// Organization 1:N Student
db.organization.hasMany(db.student, { foreignKey: 'organization_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.student.belongsTo(db.organization, { foreignKey: 'organization_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// University 1:N Student
db.university.hasMany(db.student, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.student.belongsTo(db.university, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// EducationLevel 1:N Student
db.educationLevel.hasMany(db.student, { foreignKey: 'education_level_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.student.belongsTo(db.educationLevel, { foreignKey: 'education_level_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// Commander 1:1 User
db.commander.hasOne(db.user, { foreignKey: 'commander_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.user.belongsTo(db.commander, { foreignKey: 'commander_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// Student 1:1 User
db.student.hasOne(db.user, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.user.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// --- Nhóm Kết quả Học tập & Đào tạo ---

// Student 1:N YearlyResult
db.student.hasMany(db.yearlyResult, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.yearlyResult.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Student 1:N SemesterResult
db.student.hasMany(db.semesterResult, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.semesterResult.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// YearlyResult 1:N SemesterResult
db.yearlyResult.hasMany(db.semesterResult, { foreignKey: 'yearly_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.semesterResult.belongsTo(db.yearlyResult, { foreignKey: 'yearly_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// SemesterResult 1:N SubjectResult
db.semesterResult.hasMany(db.subjectResult, { foreignKey: 'semester_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.subjectResult.belongsTo(db.semesterResult, { foreignKey: 'semester_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Student 1:N TimeTable
db.student.hasMany(db.timeTable, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.timeTable.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Student 1:N TuitionFee
db.student.hasMany(db.tuitionFee, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.tuitionFee.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// --- Nhóm Thi đua & Nghiên cứu ---

// Student 1:N Achievement
db.student.hasMany(db.achievement, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.achievement.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Student 1:1 AchievementProfile
db.student.hasOne(db.achievementProfile, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.achievementProfile.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Student 1:N YearlyAchievement
db.student.hasMany(db.yearlyAchievement, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.yearlyAchievement.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// YearlyAchievement 1:N ScientificInitiative
db.yearlyAchievement.hasMany(db.scientificInitiative, { foreignKey: 'yearly_achievement_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.scientificInitiative.belongsTo(db.yearlyAchievement, { foreignKey: 'yearly_achievement_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// YearlyAchievement 1:N ScientificTopic
db.yearlyAchievement.hasMany(db.scientificTopic, { foreignKey: 'yearly_achievement_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.scientificTopic.belongsTo(db.yearlyAchievement, { foreignKey: 'yearly_achievement_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// --- Nhóm Bổ trợ & Lịch trình ---

// Student 1:N CutRice
db.student.hasMany(db.cutRice, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.cutRice.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// User 1:N Notification
db.user.hasMany(db.notification, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.notification.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// --- Nhóm Đề xuất ---

// Student 1:N GradeRequest
db.student.hasMany(db.gradeRequest, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.gradeRequest.belongsTo(db.student, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// SubjectResult 1:N GradeRequest
db.subjectResult.hasMany(db.gradeRequest, { foreignKey: 'subject_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.gradeRequest.belongsTo(db.subjectResult, { foreignKey: 'subject_result_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// User 1:N GradeRequest (reviewer)
db.user.hasMany(db.gradeRequest, { foreignKey: 'reviewer_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.gradeRequest.belongsTo(db.user, { as: 'reviewer', foreignKey: 'reviewer_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

module.exports = db;
