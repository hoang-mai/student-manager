const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken, getTestData } = require('./helpers');

describe('Students API', () => {
  let adminToken, chiHuyToken, studentToken;
  beforeAll(() => {
    adminToken = getAdminToken();
    chiHuyToken = getChiHuyToken();
    studentToken = getStudentToken();
  });

  it('GET /api/students should return paginated list', async () => {
    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/students/:id should return student profile', async () => {
    const { studentProfile } = getTestData();
    const res = await request(app)
      .get(`/api/students/${studentProfile.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(studentProfile.id);
  });

  it('POST /api/students should create student profile (admin)', async () => {
    const { class: cls } = getTestData();
    // Create a fresh user without profile
    const bcrypt = require('bcrypt');
    const db = require('../src/models');
    const newUser = await db.user.create({
      username: 'student_no_profile',
      email: 'no_profile@test.local',
      password: await bcrypt.hash('password123', 10),
      full_name: 'No Profile Student',
      role_id: 3,
      is_active: true,
    });

    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: newUser.id,
        student_code: 'HV999',
        class_id: cls.id,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/students/:id should update student', async () => {
    const { studentProfile } = getTestData();
    const res = await request(app)
      .put(`/api/students/${studentProfile.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ gender: 'FEMALE' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/students/:id should delete student (admin)', async () => {
    const { class: cls } = getTestData();
    const bcrypt = require('bcrypt');
    const db = require('../src/models');
    const newUser = await db.user.create({
      username: 'student_to_delete',
      email: 'delete@test.local',
      password: await bcrypt.hash('password123', 10),
      full_name: 'Delete Student',
      role_id: 3,
      is_active: true,
    });
    const profile = await db.studentProfile.create({
      user_id: newUser.id,
      student_code: 'HV_DEL',
      class_id: cls.id,
    });

    const res = await request(app)
      .delete(`/api/students/${profile.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });

  it('POST /api/students should reject for student role', async () => {
    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({});
    expect(res.status).toBe(403);
  });
});
