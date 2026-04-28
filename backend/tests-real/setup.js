require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

let _tokens = {};
let _testData = {};

async function init() {
  const adminRes = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
  _tokens.admin = adminRes.body.data.accessToken;

  const chihuyRes = await request(app).post('/api/auth/login').send({ username: 'chihuy', password: 'chihuy123' });
  _tokens.chi_huy = chihuyRes.body.data.accessToken;

  const studentRes = await request(app).post('/api/auth/login').send({ username: 'student', password: 'student123' });
  _tokens.student = studentRes.body.data.accessToken;

  const adminUser = await db.user.findOne({ where: { username: 'admin' } });
  const chiHuyUser = await db.user.findOne({ where: { username: 'chihuy' } });
  const studentUser = await db.user.findOne({ where: { username: 'student' } });

  const studentProfile = await db.studentProfile.findOne();
  const university = await db.university.findOne();
  const major = await db.major.findOne();
  const academicYear = await db.academicYear.findOne();
  const cls = await db.class.findOne();
  const course = await db.course.findOne();
  const semester = await db.semester.findOne();
  const grade = await db.grade.findOne();
  const schedule = await db.schedule.findOne();
  const tuition = await db.tuition.findOne();
  const achievement = await db.achievement.findOne();
  const mealSchedule = await db.mealSchedule.findOne();
  const dutyRoster = await db.dutyRoster.findOne();
  const gradeRequest = await db.gradeRequest.findOne();

  _testData = {
    users: { admin: adminUser, chi_huy: chiHuyUser, student: studentUser },
    studentProfile,
    university,
    major,
    academicYear,
    class: cls,
    course,
    semester,
    grade,
    schedule,
    tuition,
    achievement,
    mealSchedule,
    dutyRoster,
    gradeRequest,
  };
}

beforeAll(async () => {
  await init();
});

afterAll(async () => {
  await db.sequelize.close();
});

module.exports = {
  getAdminToken: () => _tokens.admin,
  getChiHuyToken: () => _tokens.chi_huy,
  getStudentToken: () => _tokens.student,
  getTestData: () => _testData,
};
