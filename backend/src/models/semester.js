module.exports = (sequelize, DataTypes) => {
  const Semester = sequelize.define('Semester', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    schoolYearId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    schoolYear: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    tableName: 'semesters',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['school_year_id', 'code'],
      },
    ],
  });

  return Semester;
};
