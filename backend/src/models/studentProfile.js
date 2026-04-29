module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define('StudentProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    studentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    classId: {
      type: DataTypes.INTEGER,
    },
    universityId: {
      type: DataTypes.INTEGER,
    },
    majorId: {
      type: DataTypes.INTEGER,
    },
    academicYearId: {
      type: DataTypes.INTEGER,
    },
    trainingUnitId: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    idCardNumber: {
      type: DataTypes.STRING(20),
    },
    militaryRank: {
      type: DataTypes.STRING(50),
    },
    unit: {
      type: DataTypes.STRING(255),
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM('STUDYING', 'GRADUATED', 'SUSPENDED', 'DROPPED'),
      defaultValue: 'STUDYING',
    },
  }, {
    tableName: 'student_profiles',
    timestamps: true,
    underscored: true,
  });

  return StudentProfile;
};
