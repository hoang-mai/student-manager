module.exports = (sequelize, DataTypes) => {
  const Semester = sequelize.define('Semester', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    academicYearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    registrationStart: {
      type: DataTypes.DATEONLY,
    },
    registrationEnd: {
      type: DataTypes.DATEONLY,
    },
    examStart: {
      type: DataTypes.DATEONLY,
    },
    examEnd: {
      type: DataTypes.DATEONLY,
    },
    gradeEntryDeadline: {
      type: DataTypes.DATEONLY,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'semesters',
    timestamps: true,
    underscored: true,
  });

  return Semester;
};
