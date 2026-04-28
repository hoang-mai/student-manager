const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Achievements API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/achievements should return list', async () => {
    const res = await request(app).get('/api/achievements').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/achievements/:id should return achievement', async () => {
    const { achievement } = getTestData();
    const res = await request(app).get(`/api/achievements/${achievement.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(achievement.id);
  });

  it('POST /api/achievements should create achievement', async () => {
    const { studentProfile } = getTestData();
    const res = await request(app)
      .post('/api/achievements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentProfile.id,
        title: 'Giải nhì Tin học',
        achievement_type: 'REWARD',
        level: 'Cấp khoa',
        issue_date: '2024-06-15',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/achievements/:id should update', async () => {
    const { achievement } = getTestData();
    const res = await request(app)
      .put(`/api/achievements/${achievement.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Giải nhất cập nhật' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/achievements/:id should delete', async () => {
    const { studentProfile } = getTestData();
    const db = require('../src/models');
    const a = await db.achievement.create({
      student_id: studentProfile.id,
      title: 'Achievement to delete',
      achievement_type: 'REWARD',
      level: 'Cấp trường',
      issue_date: '2024-07-01',
      created_by: 1,
    });
    const res = await request(app).delete(`/api/achievements/${a.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
