const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Meal Schedules API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/meal-schedules should return list', async () => {
    const res = await request(app).get('/api/meal-schedules').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/meal-schedules/:id should return meal schedule', async () => {
    const { mealSchedule } = getTestData();
    const res = await request(app).get(`/api/meal-schedules/${mealSchedule.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mealSchedule.id);
  });

  it('POST /api/meal-schedules should create meal schedule', async () => {
    const { studentProfile } = getTestData();
    const res = await request(app)
      .post('/api/meal-schedules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentProfile.id,
        schedule_date: '2024-10-02',
        session: 'MORNING',
        status: 'REGISTERED',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/meal-schedules/:id should update', async () => {
    const { mealSchedule } = getTestData();
    const res = await request(app)
      .put(`/api/meal-schedules/${mealSchedule.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ session: 'EVENING' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/meal-schedules/:id should delete', async () => {
    const { studentProfile } = getTestData();
    const db = require('../src/models');
    const m = await db.mealSchedule.create({
      student_id: studentProfile.id,
      schedule_date: '2024-10-03',
      session: 'NOON',
      status: 'REGISTERED',
    });
    const res = await request(app).delete(`/api/meal-schedules/${m.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
