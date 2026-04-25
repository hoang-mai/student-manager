module.exports = (sequelize, DataTypes) => {
  const AcademicYear = sequelize.define('AcademicYear', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    start_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'academic_years',
    timestamps: true,
    underscored: true,
  });

  return AcademicYear;
};
