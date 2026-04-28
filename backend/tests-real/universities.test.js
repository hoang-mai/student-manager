const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken } = require('./helpers');

describe('Universities API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/universities should return list', async () => {
    const res = await request(app).get('/api/universities').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/universities/:id should return university', async () => {
    const res = await request(app).get('/api/universities/1').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('POST /api/universities should create university', async () => {
    const res = await request(app)
      .post('/api/universities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'BK',
        name: 'Đại học Bách Khoa',
        address: '1 Đại Cồ Việt',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/universities/:id should update', async () => {
    const res = await request(app)
      .put('/api/universities/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Đại học Kinh tế Quốc dân (updated)' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/universities/:id should delete (admin only)', async () => {
    const db = require('../src/models');
    const u = await db.university.create({ code: 'DEL', name: 'Uni to delete', address: 'Del street' });
    const res = await request(app).delete(`/api/universities/${u.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
