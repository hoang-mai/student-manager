const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Duty Rosters API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/duty-rosters should return list', async () => {
    const res = await request(app).get('/api/duty-rosters').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/duty-rosters/:id should return duty roster', async () => {
    const { dutyRoster } = getTestData();
    const res = await request(app).get(`/api/duty-rosters/${dutyRoster.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(dutyRoster.id);
  });

  it('POST /api/duty-rosters should create duty roster', async () => {
    const { users } = getTestData();
    const res = await request(app)
      .post('/api/duty-rosters')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: users.admin.id,
        duty_date: '2024-10-02',
        shift: 'MORNING',
        duty_type: 'COMMAND',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/duty-rosters/:id should update', async () => {
    const { dutyRoster } = getTestData();
    const res = await request(app)
      .put(`/api/duty-rosters/${dutyRoster.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ shift: 'AFTERNOON' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/duty-rosters/:id should delete', async () => {
    const { users } = getTestData();
    const db = require('../src/models');
    const d = await db.dutyRoster.create({
      user_id: users.admin.id,
      duty_date: '2024-10-03',
      shift: 'NIGHT',
      duty_type: 'SECURITY',
      created_by: users.admin.id,
    });
    const res = await request(app).delete(`/api/duty-rosters/${d.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
