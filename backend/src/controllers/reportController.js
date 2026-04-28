const reportService = require('../services/report.service');
const { success, error } = require('../utils/response');

const getStudentStats = async (req, res) => {
  try {
    const result = await reportService.getStudentStats();
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getGradeStats = async (req, res) => {
  try {
    const result = await reportService.getGradeStats(req.query.semester_id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getTuitionStats = async (req, res) => {
  try {
    const result = await reportService.getTuitionStats();
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = { getStudentStats, getGradeStats, getTuitionStats };
