module.exports = (sequelize, DataTypes) => {
  const TimeTable = sequelize.define('TimeTable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    schedules: {
      type: DataTypes.JSONB,
    },
  }, {
    tableName: 'time_tables',
    timestamps: true,
    underscored: true,
  });

  return TimeTable;
};
