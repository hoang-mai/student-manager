module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classId: {
      type: DataTypes.INTEGER,
    },
    studentId: {
      type: DataTypes.INTEGER,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING(100),
    },
    scheduleType: {
      type: DataTypes.ENUM('CLASS', 'PERSONAL'),
      defaultValue: 'CLASS',
    },
  }, {
    tableName: 'schedules',
    timestamps: true,
    underscored: true,
  });

  return Schedule;
};
