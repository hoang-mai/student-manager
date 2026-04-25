module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define('StudentProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    student_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
    },
    university_id: {
      type: DataTypes.INTEGER,
    },
    major_id: {
      type: DataTypes.INTEGER,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    training_unit_id: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    id_card_number: {
      type: DataTypes.STRING(20),
    },
    military_rank: {
      type: DataTypes.STRING(50),
    },
    unit: {
      type: DataTypes.STRING(255),
    },
    enrollment_date: {
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
