const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken } = require('./helpers');

describe('Reports API', () => {
  let adminToken, chiHuyToken, studentToken;
  beforeAll(() => {
    adminToken = getAdminToken();
    chiHuyToken = getChiHuyToken();
    studentToken = getStudentToken();
  });

  it('GET /api/reports/students should return stats (admin)', async () => {
    const res = await request(app).get('/api/reports/students').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/reports/grades should return stats (admin)', async () => {
    const res = await request(app).get('/api/reports/grades').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/reports/tuitions should return stats (admin)', async () => {
    const res = await request(app).get('/api/reports/tuitions').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/reports/students should work for chi_huy', async () => {
    const res = await request(app).get('/api/reports/students').set('Authorization', `Bearer ${chiHuyToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/reports/students should reject for student', async () => {
    const res = await request(app).get('/api/reports/students').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });
});
