const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getStudentToken } = require('./helpers');

describe('Auth API', () => {
  it('POST /api/auth/register should create a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'newuser',
      email: 'newuser@test.local',
      password: 'password123',
      full_name: 'New User',
      phone: '0900000009',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
    expect(res.body.data.username).toBe('newuser');
  });

  it('POST /api/auth/register should reject duplicate username', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'newuser',
      email: 'newuser2@test.local',
      password: 'password123',
      full_name: 'New User 2',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  it('POST /api/auth/login should return tokens for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.username).toBe('admin');
  });

  it('POST /api/auth/login should reject invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Password is incorrect');
  });

  it('POST /api/auth/login should reject non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'notexist',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('does not exist');
  });

  it('POST /api/auth/refresh-token should return new tokens', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });
    const refreshToken = loginRes.body.data.refreshToken;

    const res = await request(app).post('/api/auth/refresh-token').send({
      refreshToken,
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('POST /api/auth/refresh-token should reject invalid token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({
      refreshToken: 'invalid-token',
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/change-password should work with valid old password', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'admin123',
        newPassword: 'newadmin123',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Password changed');

    // Revert password for other tests
    const revertRes = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'newadmin123',
        newPassword: 'admin123',
      });
    expect(revertRes.status).toBe(200);
  });

  it('POST /api/auth/change-password should reject wrong old password', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'wrongold',
        newPassword: 'newpassword123',
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Old password is incorrect');
  });
});
