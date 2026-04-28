#!/bin/bash
set +e
BASE="http://localhost:6868/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

function ok() {
  echo -e "${GREEN}✅ PASS${NC} $1"
  PASS=$((PASS+1))
}

function fail() {
  echo -e "${RED}❌ FAIL${NC} $1"
  echo "   Response: $2"
  FAIL=$((FAIL+1))
}

function expect_status() {
  local desc="$1"
  local url="$2"
  local method="$3"
  local token="$4"
  local body="$5"
  local expected="$6"
  local tmpfile="/tmp/api_test_$$_${RANDOM}.json"
  
  if [ "$method" = "GET" ]; then
    RESP=$(curl -s -o "$tmpfile" -w "%{http_code}" "$url" ${token:+-H} ${token:+"Authorization: Bearer $token"})
  elif [ "$method" = "DELETE" ]; then
    RESP=$(curl -s -o "$tmpfile" -w "%{http_code}" -X DELETE "$url" ${token:+-H} ${token:+"Authorization: Bearer $token"} -H "Content-Type: application/json")
  else
    RESP=$(curl -s -o "$tmpfile" -w "%{http_code}" -X "$method" "$url" ${token:+-H} ${token:+"Authorization: Bearer $token"} -H "Content-Type: application/json" -d "$body")
  fi
  
  local bodyout=$(cat "$tmpfile" 2>/dev/null | head -c 200)
  rm -f "$tmpfile"
  
  if [ "$RESP" = "$expected" ]; then
    ok "$desc ($RESP)"
  else
    fail "$desc (expected $expected, got $RESP)" "$bodyout"
  fi
}

echo "🔥 FULL API TEST - ALL CRUD OPERATIONS"
echo "========================================"
echo "DB: student_manager | Server: localhost:6868 "
echo ""

# Cleanup previous test data first
curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' > /tmp/admin_pre.json 2>/dev/null
PRE_TOKEN=$(cat /tmp/admin_pre.json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")
if [ -n "$PRE_TOKEN" ]; then
  for u in fulltest_user tmp_full_user tmp_full_user2; do
    UINFO=$(curl -s "$BASE/users?search=$u&limit=1" -H "Authorization: Bearer $PRE_TOKEN")
    DELUID=$(echo "$UINFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0]['id'])" 2>/dev/null || echo "")
    if [ -n "$DELUID" ] && [ "$DELUID" != "" ]; then
      curl -s -X DELETE "$BASE/users/$DELUID" -H "Authorization: Bearer $PRE_TOKEN" > /dev/null 2>&1 || true
    fi
  done
fi

# Start server if not running
curl -s http://localhost:6868/health > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Starting server..."
  node server.js > /tmp/server-full.log 2>&1 &
  sleep 3
fi

# 1. Auth
echo -e "\n${YELLOW}━━━ 1. AUTH ━━━${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}')
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")

CHIHUY_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"chihuy","password":"chihuy123"}')
CHIHUY_TOKEN=$(echo "$CHIHUY_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")

STUDENT_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"student","password":"student123"}')
STUDENT_TOKEN=$(echo "$STUDENT_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")

expect_status "POST /auth/login (admin)" "$BASE/auth/login" "POST" "" '{"username":"admin","password":"admin123"}' "200"
expect_status "POST /auth/login (student)" "$BASE/auth/login" "POST" "" '{"username":"student","password":"student123"}' "200"
expect_status "POST /auth/login (wrong pass)" "$BASE/auth/login" "POST" "" '{"username":"admin","password":"wrong"}' "401"
expect_status "POST /auth/login (not exist)" "$BASE/auth/login" "POST" "" '{"username":"notexist","password":"pass"}' "400"

