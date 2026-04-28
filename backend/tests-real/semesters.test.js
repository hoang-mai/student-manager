const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getTestData } = require('./helpers');

describe('Semesters API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/semesters should return list', async () => {
    const res = await request(app).get('/api/semesters').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/semesters/:id should return semester', async () => {
    const { semester } = getTestData();
    const res = await request(app).get(`/api/semesters/${semester.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(semester.id);
  });

  it('POST /api/semesters should create semester', async () => {
    const { academicYear } = getTestData();
    const res = await request(app)
      .post('/api/semesters')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Học kỳ 2 - 2024-2025',
        academic_year_id: academicYear.id,
        start_date: '2025-02-01',
        end_date: '2025-06-15',
        is_active: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/semesters/:id should update', async () => {
    const { semester } = getTestData();
    const res = await request(app)
      .put(`/api/semesters/${semester.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ is_active: false });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/semesters/:id should delete (admin only)', async () => {
    const { academicYear } = getTestData();
    const db = require('../src/models');
    const s = await db.semester.create({
      name: 'Semester to delete',
      academic_year_id: academicYear.id,
      start_date: '2025-07-01',
      end_date: '2025-08-01',
      is_active: false,
    });
    const res = await request(app).delete(`/api/semesters/${s.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
