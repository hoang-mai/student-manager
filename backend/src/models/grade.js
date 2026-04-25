module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score_10: {
      type: DataTypes.FLOAT,
    },
    score_4: {
      type: DataTypes.FLOAT,
    },
    letter_grade: {
      type: DataTypes.STRING(5),
    },
    status: {
      type: DataTypes.ENUM('PASSED', 'FAILED', 'PENDING'),
      defaultValue: 'PENDING',
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'grades',
    timestamps: true,
    underscored: true,
  });

  return Grade;
};