RND=$(date +%s)
expect_status "POST /auth/register (new)" "$BASE/auth/register" "POST" "" "{\"username\":\"ftest_${RND}\",\"email\":\"ftest_${RND}@example.com\",\"password\":\"password123\",\"full_name\":\"Full Test\"}" "201"
expect_status "POST /auth/register (duplicate)" "$BASE/auth/register" "POST" "" "{\"username\":\"ftest_${RND}\",\"email\":\"ftest2_${RND}@example.com\",\"password\":\"password123\",\"full_name\":\"Dup\"}" "400"

REFRESH=$(echo "$ADMIN_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['refreshToken'])" 2>/dev/null || echo "")
expect_status "POST /auth/refresh-token (valid)" "$BASE/auth/refresh-token" "POST" "" "{\"refreshToken\":\"$REFRESH\"}" "200"
expect_status "POST /auth/refresh-token (invalid)" "$BASE/auth/refresh-token" "POST" "" '{"refreshToken":"bad.token.here"}' "401"

expect_status "POST /auth/change-password (wrong old)" "$BASE/auth/change-password" "POST" "$ADMIN_TOKEN" '{"oldPassword":"wrong","newPassword":"newpass123"}' "401"

# 2. Users
echo -e "\n${YELLOW}━━━ 2. USERS ━━━${NC}"
expect_status "GET /users/me" "$BASE/users/me" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /users/me (no token)" "$BASE/users/me" "GET" "" "" "401"
expect_status "GET /users (admin)" "$BASE/users?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /users (student -> 403)" "$BASE/users?page=1&limit=5" "GET" "$STUDENT_TOKEN" "" "403"
expect_status "GET /users (chi_huy -> 200)" "$BASE/users?page=1&limit=5" "GET" "$CHIHUY_TOKEN" "" "200"
expect_status "GET /users/1" "$BASE/users/1" "GET" "$ADMIN_TOKEN" "" "200"

