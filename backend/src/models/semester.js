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
    academic_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    registration_start: {
      type: DataTypes.DATEONLY,
    },
    registration_end: {
      type: DataTypes.DATEONLY,
    },
    exam_start: {
      type: DataTypes.DATEONLY,
    },
    exam_end: {
      type: DataTypes.DATEONLY,
    },
    grade_entry_deadline: {
      type: DataTypes.DATEONLY,
    },
    is_active: {
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
