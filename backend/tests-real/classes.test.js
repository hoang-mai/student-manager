const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Classes API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/classes should return list', async () => {
    const res = await request(app).get('/api/classes').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/classes/:id should return class', async () => {
    const { class: cls } = getTestData();
    const res = await request(app).get(`/api/classes/${cls.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(cls.id);
  });

  it('POST /api/classes should create class', async () => {
    const { major, academicYear } = getTestData();
    const res = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'CNTT-K63',
        name: 'Công nghệ thông tin K63',
        major_id: major.id,
        academic_year_id: academicYear.id,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/classes/:id should update', async () => {
    const { class: cls } = getTestData();
    const res = await request(app)
      .put(`/api/classes/${cls.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'CNTT K62 Updated' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/classes/:id should delete (admin only)', async () => {
    const { major, academicYear } = getTestData();
    const db = require('../src/models');
    const c = await db.class.create({
      code: 'DEL-CLS',
      name: 'Class to delete',
      major_id: major.id,
      academic_year_id: academicYear.id,
    });
    const res = await request(app).delete(`/api/classes/${c.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
