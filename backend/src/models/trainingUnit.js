module.exports = (sequelize, DataTypes) => {
  const TrainingUnit = sequelize.define('TrainingUnit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    commanderId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'training_units',
    timestamps: true,
    underscored: true,
  });

  return TrainingUnit;
};
