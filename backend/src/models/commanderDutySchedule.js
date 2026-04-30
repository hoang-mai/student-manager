module.exports = (sequelize, DataTypes) => {
  const CommanderDutySchedule = sequelize.define('CommanderDutySchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
    },
    rank: {
      type: DataTypes.STRING(50),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    position: {
      type: DataTypes.STRING(100),
    },
    workDay: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'commander_duty_schedules',
    timestamps: true,
    underscored: true,
  });

  return CommanderDutySchedule;
};
