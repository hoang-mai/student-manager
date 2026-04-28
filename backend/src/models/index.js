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

// Models
db.role = require('./role.js')(sequelize, DataTypes);
db.permission = require('./permission.js')(sequelize, DataTypes);
db.rolePermission = require('./rolePermission.js')(sequelize, DataTypes);
db.user = require('./user.js')(sequelize, DataTypes);
db.trainingUnit = require('./trainingUnit.js')(sequelize, DataTypes);
db.university = require('./university.js')(sequelize, DataTypes);
db.major = require('./major.js')(sequelize, DataTypes);
db.academicYear = require('./academicYear.js')(sequelize, DataTypes);
db.class = require('./class.js')(sequelize, DataTypes);
db.semester = require('./semester.js')(sequelize, DataTypes);
db.course = require('./course.js')(sequelize, DataTypes);
db.studentProfile = require('./studentProfile.js')(sequelize, DataTypes);
db.grade = require('./grade.js')(sequelize, DataTypes);
db.gradeRequest = require('./gradeRequest.js')(sequelize, DataTypes);
db.gradeRequestAttachment = require('./gradeRequestAttachment.js')(sequelize, DataTypes);
db.achievement = require('./achievement.js')(sequelize, DataTypes);
db.schedule = require('./schedule.js')(sequelize, DataTypes);
db.mealSchedule = require('./mealSchedule.js')(sequelize, DataTypes);
db.tuition = require('./tuition.js')(sequelize, DataTypes);
db.dutyRoster = require('./dutyRoster.js')(sequelize, DataTypes);

// ==========================
// Relations
// ==========================

// Role <-> Permission (N:M)
db.role.belongsToMany(db.permission, { through: db.rolePermission, foreignKey: 'role_id' });
db.permission.belongsToMany(db.role, { through: db.rolePermission, foreignKey: 'permission_id' });

// Role <-> User (1:N)
db.role.hasMany(db.user, { foreignKey: 'role_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.user.belongsTo(db.role, { foreignKey: 'role_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// TrainingUnit <-> User (commander)
db.user.hasMany(db.trainingUnit, { foreignKey: 'commander_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.trainingUnit.belongsTo(db.user, { foreignKey: 'commander_id', as: 'commander', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// University <-> Major (1:N)
db.university.hasMany(db.major, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.major.belongsTo(db.university, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// AcademicYear <-> Class (1:N)
db.academicYear.hasMany(db.class, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.class.belongsTo(db.academicYear, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// AcademicYear <-> Semester (1:N)
db.academicYear.hasMany(db.semester, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.semester.belongsTo(db.academicYear, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Major <-> Class (1:N)
db.major.hasMany(db.class, { foreignKey: 'major_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.class.belongsTo(db.major, { foreignKey: 'major_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// TrainingUnit <-> Class (1:N)
db.trainingUnit.hasMany(db.class, { foreignKey: 'training_unit_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.class.belongsTo(db.trainingUnit, { foreignKey: 'training_unit_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// User (commander) <-> Class (1:N)
db.user.hasMany(db.class, { foreignKey: 'commander_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.class.belongsTo(db.user, { foreignKey: 'commander_id', as: 'commander', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// User <-> StudentProfile (1:1)
db.user.hasOne(db.studentProfile, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.studentProfile.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Class <-> StudentProfile (1:N)
db.class.hasMany(db.studentProfile, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.studentProfile.belongsTo(db.class, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// University <-> StudentProfile (1:N)
db.university.hasMany(db.studentProfile, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.studentProfile.belongsTo(db.university, { foreignKey: 'university_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// Major <-> StudentProfile (1:N)
db.major.hasMany(db.studentProfile, { foreignKey: 'major_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.studentProfile.belongsTo(db.major, { foreignKey: 'major_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// AcademicYear <-> StudentProfile (1:N)
db.academicYear.hasMany(db.studentProfile, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.studentProfile.belongsTo(db.academicYear, { foreignKey: 'academic_year_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// TrainingUnit <-> StudentProfile (1:N)
db.trainingUnit.hasMany(db.studentProfile, { foreignKey: 'training_unit_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.studentProfile.belongsTo(db.trainingUnit, { foreignKey: 'training_unit_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// StudentProfile <-> Grade (1:N)
db.studentProfile.hasMany(db.grade, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.grade.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Course <-> Grade (1:N)
db.course.hasMany(db.grade, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.grade.belongsTo(db.course, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// Semester <-> Grade (1:N)
db.semester.hasMany(db.grade, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.grade.belongsTo(db.semester, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// User (creator) <-> Grade (1:N)
db.user.hasMany(db.grade, { foreignKey: 'created_by', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.grade.belongsTo(db.user, { foreignKey: 'created_by', as: 'creator', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// StudentProfile <-> GradeRequest (1:N)
db.studentProfile.hasMany(db.gradeRequest, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.gradeRequest.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Course <-> GradeRequest (1:N)
db.course.hasMany(db.gradeRequest, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.gradeRequest.belongsTo(db.course, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// Semester <-> GradeRequest (1:N)
db.semester.hasMany(db.gradeRequest, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.gradeRequest.belongsTo(db.semester, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// User (reviewer) <-> GradeRequest (1:N)
db.user.hasMany(db.gradeRequest, { foreignKey: 'reviewer_id', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.gradeRequest.belongsTo(db.user, { foreignKey: 'reviewer_id', as: 'reviewer', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// GradeRequest <-> GradeRequestAttachment (1:N)
db.gradeRequest.hasMany(db.gradeRequestAttachment, { foreignKey: 'grade_request_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.gradeRequestAttachment.belongsTo(db.gradeRequest, { foreignKey: 'grade_request_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// StudentProfile <-> Achievement (1:N)
db.studentProfile.hasMany(db.achievement, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.achievement.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// User (creator) <-> Achievement (1:N)
db.user.hasMany(db.achievement, { foreignKey: 'created_by', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.achievement.belongsTo(db.user, { foreignKey: 'created_by', as: 'creator', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

// Class <-> Schedule (1:N)
db.class.hasMany(db.schedule, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.schedule.belongsTo(db.class, { foreignKey: 'class_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// StudentProfile <-> Schedule (1:N)
db.studentProfile.hasMany(db.schedule, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.schedule.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Course <-> Schedule (1:N)
db.course.hasMany(db.schedule, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.schedule.belongsTo(db.course, { foreignKey: 'course_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Semester <-> Schedule (1:N)
db.semester.hasMany(db.schedule, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.schedule.belongsTo(db.semester, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// StudentProfile <-> MealSchedule (1:N)
db.studentProfile.hasMany(db.mealSchedule, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.mealSchedule.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// StudentProfile <-> Tuition (1:N)
db.studentProfile.hasMany(db.tuition, { foreignKey: 'student_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.tuition.belongsTo(db.studentProfile, { foreignKey: 'student_id', as: 'student', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// Semester <-> Tuition (1:N)
db.semester.hasMany(db.tuition, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
db.tuition.belongsTo(db.semester, { foreignKey: 'semester_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

// User <-> DutyRoster (1:N)
db.user.hasMany(db.dutyRoster, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.dutyRoster.belongsTo(db.user, { foreignKey: 'user_id', as: 'user', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// User (creator) <-> DutyRoster (1:N)
db.user.hasMany(db.dutyRoster, { foreignKey: 'created_by', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.dutyRoster.belongsTo(db.user, { foreignKey: 'created_by', as: 'creator', onUpdate: 'CASCADE', onDelete: 'SET NULL' });

module.exports = db;
