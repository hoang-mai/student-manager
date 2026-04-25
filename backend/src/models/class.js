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
    major_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    training_unit_id: {
      type: DataTypes.INTEGER,
    },
    commander_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'classes',
    timestamps: true,
    underscored: true,
  });

  return Class;
};
