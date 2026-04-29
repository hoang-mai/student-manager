module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score10: {
      type: DataTypes.FLOAT,
      field: 'score_10',
    },
    score4: {
      type: DataTypes.FLOAT,
      field: 'score_4',
    },
    letterGrade: {
      type: DataTypes.STRING(5),
    },
    status: {
      type: DataTypes.ENUM('PASSED', 'FAILED', 'PENDING'),
      defaultValue: 'PENDING',
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'grades',
    timestamps: true,
    underscored: true,
  });

  return Grade;
};
