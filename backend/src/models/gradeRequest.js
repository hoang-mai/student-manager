module.exports = (sequelize, DataTypes) => {
  const GradeRequest = sequelize.define('GradeRequest', {
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
    request_type: {
      type: DataTypes.ENUM('ADD', 'UPDATE', 'DELETE'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    proposed_score_10: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
    },
    review_note: {
      type: DataTypes.TEXT,
    },
    reviewed_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'grade_requests',
    timestamps: true,
    underscored: true,
  });

  return GradeRequest;
};
