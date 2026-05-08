const http = require('http');

const BASE_URL = 'http://localhost:6868/api';

let adminToken = null;
let commanderToken = null;
let studentToken = null;
let passed = 0;
let failed = 0;
const ts = Date.now();

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
            resolve({ status: res.statusCode, body: json });
          } catch {
            resolve({ status: res.statusCode, body: data });
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
  console.log('\n--- Auth: Login ---');
  res = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
  logResult('POST /auth/login (admin)', res.status, 200);
  if (res.body.data?.accessToken) adminToken = res.body.data.accessToken;

  res = await request('POST', '/auth/login', { username: 'chihuy01', password: 'chihuy123' });
  logResult('POST /auth/login (commander)', res.status, 200);
  if (res.body.data?.accessToken) commanderToken = res.body.data.accessToken;

  res = await request('POST', '/auth/login', { username: 'hv001', password: 'hocvien123' });
  logResult('POST /auth/login (student)', res.status, 200);
  if (res.body.data?.accessToken) studentToken = res.body.data.accessToken;

  // Login with wrong password
  res = await request('POST', '/auth/login', { username: 'admin', password: 'wrongpass' });
  logResult('POST /auth/login (wrong password -> 401)', res.status, 401);

  if (!adminToken) {
    console.log('\n⚠️  Admin login failed, skipping authenticated tests.');
    return;
  }

  // 3. Auth - Me / Profile / Change Password
  console.log('\n--- Auth: Self-service ---');
  res = await request('GET', '/auth/me', null, adminToken);
  logResult('GET /auth/me', res.status, 200);

  res = await request('GET', '/auth/profile', null, studentToken);
  logResult('GET /auth/profile (student)', res.status, 200);

  res = await request('PUT', '/auth/profile', { phoneNumber: '0987654321', currentAddress: '123 Test St' }, studentToken);
  logResult('PUT /auth/profile (student)', res.status, 200);

  res = await request('POST', '/auth/change-password', { oldPassword: 'hocvien123', newPassword: 'hocvien123' }, studentToken);
  logResult('POST /auth/change-password (student)', res.status, 200);

  // Refresh token
  res = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
  const refreshToken = res.body.data?.refreshToken;
  if (refreshToken) {
    res = await request('POST', '/auth/refresh-token', { refreshToken });
    logResult('POST /auth/refresh-token', res.status, 200);
  }

  // 4. Auth - Register (admin only)
  console.log('\n--- Auth: Register (Admin Only) ---');
  res = await request('POST', '/auth/register', { username: `testuser${ts}`, password: 'test123456', role: 'STUDENT', fullName: 'Test User', email: `test${ts}@test.com` }, adminToken);
  logResult('POST /auth/register (admin -> 201)', res.status, 201);
  const registeredUserId = res.body.data?.id;

  // Student cannot register
  res = await request('POST', '/auth/register', { username: `badreg${ts}`, password: 'test123456' }, studentToken);
  logResult('POST /auth/register (student -> 403)', res.status, 403);

  // Commander cannot register
  res = await request('POST', '/auth/register', { username: `badreg2${ts}`, password: 'test123456' }, commanderToken);
  logResult('POST /auth/register (commander -> 403)', res.status, 403);

  // No token cannot register
  res = await request('POST', '/auth/register', { username: `badreg3${ts}`, password: 'test123456' });
  logResult('POST /auth/register (no token -> 401)', res.status, 401);

  // 5. Users CRUD (Admin)
  console.log('\n--- Users: CRUD ---');
  res = await request('GET', '/users', null, adminToken);
  logResult('GET /users (admin)', res.status, 200);

  res = await request('POST', '/users', { username: `crudtest${ts}`, password: 'test123456', role: 'STUDENT', fullName: 'CRUD Test' }, adminToken);
  logResult('POST /users (admin -> 201)', res.status, 201);
  const testUserId = res.body.data?.id;

  if (testUserId) {
    res = await request('GET', `/users/${testUserId}`, null, adminToken);
    logResult(`GET /users/${testUserId} (admin)`, res.status, 200);

    res = await request('PUT', `/users/${testUserId}`, { fullName: 'CRUD Updated', isActive: false }, adminToken);
    logResult(`PUT /users/${testUserId} (admin)`, res.status, 200);

    res = await request('POST', `/users/${testUserId}/reset-password`, { newPassword: 'reset123456' }, adminToken);
    logResult(`POST /users/${testUserId}/reset-password (admin)`, res.status, 200);

    res = await request('POST', `/users/${testUserId}/toggle-active`, {}, adminToken);
    logResult(`POST /users/${testUserId}/toggle-active (admin)`, res.status, 200);

    // Delete test user
    res = await request('DELETE', `/users/${testUserId}`, null, adminToken);
    logResult(`DELETE /users/${testUserId} (admin)`, res.status, 200);
  }

  // Commander can update student
  if (registeredUserId) {
    res = await request('PUT', `/users/${registeredUserId}`, { fullName: 'Updated by Commander' }, commanderToken);
    logResult(`PUT /users/${registeredUserId} (commander on student)`, res.status, 200);
  }

  // 6. RBAC Tests
  console.log('\n--- RBAC: Role Hierarchy ---');

  // Student cannot access user list
  res = await request('GET', '/users', null, studentToken);
  logResult('GET /users (student -> 403)', res.status, 403);

  // Student cannot create user
  res = await request('POST', '/users', { username: `bad${ts}`, password: 'test' }, studentToken);
  logResult('POST /users (student -> 403)', res.status, 403);

  // Commander cannot create user
  res = await request('POST', '/users', { username: `badcm${ts}`, password: 'test', role: 'STUDENT' }, commanderToken);
  logResult('POST /users (commander -> 403)', res.status, 403);

  // Commander cannot delete user
  if (registeredUserId) {
    res = await request('DELETE', `/users/${registeredUserId}`, null, commanderToken);
    logResult(`DELETE /users/${registeredUserId} (commander -> 403)`, res.status, 403);
  }

  // Student cannot delete
  if (registeredUserId) {
    res = await request('DELETE', `/users/${registeredUserId}`, null, studentToken);
    logResult(`DELETE /users/${registeredUserId} (student -> 403)`, res.status, 403);
  }

  // Student cannot toggle-active
  if (registeredUserId) {
    res = await request('POST', `/users/${registeredUserId}/toggle-active`, {}, studentToken);
    logResult(`POST /users/${registeredUserId}/toggle-active (student -> 403)`, res.status, 403);
  }

  // Student cannot reset-password
  if (registeredUserId) {
    res = await request('POST', `/users/${registeredUserId}/reset-password`, { newPassword: 'test' }, studentToken);
    logResult(`POST /users/${registeredUserId}/reset-password (student -> 403)`, res.status, 403);
  }

  // Student cannot batch create
  res = await request('POST', '/users/batch', { users: [{ username: `b${ts}` }] }, studentToken);
  logResult('POST /users/batch (student -> 403)', res.status, 403);

  // Commander cannot batch create
  res = await request('POST', '/users/batch', { users: [{ username: `bcm${ts}` }] }, commanderToken);
  logResult('POST /users/batch (commander -> 403)', res.status, 403);

  // 7. Profiles
  console.log('\n--- Profiles ---');
  res = await request('GET', '/users/profiles', null, adminToken);
  logResult('GET /users/profiles (admin)', res.status, 200);

  res = await request('GET', '/users/profiles', null, commanderToken);
  logResult('GET /users/profiles (commander)', res.status, 200);

  res = await request('GET', '/users/profiles', null, studentToken);
  logResult('GET /users/profiles (student -> 403)', res.status, 403);

  // Commander can delete profile -> should now be admin only
  // Test by trying to get first profile and delete it as commander
  const firstProfileId = (await (async () => {
    const r = await request('GET', '/users/profiles?limit=1', null, adminToken);
    return r.body.data?.rows?.[0]?.id;
  })());

  if (firstProfileId) {
    res = await request('DELETE', `/users/profiles/${firstProfileId}`, null, commanderToken);
    logResult(`DELETE /users/profiles/${firstProfileId} (commander -> 403)`, res.status, 403);
  }

  // 8. Self-service endpoints
  console.log('\n--- Self-service ---');
  res = await request('GET', '/users/profile', null, studentToken);
  logResult('GET /users/profile (student)', res.status, 200);

  res = await request('PUT', '/users/profile', { phoneNumber: '0123456789' }, studentToken);
  logResult('PUT /users/profile (student)', res.status, 200);

  res = await request('GET', '/users/profile', null, commanderToken);
  logResult('GET /users/profile (commander)', res.status, 200);

  res = await request('PUT', '/users/profile', { phoneNumber: '0987654321' }, commanderToken);
  logResult('PUT /users/profile (commander)', res.status, 200);

  // 9. Time Table (student only)
  console.log('\n--- Time Table ---');
  res = await request('GET', '/users/time-table', null, studentToken);
  logResult('GET /users/time-table (student)', res.status, 200);

  res = await request('GET', '/users/time-table', null, adminToken);
  logResult('GET /users/time-table (admin -> 403)', res.status, 403);

  res = await request('GET', '/users/time-table', null, commanderToken);
  logResult('GET /users/time-table (commander -> 403)', res.status, 403);

  // 10. Cut Rice
  console.log('\n--- Cut Rice ---');
  res = await request('GET', '/users/cut-rice', null, studentToken);
  logResult('GET /users/cut-rice (student)', res.status, 200);

  // 11. Grade Requests (student)
  console.log('\n--- Grade Requests ---');
  res = await request('GET', '/students/grade-requests', null, studentToken);
  logResult('GET /students/grade-requests (student)', res.status, 200);

  res = await request('GET', '/commanders/grade-requests', null, adminToken);
  logResult('GET /commanders/grade-requests (admin)', res.status, 200);

  res = await request('GET', '/commanders/grade-requests', null, studentToken);
  logResult('GET /commanders/grade-requests (student -> 403)', res.status, 403);

  // 12. Academic Results
  console.log('\n--- Academic Results ---');
  res = await request('GET', '/users/academic-results', null, studentToken);
  logResult('GET /users/academic-results (student)', res.status, 200);

  res = await request('GET', '/users/achievements', null, studentToken);
  logResult('GET /users/achievements (student)', res.status, 200);

  res = await request('GET', '/users/tuition-fees', null, studentToken);
  logResult('GET /users/tuition-fees (student)', res.status, 200);

  // 13. Universities (admin/commander)
  console.log('\n--- Universities ---');
  res = await request('GET', '/universities', null, adminToken);
  logResult('GET /universities (admin)', res.status, 200);

  res = await request('GET', '/universities', null, studentToken);
  logResult('GET /universities (student -> 403)', res.status, 403);

  // 14. Notifications
  console.log('\n--- Notifications ---');
  res = await request('GET', '/auth/notifications', null, studentToken);
  logResult('GET /auth/notifications (student)', res.status, 200);

  res = await request('GET', '/notifications', null, adminToken);
  logResult('GET /notifications (admin)', res.status, 200);

  res = await request('GET', '/notifications', null, studentToken);
  logResult('GET /notifications (student -> 403)', res.status, 403);

  // 15. Reports
  console.log('\n--- Reports ---');
  res = await request('GET', '/users/reports/academic', null, adminToken);
  logResult('GET /users/reports/academic (admin)', res.status, 200);

  res = await request('GET', '/users/reports/achievements', null, commanderToken);
  logResult('GET /users/reports/achievements (commander)', res.status, 200);

  res = await request('GET', '/users/reports/achievements', null, studentToken);
  logResult('GET /users/reports/achievements (student -> 403)', res.status, 403);

  // 16. Not found test
  console.log('\n--- Edge Cases ---');
  res = await request('GET', '/users/99999999-9999-9999-9999-999999999999', null, adminToken);
  logResult('GET /users/nonexistent (404)', res.status, 404);

  res = await request('GET', '/nonexistent-route', null, adminToken);
  logResult('GET /nonexistent-route (404)', res.status, 404);

  // Cleanup: delete test user
  if (registeredUserId) {
    res = await request('DELETE', `/users/${registeredUserId}`, null, adminToken);
    logResult(`Cleanup: DELETE test user (200)`, res.status, 200);
  }

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
