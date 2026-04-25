module.exports = (sequelize, DataTypes) => {
  const GradeRequestAttachment = sequelize.define('GradeRequestAttachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    grade_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING(255),
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    file_type: {
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
