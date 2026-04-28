const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Tuitions API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/tuitions should return list', async () => {
    const res = await request(app).get('/api/tuitions').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/tuitions/:id should return tuition', async () => {
    const { tuition } = getTestData();
    const res = await request(app).get(`/api/tuitions/${tuition.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(tuition.id);
  });

  it('POST /api/tuitions should create tuition', async () => {
    const { studentProfile, semester } = getTestData();
    const res = await request(app)
      .post('/api/tuitions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentProfile.id,
        semester_id: semester.id,
        amount: 3000000,
        paid_amount: 1000000,
        status: 'PARTIAL',
        due_date: '2024-11-01',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/tuitions/:id should update', async () => {
    const { tuition } = getTestData();
    const res = await request(app)
      .put(`/api/tuitions/${tuition.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ paid_amount: 5000000 });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/tuitions/:id should delete', async () => {
    const { studentProfile, semester } = getTestData();
    const db = require('../src/models');
    const t = await db.tuition.create({
      student_id: studentProfile.id,
      semester_id: semester.id,
      amount: 1000000,
      paid_amount: 1000000,
      status: 'PAID',
      due_date: '2024-12-01',
    });
    const res = await request(app).delete(`/api/tuitions/${t.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