USER_CREATE=$(curl -s -X POST "$BASE/users" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"username":"tmp_full_user","email":"tmp_full@example.com","password":"password123","full_name":"Tmp Full","role_id":3}')
USER_ID=$(echo "$USER_CREATE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "")
expect_status "POST /users (create)" "$BASE/users" "POST" "$ADMIN_TOKEN" "{\"username\":\"tuser_${RND}\",\"email\":\"tuser_${RND}@example.com\",\"password\":\"password123\",\"full_name\":\"Tmp Full2\",\"role_id\":3}" "201"

expect_status "PUT /users/$USER_ID" "$BASE/users/$USER_ID" "PUT" "$ADMIN_TOKEN" '{"full_name":"Updated Name"}' "200"
expect_status "PATCH /users/$USER_ID/toggle-active" "$BASE/users/$USER_ID/toggle-active" "PATCH" "$ADMIN_TOKEN" "" "200"
expect_status "PATCH /users/$USER_ID/reset-password" "$BASE/users/$USER_ID/reset-password" "PATCH" "$ADMIN_TOKEN" '{"newPassword":"reset12345"}' "200"
expect_status "DELETE /users/$USER_ID (admin)" "$BASE/users/$USER_ID" "DELETE" "$ADMIN_TOKEN" "" "200"
expect_status "DELETE /users/1 (chi_huy -> 403)" "$BASE/users/1" "DELETE" "$CHIHUY_TOKEN" "" "403"

# 3. Students
echo -e "\n${YELLOW}━━━ 3. STUDENTS ━━━${NC}"
expect_status "GET /students" "$BASE/students?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /students/1" "$BASE/students/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /students (student role ok)" "$BASE/students?page=1&limit=5" "GET" "$STUDENT_TOKEN" "" "200"

expect_status "POST /students (student -> 403)" "$BASE/students" "POST" "$STUDENT_TOKEN" '{"user_id":3,"student_code":"HV999","class_id":1}' "403"
expect_status "PUT /students/1" "$BASE/students/1" "PUT" "$ADMIN_TOKEN" '{"gender":"FEMALE"}' "200"
expect_status "DELETE /students/999 (not found)" "$BASE/students/999" "DELETE" "$ADMIN_TOKEN" "" "404"

# 4. Grades
echo -e "\n${YELLOW}━━━ 4. GRADES ━━━${NC}"
expect_status "GET /grades" "$BASE/grades?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /grades/1" "$BASE/grades/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "POST /grades (student -> 403)" "$BASE/grades" "POST" "$STUDENT_TOKEN" '{"student_id":1,"course_id":1,"semester_id":1}' "403"
expect_status "PUT /grades/1" "$BASE/grades/1" "PUT" "$ADMIN_TOKEN" '{"score_10":9.0}' "200"

# 5. Grade Requests
echo -e "\n${YELLOW}━━━ 5. GRADE REQUESTS ━━━${NC}"
expect_status "GET /grade-requests" "$BASE/grade-requests?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /grade-requests/1" "$BASE/grade-requests/1" "GET" "$ADMIN_TOKEN" "" "200"
# Create a new pending request then review it
GR=$(curl -s -X POST "$BASE/grade-requests" -H "Authorization: Bearer $STUDENT_TOKEN" -H "Content-Type: application/json" -d '{"student_id":1,"course_id":1,"semester_id":1,"request_type":"UPDATE","reason":"Test reason","proposed_score_10":8.5}')
GR_ID=$(echo "$GR" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "")
if [ -n "$GR_ID" ] && [ "$GR_ID" != "" ]; then
  expect_status "PUT /grade-requests/$GR_ID/review" "$BASE/grade-requests/$GR_ID/review" "PUT" "$ADMIN_TOKEN" '{"status":"APPROVED","response_note":"OK"}' "200"
fi

# 6. Schedules
echo -e "\n${YELLOW}━━━ 6. SCHEDULES ━━━${NC}"
expect_status "GET /schedules" "$BASE/schedules?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /schedules/1" "$BASE/schedules/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "POST /schedules (student -> 403)" "$BASE/schedules" "POST" "$STUDENT_TOKEN" '{"class_id":1,"course_id":1,"semester_id":1,"day_of_week":3}' "403"
expect_status "PUT /schedules/1" "$BASE/schedules/1" "PUT" "$ADMIN_TOKEN" '{"room":"C303"}' "200"

# 7. Meal Schedules
echo -e "\n${YELLOW}━━━ 7. MEAL SCHEDULES ━━━${NC}"
expect_status "GET /meal-schedules" "$BASE/meal-schedules?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /meal-schedules/1" "$BASE/meal-schedules/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /meal-schedules/1" "$BASE/meal-schedules/1" "PUT" "$ADMIN_TOKEN" '{"session":"MORNING"}' "200"

# 8. Tuitions
echo -e "\n${YELLOW}━━━ 8. TUITIONS ━━━${NC}"
expect_status "GET /tuitions" "$BASE/tuitions?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /tuitions/1" "$BASE/tuitions/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /tuitions/1" "$BASE/tuitions/1" "PUT" "$ADMIN_TOKEN" '{"paid_amount":4000000}' "200"

# 9. Achievements
echo -e "\n${YELLOW}━━━ 9. ACHIEVEMENTS ━━━${NC}"
expect_status "GET /achievements" "$BASE/achievements?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /achievements/1" "$BASE/achievements/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /achievements/1" "$BASE/achievements/1" "PUT" "$ADMIN_TOKEN" '{"title":"Updated Achievement"}' "200"

# 10. Duty Rosters
echo -e "\n${YELLOW}━━━ 10. DUTY ROSTERS ━━━${NC}"
expect_status "GET /duty-rosters" "$BASE/duty-rosters?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /duty-rosters/1" "$BASE/duty-rosters/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /duty-rosters/1" "$BASE/duty-rosters/1" "PUT" "$ADMIN_TOKEN" '{"shift":"NIGHT"}' "200"

# 11. Universities
echo -e "\n${YELLOW}━━━ 11. UNIVERSITIES ━━━${NC}"
expect_status "GET /universities" "$BASE/universities?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /universities/1" "$BASE/universities/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /universities/1" "$BASE/universities/1" "PUT" "$ADMIN_TOKEN" '{"name":"NEU Updated"}' "200"
expect_status "DELETE /universities/1 (chi_huy -> 403)" "$BASE/universities/1" "DELETE" "$CHIHUY_TOKEN" "" "403"

# 12. Classes
echo -e "\n${YELLOW}━━━ 12. CLASSES ━━━${NC}"
expect_status "GET /classes" "$BASE/classes?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /classes/1" "$BASE/classes/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /classes/1" "$BASE/classes/1" "PUT" "$ADMIN_TOKEN" '{"name":"CNTT K62 Updated"}' "200"
expect_status "DELETE /classes/1 (chi_huy -> 403)" "$BASE/classes/1" "DELETE" "$CHIHUY_TOKEN" "" "403"

# 13. Semesters
echo -e "\n${YELLOW}━━━ 13. SEMESTERS ━━━${NC}"
expect_status "GET /semesters" "$BASE/semesters?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /semesters/1" "$BASE/semesters/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /semesters/1" "$BASE/semesters/1" "PUT" "$ADMIN_TOKEN" '{"is_active":true}' "200"
expect_status "DELETE /semesters/1 (chi_huy -> 403)" "$BASE/semesters/1" "DELETE" "$CHIHUY_TOKEN" "" "403"

# 14. Courses
echo -e "\n${YELLOW}━━━ 14. COURSES ━━━${NC}"
expect_status "GET /courses" "$BASE/courses?page=1&limit=5" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /courses/1" "$BASE/courses/1" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "PUT /courses/1" "$BASE/courses/1" "PUT" "$ADMIN_TOKEN" '{"credits":4}' "200"
expect_status "DELETE /courses/1 (chi_huy -> 403)" "$BASE/courses/1" "DELETE" "$CHIHUY_TOKEN" "" "403"

# 15. Reports
echo -e "\n${YELLOW}━━━ 15. REPORTS ━━━${NC}"
expect_status "GET /reports/students (admin)" "$BASE/reports/students" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /reports/grades (admin)" "$BASE/reports/grades" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /reports/tuitions (admin)" "$BASE/reports/tuitions" "GET" "$ADMIN_TOKEN" "" "200"
expect_status "GET /reports/students (chi_huy)" "$BASE/reports/students" "GET" "$CHIHUY_TOKEN" "" "200"
expect_status "GET /reports/students (student -> 403)" "$BASE/reports/students" "GET" "$STUDENT_TOKEN" "" "403"

# 16. Edge cases
echo -e "\n${YELLOW}━━━ 16. EDGE CASES ━━━${NC}"
expect_status "GET /not-found-route" "http://localhost:6868/not-found" "GET" "" "" "404"
expect_status "GET /health" "http://localhost:6868/health" "GET" "" "" "200"
expect_status "GET /swagger.json" "http://localhost:6868/swagger.json" "GET" "" "" "200"

# Cleanup
echo -e "\n${YELLOW}━━━ CLEANUP ━━━${NC}"
for u in ftest_${RND} tuser_${RND} tmp_full_user tmp_full_user2 fulltest_user; do
  UINFO=$(curl -s "$BASE/users?search=$u&limit=1" -H "Authorization: Bearer $ADMIN_TOKEN")
  DELUID=$(echo "$UINFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0]['id'])" 2>/dev/null || echo "")
  if [ -n "$DELUID" ] && [ "$DELUID" != "" ]; then
    curl -s -X DELETE "$BASE/users/$DELUID" -H "Authorization: Bearer $ADMIN_TOKEN" > /dev/null 2>&1 || true
  fi
done
echo "Cleaned up test users"

echo -e "\n========================================"
echo -e "${GREEN}PASSED: $PASS${NC}  ${RED}FAILED: $FAIL${NC}"
echo "========================================"

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
fi
