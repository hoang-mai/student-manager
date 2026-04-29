module.exports = (sequelize, DataTypes) => {
  const Tuition = sequelize.define('Tuition', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM('PAID', 'UNPAID', 'PARTIAL'),
      defaultValue: 'UNPAID',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    paidAt: {
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
