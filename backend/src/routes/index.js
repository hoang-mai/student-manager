const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/', require('./gradeRequest.route')); // must be before /students to avoid path conflict
router.use('/users', require('./user.route'));
router.use('/students', require('./student.route'));
router.use('/commanders', require('./commander.route'));
router.use('/universities', require('./university.route'));
router.use('/organizations', require('./organization.route'));
router.use('/education-levels', require('./educationLevel.route'));
router.use('/classes', require('./class.route'));
router.use('/yearly-results', require('./yearlyResult.route'));
router.use('/semester-results', require('./semesterResult.route'));
router.use('/subject-results', require('./subjectResult.route'));
router.use('/semesters', require('./semester.route'));
router.use('/time-tables', require('./timeTable.route'));
router.use('/tuition-fees', require('./tuitionFee.route'));
router.use('/achievements', require('./achievement.route'));
router.use('/achievement-profiles', require('./achievementProfile.route'));
router.use('/yearly-achievements', require('./yearlyAchievement.route'));
router.use('/scientific-initiatives', require('./scientificInitiative.route'));
router.use('/scientific-topics', require('./scientificTopic.route'));
router.use('/cut-rice', require('./cutRice.route'));
router.use('/commander-duty-schedules', require('./commanderDutySchedule.route'));
router.use('/notifications', require('./notification.route'));

module.exports = router;