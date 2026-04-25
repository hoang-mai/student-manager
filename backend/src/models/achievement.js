module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    achievement_type: {
      type: DataTypes.ENUM('REWARD', 'SCIENTIFIC_TOPIC', 'TRAINING'),
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING(100),
    },
    issue_date: {
      type: DataTypes.DATEONLY,
    },
    description: {
      type: DataTypes.TEXT,
    },
    file_url: {
      type: DataTypes.STRING(500),
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'achievements',
    timestamps: true,
    underscored: true,
  });

  return Achievement;
};
