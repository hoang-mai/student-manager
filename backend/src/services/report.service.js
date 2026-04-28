const db = require('../models');

const StudentProfile = db.studentProfile;
const Grade = db.grade;
const Tuition = db.tuition;
const Sequelize = db.Sequelize;

const getStudentStats = async () => {
  const totalStudents = await StudentProfile.count();
  const studying = await StudentProfile.count({ where: { status: 'STUDYING' } });
  const graduated = await StudentProfile.count({ where: { status: 'GRADUATED' } });
  const suspended = await StudentProfile.count({ where: { status: 'SUSPENDED' } });

  return { totalStudents, studying, graduated, suspended };
};

const getGradeStats = async (semester_id) => {
  const where = semester_id ? { semester_id } : {};

  const avgScore = await Grade.findOne({
    where,
    attributes: [[Sequelize.fn('AVG', Sequelize.col('score_10')), 'average_score_10']],
    raw: true,
  });

  const passed = await Grade.count({ where: { ...where, status: 'PASSED' } });
  const failed = await Grade.count({ where: { ...where, status: 'FAILED' } });
  const pending = await Grade.count({ where: { ...where, status: 'PENDING' } });

  return {
    averageScore10: parseFloat(avgScore.average_score_10) || 0,
    passed,
    failed,
    pending,
  };
};

const getTuitionStats = async () => {
  const paid = await Tuition.count({ where: { status: 'PAID' } });
  const unpaid = await Tuition.count({ where: { status: 'UNPAID' } });
  const partial = await Tuition.count({ where: { status: 'PARTIAL' } });

  return { paid, unpaid, partial };
};

module.exports = {
  getStudentStats,
  getGradeStats,
  getTuitionStats,
};
