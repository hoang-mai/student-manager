const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken, getTestData } = require('./helpers');

describe('Grades API', () => {
  let adminToken, chiHuyToken, studentToken;
  beforeAll(() => {
    adminToken = getAdminToken();
    chiHuyToken = getChiHuyToken();
    studentToken = getStudentToken();
  });

  it('GET /api/grades should return paginated list', async () => {
    const res = await request(app)
      .get('/api/grades')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/grades/:id should return grade', async () => {
    const { grade } = getTestData();
    const res = await request(app)
      .get(`/api/grades/${grade.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(grade.id);
  });

  it('POST /api/grades should create grade (admin)', async () => {
    const { studentProfile, course, semester } = getTestData();
    const res = await request(app)
      .post('/api/grades')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentProfile.id,
        course_id: course.id,
        semester_id: semester.id,
        score_10: 9.0,
        score_4: 4.0,
        letter_grade: 'A',
        status: 'PASSED',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/grades/:id should update grade', async () => {
    const { grade } = getTestData();
    const res = await request(app)
      .put(`/api/grades/${grade.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ score_10: 7.5 });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/grades/:id should delete grade', async () => {
    const { studentProfile, course, semester } = getTestData();
    const db = require('../src/models');
    const newGrade = await db.grade.create({
      student_id: studentProfile.id,
      course_id: course.id,
      semester_id: semester.id,
      score_10: 5.0,
      created_by: 1,
    });

    const res = await request(app)
      .delete(`/api/grades/${newGrade.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });

  it('POST /api/grades should reject for student', async () => {
    const res = await request(app)
      .post('/api/grades')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({});
    expect(res.status).toBe(403);
  });
});
