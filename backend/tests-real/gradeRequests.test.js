const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken, getTestData } = require('./helpers');

describe('Grade Requests API', () => {
  let adminToken, chiHuyToken, studentToken;
  beforeAll(() => {
    adminToken = getAdminToken();
    chiHuyToken = getChiHuyToken();
    studentToken = getStudentToken();
  });

  it('GET /api/grade-requests should return list', async () => {
    const res = await request(app)
      .get('/api/grade-requests')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/grade-requests/:id should return request', async () => {
    const { gradeRequest } = getTestData();
    const res = await request(app)
      .get(`/api/grade-requests/${gradeRequest.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(gradeRequest.id);
  });

  it('POST /api/grade-requests should create request (student)', async () => {
    const { studentProfile, course, semester } = getTestData();
    const db = require('../src/models');
    const newCourse = await db.course.create({ code: 'IT102', name: 'Lập trình hướng đối tượng', credits: 3 });

    const res = await request(app)
      .post('/api/grade-requests')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        student_id: studentProfile.id,
        course_id: newCourse.id,
        semester_id: semester.id,
        request_type: 'UPDATE',
        reason: 'Nhập sai điểm',
        proposed_score_10: 8.0,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/grade-requests/:id/review should review request (admin)', async () => {
    const { gradeRequest } = getTestData();
    const res = await request(app)
      .put(`/api/grade-requests/${gradeRequest.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'APPROVED', response_note: 'Đồng ý' });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/grade-requests/:id should delete request', async () => {
    const { studentProfile, course, semester } = getTestData();
    const db = require('../src/models');
    const req = await db.gradeRequest.create({
      student_id: studentProfile.id,
      course_id: course.id,
      semester_id: semester.id,
      request_type: 'UPDATE',
      reason: 'Test delete',
      status: 'PENDING',
    });

    const res = await request(app)
      .delete(`/api/grade-requests/${req.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
