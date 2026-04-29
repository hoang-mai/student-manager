const http = require('http');

const BASE_URL = 'http://localhost:6868/api';

let adminToken = null;
let chiHuyToken = null;
let hocVienToken = null;
let passed = 0;
let failed = 0;
const ts = Date.now();
const errors = [];

async function request(method, path, body = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = http.request(
      {
        hostname: options.hostname,
        port: options.port,
        path: options.pathname + options.search,
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, body: json, headers: res.headers });
          } catch {
            resolve({ status: res.statusCode, body: data, headers: res.headers });
          }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function logResult(name, status, expectStatus) {
  const ok = status === expectStatus;
  if (ok) {
    passed++;
    console.log(`  ✅ ${name} (${status})`);
  } else {
    failed++;
    console.log(`  ❌ ${name} (got ${status}, expected ${expectStatus})`);
  }
  return ok;
}

async function runTests() {
  console.log('🚀 STARTING API TESTS\n');

  // 1. Health Check
  console.log('--- Public Endpoints ---');
  let res = await new Promise((resolve) => {
    const req = http.get(BASE_URL.replace('/api', '/health'), (r) => {
      resolve({ status: r.statusCode });
    });
    req.on('error', () => resolve({ status: 500 }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ status: 500 }); });
  });
  logResult('GET /health', res.status, 200);

  // 2. Auth - Login
  console.log('\n--- Auth ---');
  res = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
  logResult('POST /auth/login (admin)', res.status, 200);
  if (res.body.data?.accessToken) adminToken = res.body.data.accessToken;

  res = await request('POST', '/auth/login', { username: 'chihuy01', password: 'chihuy123' });
  logResult('POST /auth/login (chi_huy)', res.status, 200);
  if (res.body.data?.accessToken) chiHuyToken = res.body.data.accessToken;

  res = await request('POST', '/auth/login', { username: 'hv001', password: 'hocvien123' });
  logResult('POST /auth/login (hoc_vien)', res.status, 200);
  if (res.body.data?.accessToken) hocVienToken = res.body.data.accessToken;

  res = await request('POST', '/auth/login', { username: 'admin', password: 'wrongpass' });
  logResult('POST /auth/login (wrong pass)', res.status, 401);

  res = await request('POST', '/auth/register', { username: `testuser${ts}`, email: `test${ts}@local.com`, password: 'test1234', fullName: 'Test User' });
  logResult('POST /auth/register', res.status, 201);

  // Refresh token test
  res = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
  const refreshToken = res.body.data?.refreshToken;
  if (refreshToken) {
    res = await request('POST', '/auth/refresh-token', { refreshToken });
    logResult('POST /auth/refresh-token', res.status, 200);
  }

  res = await request('POST', '/auth/change-password', { oldPassword: 'admin123', newPassword: 'admin123' }, adminToken);
  logResult('POST /auth/change-password', res.status, 200);

  if (!adminToken) {
    console.log('\n⚠️  Admin login failed, skipping authenticated tests.');
    return;
  }

  // 3. Users
  console.log('\n--- Users ---');
  res = await request('GET', '/users', null, adminToken);
  logResult('GET /users', res.status, 200);

  res = await request('GET', '/users?page=1&limit=5&role=chi_huy', null, adminToken);
  logResult('GET /users?role=chi_huy', res.status, 200);

  res = await request('GET', '/users/me', null, adminToken);
  logResult('GET /users/me', res.status, 200);

  res = await request('GET', '/users/1', null, adminToken);
  logResult('GET /users/1', res.status, 200);

  res = await request('GET', '/users/99999', null, adminToken);
  logResult('GET /users/99999', res.status, 404);

  res = await request('POST', '/users', { username: `apitest${ts}`, email: `api${ts}@test.local`, password: 'test1234', fullName: 'API Test', roleId: 3 }, adminToken);
  logResult('POST /users', res.status, 201);
  const newUserId = res.body.data?.id || res.body.id;

  if (newUserId) {
    res = await request('PUT', `/users/${newUserId}`, { fullName: 'API Test Updated', phone: '0999999999' }, adminToken);
    logResult(`PUT /users/${newUserId}`, res.status, 200);

    res = await request('PATCH', `/users/${newUserId}/toggle-active`, {}, adminToken);
    logResult(`PATCH /users/${newUserId}/toggle-active`, res.status, 200);

    res = await request('PATCH', `/users/${newUserId}/reset-password`, { newPassword: 'reset1234' }, adminToken);
    logResult(`PATCH /users/${newUserId}/reset-password`, res.status, 200);

    res = await request('DELETE', `/users/${newUserId}`, null, adminToken);
    logResult(`DELETE /users/${newUserId}`, res.status, 200);
  }

  // Học viên không được xóa user
  res = await request('DELETE', '/users/2', null, hocVienToken);
  logResult('DELETE /users/2 (hoc_vien forbidden)', res.status, 403);

  // 4. Students
  console.log('\n--- Students ---');
  res = await request('GET', '/students', null, adminToken);
  logResult('GET /students', res.status, 200);

  res = await request('GET', '/students?status=STUDYING', null, adminToken);
  logResult('GET /students?status=STUDYING', res.status, 200);

  res = await request('GET', '/students/1', null, adminToken);
  logResult('GET /students/1', res.status, 200);

  res = await request('GET', '/students/99999', null, adminToken);
  logResult('GET /students/99999', res.status, 404);

  // 5. Grades
  console.log('\n--- Grades ---');
  res = await request('GET', '/grades', null, adminToken);
  logResult('GET /grades', res.status, 200);

  res = await request('GET', '/grades?studentId=1', null, adminToken);
  logResult('GET /grades?studentId=1', res.status, 200);

  res = await request('GET', '/grades/1', null, adminToken);
  logResult('GET /grades/1', res.status, 200);

  res = await request('POST', '/grades', { studentId: 1, courseId: 2, semesterId: 1, score10: 7.5, score4: 3.0, letterGrade: 'B', status: 'PASSED' }, adminToken);
  logResult('POST /grades', res.status, 201);
  const newGradeId = res.body.data?.id || res.body.id;

  if (newGradeId) {
    res = await request('PUT', `/grades/${newGradeId}`, { score10: 8.0, letterGrade: 'B+' }, adminToken);
    logResult(`PUT /grades/${newGradeId}`, res.status, 200);

    res = await request('DELETE', `/grades/${newGradeId}`, null, adminToken);
    logResult(`DELETE /grades/${newGradeId}`, res.status, 200);
  }

  // 6. Grade Requests
  console.log('\n--- Grade Requests ---');
  res = await request('GET', '/grade-requests', null, adminToken);
  logResult('GET /grade-requests', res.status, 200);

  res = await request('GET', '/grade-requests?status=PENDING', null, adminToken);
  logResult('GET /grade-requests?status=PENDING', res.status, 200);

  res = await request('GET', '/grade-requests/1', null, adminToken);
  logResult('GET /grade-requests/1', res.status, 200);

  res = await request('POST', '/grade-requests', { studentId: 1, courseId: 2, semesterId: 1, requestType: 'UPDATE', reason: 'Test API', proposedScore10: 9.0 }, hocVienToken);
  logResult('POST /grade-requests (hoc_vien)', res.status, 201);
  const newGRId = res.body.data?.id || res.body.id;

  if (newGRId) {
    res = await request('PUT', `/grade-requests/${newGRId}/review`, { status: 'APPROVED', reviewNote: 'OK from API test' }, chiHuyToken);
    logResult(`PUT /grade-requests/${newGRId}/review (chi_huy)`, res.status, 200);

    res = await request('DELETE', `/grade-requests/${newGRId}`, null, adminToken);
    logResult(`DELETE /grade-requests/${newGRId}`, res.status, 200);
  }

  // 7. Schedules
  console.log('\n--- Schedules ---');
  res = await request('GET', '/schedules', null, adminToken);
  logResult('GET /schedules', res.status, 200);

  res = await request('GET', '/schedules?classId=1', null, adminToken);
  logResult('GET /schedules?classId=1', res.status, 200);

  res = await request('GET', '/schedules/1', null, adminToken);
  logResult('GET /schedules/1', res.status, 200);

  res = await request('POST', '/schedules', { classId: 1, courseId: 1, semesterId: 1, dayOfWeek: 1, startTime: '07:00:00', endTime: '09:25:00', room: 'TEST101', scheduleType: 'CLASS' }, adminToken);
  logResult('POST /schedules', res.status, 201);
  const newScheduleId = res.body.data?.id || res.body.id;

  if (newScheduleId) {
    res = await request('PUT', `/schedules/${newScheduleId}`, { room: 'TEST102' }, adminToken);
    logResult(`PUT /schedules/${newScheduleId}`, res.status, 200);

    res = await request('DELETE', `/schedules/${newScheduleId}`, null, adminToken);
    logResult(`DELETE /schedules/${newScheduleId}`, res.status, 200);
  }

  // 8. Meal Schedules
  console.log('\n--- Meal Schedules ---');
  res = await request('GET', '/meal-schedules', null, adminToken);
  logResult('GET /meal-schedules', res.status, 200);

  res = await request('GET', '/meal-schedules?studentId=1', null, adminToken);
  logResult('GET /meal-schedules?studentId=1', res.status, 200);

  res = await request('GET', '/meal-schedules/1', null, adminToken);
  logResult('GET /meal-schedules/1', res.status, 200);

  res = await request('POST', '/meal-schedules', { studentId: 1, scheduleDate: '2025-01-01', session: 'NOON', status: 'REGISTERED' }, adminToken);
  logResult('POST /meal-schedules', res.status, 201);
  const newMealId = res.body.data?.id || res.body.id;

  if (newMealId) {
    res = await request('PUT', `/meal-schedules/${newMealId}`, { status: 'CANCELLED' }, adminToken);
    logResult(`PUT /meal-schedules/${newMealId}`, res.status, 200);

    res = await request('DELETE', `/meal-schedules/${newMealId}`, null, adminToken);
    logResult(`DELETE /meal-schedules/${newMealId}`, res.status, 200);
  }

  // 9. Tuitions
  console.log('\n--- Tuitions ---');
  res = await request('GET', '/tuitions', null, adminToken);
  logResult('GET /tuitions', res.status, 200);

  res = await request('GET', '/tuitions?status=UNPAID', null, adminToken);
  logResult('GET /tuitions?status=UNPAID', res.status, 200);

  res = await request('GET', '/tuitions/1', null, adminToken);
  logResult('GET /tuitions/1', res.status, 200);

  res = await request('POST', '/tuitions', { studentId: 1, semesterId: 1, amount: 1000000, paidAmount: 0, status: 'UNPAID', dueDate: '2025-06-01' }, adminToken);
  logResult('POST /tuitions', res.status, 201);
  const newTuitionId = res.body.data?.id || res.body.id;

  if (newTuitionId) {
    res = await request('PUT', `/tuitions/${newTuitionId}`, { paidAmount: 1000000, status: 'PAID' }, adminToken);
    logResult(`PUT /tuitions/${newTuitionId}`, res.status, 200);

    res = await request('DELETE', `/tuitions/${newTuitionId}`, null, adminToken);
    logResult(`DELETE /tuitions/${newTuitionId}`, res.status, 200);
  }

  // 10. Achievements
  console.log('\n--- Achievements ---');
  res = await request('GET', '/achievements', null, adminToken);
  logResult('GET /achievements', res.status, 200);

  res = await request('GET', '/achievements?studentId=1', null, adminToken);
  logResult('GET /achievements?studentId=1', res.status, 200);

  res = await request('GET', '/achievements/1', null, adminToken);
  logResult('GET /achievements/1', res.status, 200);

  res = await request('POST', '/achievements', { studentId: 1, title: 'Test Achievement', achievementType: 'REWARD', level: 'Test', issueDate: '2025-01-01' }, adminToken);
  logResult('POST /achievements', res.status, 201);
  const newAchieveId = res.body.data?.id || res.body.id;

  if (newAchieveId) {
    res = await request('PUT', `/achievements/${newAchieveId}`, { title: 'Test Achievement Updated' }, adminToken);
    logResult(`PUT /achievements/${newAchieveId}`, res.status, 200);

    res = await request('DELETE', `/achievements/${newAchieveId}`, null, adminToken);
    logResult(`DELETE /achievements/${newAchieveId}`, res.status, 200);
  }

  // 11. Duty Rosters
  console.log('\n--- Duty Rosters ---');
  res = await request('GET', '/duty-rosters', null, adminToken);
  logResult('GET /duty-rosters', res.status, 200);

  res = await request('GET', '/duty-rosters?shift=NIGHT', null, adminToken);
  logResult('GET /duty-rosters?shift=NIGHT', res.status, 200);

  res = await request('GET', '/duty-rosters/1', null, adminToken);
  logResult('GET /duty-rosters/1', res.status, 200);

  res = await request('POST', '/duty-rosters', { userId: 2, dutyDate: '2025-12-01', shift: 'MORNING', dutyType: 'COMMAND', note: 'Test duty' }, adminToken);
  logResult('POST /duty-rosters', res.status, 201);
  const newDutyId = res.body.data?.id || res.body.id;

  if (newDutyId) {
    res = await request('PUT', `/duty-rosters/${newDutyId}`, { note: 'Test duty updated' }, adminToken);
    logResult(`PUT /duty-rosters/${newDutyId}`, res.status, 200);

    res = await request('DELETE', `/duty-rosters/${newDutyId}`, null, adminToken);
    logResult(`DELETE /duty-rosters/${newDutyId}`, res.status, 200);
  }

  // 12. Universities
  console.log('\n--- Universities ---');
  res = await request('GET', '/universities', null, adminToken);
  logResult('GET /universities', res.status, 200);

  res = await request('GET', '/universities/1', null, adminToken);
  logResult('GET /universities/1', res.status, 200);

  res = await request('POST', '/universities', { code: 'TESTU2', name: 'Test University', address: 'Test Address' }, adminToken);
  logResult('POST /universities', res.status, 201);
  const newUnivId = res.body.data?.id || res.body.id;

  if (newUnivId) {
    res = await request('PUT', `/universities/${newUnivId}`, { name: 'Test University Updated' }, adminToken);
    logResult(`PUT /universities/${newUnivId}`, res.status, 200);

    res = await request('DELETE', `/universities/${newUnivId}`, null, adminToken);
    logResult(`DELETE /universities/${newUnivId}`, res.status, 200);
  }

  // 13. Classes
  console.log('\n--- Classes ---');
  res = await request('GET', '/classes', null, adminToken);
  logResult('GET /classes', res.status, 200);

  res = await request('GET', '/classes/1', null, adminToken);
  logResult('GET /classes/1', res.status, 200);

  res = await request('POST', '/classes', { code: 'TEST-K99C', name: 'Lớp test', majorId: 1, academicYearId: 1 }, adminToken);
  logResult('POST /classes', res.status, 201);
  const newClassId = res.body.data?.id || res.body.id;

  if (newClassId) {
    res = await request('PUT', `/classes/${newClassId}`, { name: 'Lớp test updated' }, adminToken);
    logResult(`PUT /classes/${newClassId}`, res.status, 200);

    res = await request('DELETE', `/classes/${newClassId}`, null, adminToken);
    logResult(`DELETE /classes/${newClassId}`, res.status, 200);
  }

  // 14. Semesters
  console.log('\n--- Semesters ---');
  res = await request('GET', '/semesters', null, adminToken);
  logResult('GET /semesters', res.status, 200);

  res = await request('GET', '/semesters?isActive=true', null, adminToken);
  logResult('GET /semesters?isActive=true', res.status, 200);

  res = await request('GET', '/semesters/1', null, adminToken);
  logResult('GET /semesters/1', res.status, 200);

  res = await request('POST', '/semesters', { name: 'Test HK - 2025E', academicYearId: 1, startDate: new Date('2025-09-01').toISOString(), endDate: new Date('2026-01-15').toISOString(), isActive: true }, adminToken);
  logResult('POST /semesters', res.status, 201);
  const newSemesterId = res.body.data?.id || res.body.id;

  if (newSemesterId) {
    res = await request('PUT', `/semesters/${newSemesterId}`, { isActive: false }, adminToken);
    logResult(`PUT /semesters/${newSemesterId}`, res.status, 200);

    res = await request('DELETE', `/semesters/${newSemesterId}`, null, adminToken);
    logResult(`DELETE /semesters/${newSemesterId}`, res.status, 200);
  }

  // 15. Courses
  console.log('\n--- Courses ---');
  res = await request('GET', '/courses', null, adminToken);
  logResult('GET /courses', res.status, 200);

  res = await request('GET', '/courses/1', null, adminToken);
  logResult('GET /courses/1', res.status, 200);

  res = await request('POST', '/courses', { code: 'TEST101CD', name: 'Môn học test', credits: 3 }, adminToken);
  logResult('POST /courses', res.status, 201);
  const newCourseId = res.body.data?.id || res.body.id;

  if (newCourseId) {
    res = await request('PUT', `/courses/${newCourseId}`, { name: 'Môn học test updated' }, adminToken);
    logResult(`PUT /courses/${newCourseId}`, res.status, 200);

    res = await request('DELETE', `/courses/${newCourseId}`, null, adminToken);
    logResult(`DELETE /courses/${newCourseId}`, res.status, 200);
  }

  // 16. Reports
  console.log('\n--- Reports ---');
  res = await request('GET', '/reports/students', null, adminToken);
  logResult('GET /reports/students', res.status, 200);

  res = await request('GET', '/reports/grades', null, adminToken);
  logResult('GET /reports/grades', res.status, 200);

  res = await request('GET', '/reports/tuitions', null, adminToken);
  logResult('GET /reports/tuitions', res.status, 200);

  // Học viên không được xem report
  res = await request('GET', '/reports/students', null, hocVienToken);
  logResult('GET /reports/students (hoc_vien forbidden)', res.status, 403);

  // 17. RBAC Tests
  console.log('\n--- RBAC Tests ---');
  res = await request('GET', '/users', null, hocVienToken);
  logResult('GET /users (hoc_vien -> 403)', res.status, 403);

  res = await request('POST', '/grades', { studentId: 1, courseId: 1, semesterId: 1, score10: 5.0 }, hocVienToken);
  logResult('POST /grades (hoc_vien -> 403)', res.status, 403);

  res = await request('GET', '/students', null, hocVienToken);
  logResult('GET /students (hoc_vien -> 200)', res.status, 200);

  res = await request('GET', '/students', null, chiHuyToken);
  logResult('GET /students (chi_huy -> 200)', res.status, 200);

  res = await request('POST', '/users', { username: `testch${ts}`, email: `ch${ts}@test.local`, password: 'test1234', fullName: 'Test', roleId: 3 }, chiHuyToken);
  logResult('POST /users (chi_huy -> 201)', res.status, 201);

  res = await request('DELETE', '/users/1', null, chiHuyToken);
  logResult('DELETE /users/1 (chi_huy -> 403)', res.status, 403);

  // 18. 404 Test
  console.log('\n--- 404 Tests ---');
  res = await request('GET', '/nonexistent', null, adminToken);
  logResult('GET /nonexistent', res.status, 404);

  // Summary
  console.log('\n==============================');
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL:  ${passed + failed}`);
  console.log('==============================');

  if (failed > 0) {
    process.exit(1);
  }
}

// Wait for server to be ready
async function waitForServer(maxRetries = 30) {
  const http = require('http');
  for (let i = 0; i < maxRetries; i++) {
    try {
      const ok = await new Promise((resolve) => {
        const req = http.get('http://localhost:6868/health', (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => { req.destroy(); resolve(false); });
      });
      if (ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
    process.stdout.write('.');
  }
  return false;
}

(async () => {
  console.log('⏳ Waiting for server on port 6868...');
  const ready = await waitForServer();
  if (!ready) {
    console.log('\n❌ Server not available. Please start it first: npm start');
    process.exit(1);
  }
  console.log(' Server ready!\n');
  await runTests();
  process.exit(0);
})();
