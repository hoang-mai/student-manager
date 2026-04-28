const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken } = require('./helpers');

describe('Users API', () => {
  let adminToken, chiHuyToken, studentToken;
  beforeAll(() => {
    adminToken = getAdminToken();
    chiHuyToken = getChiHuyToken();
    studentToken = getStudentToken();
  });

  it('GET /api/users/me should return current user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('admin');
  });

  it('GET /api/users/me should reject without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('PUT /api/users/me should update profile', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ full_name: 'Updated Admin' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Profile updated');
  });

  it('GET /api/users should return paginated users (admin)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/users should work for chi_huy', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${chiHuyToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/users should reject for student', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  it('POST /api/users should create user (admin)', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'testuser_api',
        email: 'testuser_api@test.local',
        password: 'password123',
        full_name: 'Test User API',
        role_id: 3,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.username).toBe('testuser_api');
  });

  it('GET /api/users/:id should return user by id', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('PUT /api/users/:id should update user', async () => {
    // Find the user created above
    const listRes = await request(app)
      .get('/api/users?search=testuser_api')
      .set('Authorization', `Bearer ${adminToken}`);
    const userId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ full_name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('User updated');
  });

  it('PATCH /api/users/:id/toggle-active should toggle status', async () => {
    const listRes = await request(app)
      .get('/api/users?search=testuser_api')
      .set('Authorization', `Bearer ${adminToken}`);
    const userId = listRes.body.data[0].id;

    const res = await request(app)
      .patch(`/api/users/${userId}/toggle-active`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.is_active).toBeDefined();
  });

  it('PATCH /api/users/:id/reset-password should reset password', async () => {
    const listRes = await request(app)
      .get('/api/users?search=testuser_api')
      .set('Authorization', `Bearer ${adminToken}`);
    const userId = listRes.body.data[0].id;

    const res = await request(app)
      .patch(`/api/users/${userId}/reset-password`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'reset12345' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Password reset');
  });

  it('DELETE /api/users/:id should delete user (admin only)', async () => {
    const listRes = await request(app)
      .get('/api/users?search=testuser_api')
      .set('Authorization', `Bearer ${adminToken}`);
    const userId = listRes.body.data[0].id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('User deleted');
  });

  it('DELETE /api/users/:id should reject for chi_huy', async () => {
    const res = await request(app)
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${chiHuyToken}`);
    expect(res.status).toBe(403);
  });
});
