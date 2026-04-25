module.exports = (sequelize, DataTypes) => {
  const Tuition = sequelize.define('Tuition', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM('PAID', 'UNPAID', 'PARTIAL'),
      defaultValue: 'UNPAID',
    },
    due_date: {
      type: DataTypes.DATEONLY,
    },
    paid_at: {
      type: DataTypes.DATE,
    },
    note: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'tuitions',
    timestamps: true,
    underscored: true,
  });

  return Tuition;
};
