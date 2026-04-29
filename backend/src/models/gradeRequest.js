module.exports = (sequelize, DataTypes) => {
  const GradeRequest = sequelize.define('GradeRequest', {
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
    requestType: {
      type: DataTypes.ENUM('ADD', 'UPDATE', 'DELETE'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    proposedScore10: {
      type: DataTypes.FLOAT,
      field: 'proposed_score_10',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    reviewerId: {
      type: DataTypes.INTEGER,
    },
    reviewNote: {
      type: DataTypes.TEXT,
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'grade_requests',
    timestamps: true,
    underscored: true,
  });

  return GradeRequest;
};
