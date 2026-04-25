const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/students', require('./student.route'));
router.use('/grades', require('./grade.route'));
router.use('/grade-requests', require('./gradeRequest.route'));
router.use('/schedules', require('./schedule.route'));
router.use('/meal-schedules', require('./mealSchedule.route'));
router.use('/tuitions', require('./tuition.route'));
router.use('/achievements', require('./achievement.route'));
router.use('/duty-rosters', require('./dutyRoster.route'));
router.use('/universities', require('./university.route'));
router.use('/classes', require('./class.route'));
router.use('/semesters', require('./semester.route'));
router.use('/courses', require('./course.route'));
router.use('/reports', require('./report.route'));

module.exports = router;
