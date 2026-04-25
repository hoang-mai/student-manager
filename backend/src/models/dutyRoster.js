module.exports = (sequelize, DataTypes) => {
  const DutyRoster = sequelize.define('DutyRoster', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duty_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    shift: {
      type: DataTypes.ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'FULL'),
      allowNull: false,
    },
    duty_type: {
      type: DataTypes.ENUM('COMMAND', 'SECURITY', 'OTHER'),
      defaultValue: 'OTHER',
    },
    note: {
      type: DataTypes.TEXT,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'duty_rosters',
    timestamps: true,
    underscored: true,
  });

  return DutyRoster;
};
