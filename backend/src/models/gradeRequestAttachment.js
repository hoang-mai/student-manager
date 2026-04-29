module.exports = (sequelize, DataTypes) => {
  const GradeRequestAttachment = sequelize.define('GradeRequestAttachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gradeRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING(50),
    },
  }, {
    tableName: 'grade_request_attachments',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  });

  return GradeRequestAttachment;
};
