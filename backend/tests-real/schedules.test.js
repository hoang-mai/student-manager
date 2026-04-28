const request = require('supertest');
const app = require('../src/app');
require('./setup');
const { getAdminToken, getChiHuyToken, getStudentToken, getTestData } = require('./helpers');

describe('Schedules API', () => {
  let adminToken;
  beforeAll(() => {
    adminToken = getAdminToken();
  });

  it('GET /api/schedules should return list', async () => {
    const res = await request(app).get('/api/schedules').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/schedules/:id should return schedule', async () => {
    const { schedule } = getTestData();
    const res = await request(app).get(`/api/schedules/${schedule.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(schedule.id);
  });

  it('POST /api/schedules should create schedule', async () => {
    const { class: cls, course, semester } = getTestData();
    const res = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        class_id: cls.id,
        course_id: course.id,
        semester_id: semester.id,
        day_of_week: 3,
        start_time: '09:30:00',
        end_time: '11:45:00',
        room: 'B202',
        schedule_type: 'CLASS',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('created');
  });

  it('PUT /api/schedules/:id should update schedule', async () => {
    const { schedule } = getTestData();
    const res = await request(app)
      .put(`/api/schedules/${schedule.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ room: 'C303' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  it('DELETE /api/schedules/:id should delete schedule', async () => {
    const { class: cls, course, semester } = getTestData();
    const db = require('../src/models');
    const s = await db.schedule.create({
      class_id: cls.id,
      course_id: course.id,
      semester_id: semester.id,
      day_of_week: 4,
      start_time: '13:00:00',
      end_time: '15:15:00',
      room: 'D404',
      schedule_type: 'CLASS',
    });
    const res = await request(app).delete(`/api/schedules/${s.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
