module.exports = (sequelize, DataTypes) => {
  const DutyRoster = sequelize.define('DutyRoster', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dutyDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    shift: {
      type: DataTypes.ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'FULL'),
      allowNull: false,
    },
    dutyType: {
      type: DataTypes.ENUM('COMMAND', 'SECURITY', 'OTHER'),
      defaultValue: 'OTHER',
    },
    note: {
      type: DataTypes.TEXT,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'duty_rosters',
    timestamps: true,
    underscored: true,
  });

  return DutyRoster;
};
