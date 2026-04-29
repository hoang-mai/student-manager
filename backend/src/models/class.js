module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
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
    majorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    academicYearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trainingUnitId: {
      type: DataTypes.INTEGER,
    },
    commanderId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'classes',
    timestamps: true,
    underscored: true,
  });

  return Class;
};
