#!/bin/bash
set +e
BASE="http://localhost:6868/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔥 Real API Integration Test - DB: student_manager"
echo "=================================================="

# 1. Auth - Admin Login
echo -e "\n${YELLOW}1. Auth API${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}')
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")
echo "Admin login: $(echo "$ADMIN_LOGIN" | python3 -m json.tool | head -n 5)"

CHIHUY_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"chihuy","password":"chihuy123"}')
CHIHUY_TOKEN=$(echo "$CHIHUY_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")

STUDENT_LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"student","password":"student123"}')
STUDENT_TOKEN=$(echo "$STUDENT_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null || echo "")

# Register new user
echo "Register newuser..."
REGISTER=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" -d '{"username":"realtest_user","email":"realtest@example.com","password":"password123","full_name":"Real Test User"}')
echo "$REGISTER" | python3 -m json.tool

# Refresh token
REFRESH_TOKEN=$(echo "$ADMIN_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['refreshToken'])" 2>/dev/null || echo "")
echo "Refresh token..."
curl -s -X POST "$BASE/auth/refresh-token" -H "Content-Type: application/json" -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | python3 -m json.tool | head -n 5

# 2. Users
echo -e "\n${YELLOW}2. Users API${NC}"
echo "GET /users/me (admin)"
curl -s "$BASE/users/me" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

echo "GET /users (admin)"
curl -s "$BASE/users?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /users/1"
curl -s "$BASE/users/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

echo "POST /users (admin create)"
NEW_USER=$(curl -s -X POST "$BASE/users" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"username":"tmp_api_user","email":"tmp_api@example.com","password":"password123","full_name":"Tmp User","role_id":3}')
echo "$NEW_USER" | python3 -m json.tool
NEW_USER_ID=$(echo "$NEW_USER" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "")

echo "PUT /users/$NEW_USER_ID"
curl -s -X PUT "$BASE/users/$NEW_USER_ID" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"full_name":"Updated Tmp"}' | python3 -m json.tool | head -n 6

echo "PATCH toggle-active /users/$NEW_USER_ID"
curl -s -X PATCH "$BASE/users/$NEW_USER_ID/toggle-active" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 6

echo "DELETE /users/$NEW_USER_ID"
curl -s -X DELETE "$BASE/users/$NEW_USER_ID" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 6

# 3. Students
echo -e "\n${YELLOW}3. Students API${NC}"
echo "GET /students"
curl -s "$BASE/students?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /students/1"
curl -s "$BASE/students/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 4. Grades
echo -e "\n${YELLOW}4. Grades API${NC}"
echo "GET /grades"
curl -s "$BASE/grades?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /grades/1"
curl -s "$BASE/grades/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 5. Grade Requests
echo -e "\n${YELLOW}5. Grade Requests API${NC}"
echo "GET /grade-requests"
curl -s "$BASE/grade-requests?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /grade-requests/1"
curl -s "$BASE/grade-requests/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 6. Schedules
echo -e "\n${YELLOW}6. Schedules API${NC}"
echo "GET /schedules"
curl -s "$BASE/schedules?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /schedules/1"
curl -s "$BASE/schedules/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 7. Meal Schedules
echo -e "\n${YELLOW}7. Meal Schedules API${NC}"
echo "GET /meal-schedules"
curl -s "$BASE/meal-schedules?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /meal-schedules/1"
curl -s "$BASE/meal-schedules/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 8. Tuitions
echo -e "\n${YELLOW}8. Tuitions API${NC}"
echo "GET /tuitions"
curl -s "$BASE/tuitions?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /tuitions/1"
curl -s "$BASE/tuitions/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 9. Achievements
echo -e "\n${YELLOW}9. Achievements API${NC}"
echo "GET /achievements"
curl -s "$BASE/achievements?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /achievements/1"
curl -s "$BASE/achievements/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 10. Duty Rosters
echo -e "\n${YELLOW}10. Duty Rosters API${NC}"
echo "GET /duty-rosters"
curl -s "$BASE/duty-rosters?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /duty-rosters/1"
curl -s "$BASE/duty-rosters/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 11. Universities
echo -e "\n${YELLOW}11. Universities API${NC}"
echo "GET /universities"
curl -s "$BASE/universities?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /universities/1"
curl -s "$BASE/universities/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 12. Classes
echo -e "\n${YELLOW}12. Classes API${NC}"
echo "GET /classes"
curl -s "$BASE/classes?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /classes/1"
curl -s "$BASE/classes/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 13. Semesters
echo -e "\n${YELLOW}13. Semesters API${NC}"
echo "GET /semesters"
curl -s "$BASE/semesters?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /semesters/1"
curl -s "$BASE/semesters/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 14. Courses
echo -e "\n${YELLOW}14. Courses API${NC}"
echo "GET /courses"
curl -s "$BASE/courses?page=1&limit=5" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 12

echo "GET /courses/1"
curl -s "$BASE/courses/1" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 15. Reports
echo -e "\n${YELLOW}15. Reports API${NC}"
echo "GET /reports/students"
curl -s "$BASE/reports/students" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

echo "GET /reports/grades"
curl -s "$BASE/reports/grades" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

echo "GET /reports/tuitions"
curl -s "$BASE/reports/tuitions" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | head -n 8

# 16. Role checks
echo -e "\n${YELLOW}16. Role Authorization Checks${NC}"
echo "Student accessing /users -> expect 403"
curl -s -o /dev/null -w "%{http_code}" "$BASE/users" -H "Authorization: Bearer $STUDENT_TOKEN"
echo " (should be 403)"

echo "ChiHuy accessing /users -> expect 200"
curl -s -o /dev/null -w "%{http_code}" "$BASE/users" -H "Authorization: Bearer $CHIHUY_TOKEN"
echo " (should be 200)"

echo "No token /users -> expect 401"
curl -s -o /dev/null -w "%{http_code}" "$BASE/users"
echo " (should be 401)"

# Cleanup test users created
echo -e "\n${YELLOW}Cleanup${NC}"
curl -s -X DELETE "$BASE/users/realtest_user" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" > /dev/null || true
curl -s -X DELETE "$BASE/users/tmp_api_user" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" > /dev/null || true
echo "Done cleanup"

echo -e "\n${GREEN}✅ All real API tests completed!${NC}"
