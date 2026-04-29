module.exports = (sequelize, DataTypes) => {
  const MealSchedule = sequelize.define('MealSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scheduleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    session: {
      type: DataTypes.ENUM('MORNING', 'NOON', 'AFTERNOON', 'EVENING'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('REGISTERED', 'CANCELLED'),
      defaultValue: 'REGISTERED',
    },
  }, {
    tableName: 'meal_schedules',
    timestamps: true,
    underscored: true,
  });

  return MealSchedule;
};
