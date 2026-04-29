module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    achievementType: {
      type: DataTypes.ENUM('REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'),
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING(100),
    },
    issueDate: {
      type: DataTypes.DATEONLY,
    },
    description: {
      type: DataTypes.TEXT,
    },
    fileUrl: {
      type: DataTypes.STRING(500),
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'achievements',
    timestamps: true,
    underscored: true,
  });

  return Achievement;
};
