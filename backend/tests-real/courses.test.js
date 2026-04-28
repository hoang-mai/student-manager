const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken } = require('./helpers');

describe('Courses API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/courses should return list', async () => {
    const res = await request(app).get('/api/courses').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/courses/:id should return course', async () => {
    const res = await request(app).get('/api/courses/1').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('POST /api/courses should create course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'IT103',
        name: 'Cơ sở dữ liệu',
        credits: 3,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/courses/:id should update', async () => {
    const res = await request(app)
      .put('/api/courses/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Nhập môn lập trình (updated)' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/courses/:id should delete (admin only)', async () => {
    const db = require('../src/models');
    const c = await db.course.create({ code: 'DEL-COURSE', name: 'Course to delete', credits: 2 });
    const res = await request(app).delete(`/api/courses/${c.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
