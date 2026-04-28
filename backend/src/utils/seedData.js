const bcrypt = require('bcrypt');
const db = require('../models');

async function clearData() {
  console.log('Clearing existing data...');
  await db.dutyRoster.destroy({ where: {}, truncate: true, cascade: true });
  await db.achievement.destroy({ where: {}, truncate: true, cascade: true });
  await db.mealSchedule.destroy({ where: {}, truncate: true, cascade: true });
  await db.tuition.destroy({ where: {}, truncate: true, cascade: true });
  await db.gradeRequest.destroy({ where: {}, truncate: true, cascade: true });
  await db.gradeRequestAttachment.destroy({ where: {}, truncate: true, cascade: true });
  await db.grade.destroy({ where: {}, truncate: true, cascade: true });
  await db.schedule.destroy({ where: {}, truncate: true, cascade: true });
  await db.studentProfile.destroy({ where: {}, truncate: true, cascade: true });
  await db.course.destroy({ where: {}, truncate: true, cascade: true });
  await db.semester.destroy({ where: {}, truncate: true, cascade: true });
  await db.class.destroy({ where: {}, truncate: true, cascade: true });
  await db.academicYear.destroy({ where: {}, truncate: true, cascade: true });
  await db.major.destroy({ where: {}, truncate: true, cascade: true });
  await db.university.destroy({ where: {}, truncate: true, cascade: true });
  await db.user.destroy({ where: {}, truncate: true, cascade: true });
  await db.role.destroy({ where: {}, truncate: true, cascade: true });
  console.log('Data cleared.');
}

async function seedRoles() {
  const roles = [
    { id: 1, name: 'admin', description: 'Quản trị viên toàn hệ thống' },
    { id: 2, name: 'chi_huy', description: 'Chỉ huy đơn vị' },
    { id: 3, name: 'hoc_vien', description: 'Học viên' },
  ];
  await db.role.bulkCreate(roles);
  console.log('Seeded: roles');
  return roles;
}

async function seedUsers() {
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedChiHuy = await bcrypt.hash('chihuy123', 10);
  const hashedStudent = await bcrypt.hash('student123', 10);

  const users = [
    { id: 1, username: 'admin', email: 'admin@studentmanager.local', password: hashedAdmin, full_name: 'Quản trị viên', phone: '0900000001', role_id: 1, is_active: true },
    { id: 2, username: 'chihuy1', email: 'chihuy1@studentmanager.local', password: hashedChiHuy, full_name: 'Thiếu tá Nguyễn Văn Chỉ Huy', phone: '0900000002', role_id: 2, is_active: true },
    { id: 3, username: 'chihuy2', email: 'chihuy2@studentmanager.local', password: hashedChiHuy, full_name: 'Thượng úy Trần Văn Phó', phone: '0900000003', role_id: 2, is_active: true },
    { id: 4, username: 'student01', email: 'sv01@studentmanager.local', password: hashedStudent, full_name: 'Nguyễn Văn Học', phone: '0900000011', role_id: 3, is_active: true },
    { id: 5, username: 'student02', email: 'sv02@studentmanager.local', password: hashedStudent, full_name: 'Trần Thị Hạnh', phone: '0900000012', role_id: 3, is_active: true },
    { id: 6, username: 'student03', email: 'sv03@studentmanager.local', password: hashedStudent, full_name: 'Lê Văn Minh', phone: '0900000013', role_id: 3, is_active: true },
    { id: 7, username: 'student04', email: 'sv04@studentmanager.local', password: hashedStudent, full_name: 'Phạm Thị Lan', phone: '0900000014', role_id: 3, is_active: true },
    { id: 8, username: 'student05', email: 'sv05@studentmanager.local', password: hashedStudent, full_name: 'Hoàng Văn Nam', phone: '0900000015', role_id: 3, is_active: true },
  ];
  await db.user.bulkCreate(users);
  console.log('Seeded: users (8 users)');
  return users;
}

async function seedUniversities() {
  const universities = [
    { id: 1, code: 'NEU', name: 'Đại học Kinh tế Quốc dân', address: '207 Giải Phóng, Hà Nội' },
    { id: 2, code: 'ULIS', name: 'Đại học Ngoại ngữ - ĐHQGHN', address: 'Phạm Văn Đồng, Hà Nội' },
  ];
  await db.university.bulkCreate(universities);
  console.log('Seeded: universities');
  return universities;
}

async function seedMajors() {
  const majors = [
    { id: 1, code: 'CNTT', name: 'Công nghệ thông tin', university_id: 1 },
    { id: 2, code: 'KTQT', name: 'Kinh tế quốc tế', university_id: 1 },
    { id: 3, code: 'TAV', name: 'Tiếng Anh thương mại', university_id: 2 },
  ];
  await db.major.bulkCreate(majors);
  console.log('Seeded: majors');
  return majors;
}

async function seedAcademicYears() {
  const years = [
    { id: 1, name: '2023-2024', start_year: 2023, end_year: 2024 },
    { id: 2, name: '2024-2025', start_year: 2024, end_year: 2025 },
  ];
  await db.academicYear.bulkCreate(years);
  console.log('Seeded: academic_years');
  return years;
}

async function seedClasses() {
  const classes = [
    { id: 1, code: 'CNTT-K61', name: 'Công nghệ thông tin K61', major_id: 1, academic_year_id: 1 },
    { id: 2, code: 'CNTT-K62', name: 'Công nghệ thông tin K62', major_id: 1, academic_year_id: 2 },
    { id: 3, code: 'KTQT-K62', name: 'Kinh tế quốc tế K62', major_id: 2, academic_year_id: 2 },
  ];
  await db.class.bulkCreate(classes);
  console.log('Seeded: classes');
  return classes;
}

async function seedSemesters() {
  const semesters = [
    { id: 1, name: 'Học kỳ 1 - 2023-2024', academic_year_id: 1, start_date: '2023-09-01', end_date: '2024-01-15', is_active: false },
    { id: 2, name: 'Học kỳ 2 - 2023-2024', academic_year_id: 1, start_date: '2024-02-01', end_date: '2024-06-15', is_active: false },
    { id: 3, name: 'Học kỳ 1 - 2024-2025', academic_year_id: 2, start_date: '2024-09-01', end_date: '2025-01-15', is_active: true },
    { id: 4, name: 'Học kỳ 2 - 2024-2025', academic_year_id: 2, start_date: '2025-02-01', end_date: '2025-06-15', is_active: false },
  ];
  await db.semester.bulkCreate(semesters);
  console.log('Seeded: semesters');
  return semesters;
}

async function seedCourses() {
  const courses = [
    { id: 1, code: 'IT101', name: 'Nhập môn lập trình', credits: 3 },
    { id: 2, code: 'IT102', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3 },
    { id: 3, code: 'IT103', name: 'Cơ sở dữ liệu', credits: 3 },
    { id: 4, code: 'IT104', name: 'Lập trình hướng đối tượng', credits: 3 },
    { id: 5, code: 'KT201', name: 'Kinh tế vi mô', credits: 2 },
    { id: 6, code: 'KT202', name: 'Kinh tế vĩ mô', credits: 2 },
    { id: 7, code: 'TA101', name: 'Tiếng Anh chuyên ngành 1', credits: 2 },
    { id: 8, code: 'TA102', name: 'Tiếng Anh chuyên ngành 2', credits: 2 },
  ];
  await db.course.bulkCreate(courses);
  console.log('Seeded: courses');
  return courses;
}

async function seedStudentProfiles() {
  const profiles = [
    { id: 1, user_id: 4, student_code: 'HV001', class_id: 2, university_id: 1, major_id: 1, academic_year_id: 2, gender: 'MALE', status: 'STUDYING', date_of_birth: '2005-03-15' },
    { id: 2, user_id: 5, student_code: 'HV002', class_id: 2, university_id: 1, major_id: 1, academic_year_id: 2, gender: 'FEMALE', status: 'STUDYING', date_of_birth: '2005-07-22' },
    { id: 3, user_id: 6, student_code: 'HV003', class_id: 3, university_id: 1, major_id: 2, academic_year_id: 2, gender: 'MALE', status: 'STUDYING', date_of_birth: '2005-01-10' },
    { id: 4, user_id: 7, student_code: 'HV004', class_id: 3, university_id: 1, major_id: 2, academic_year_id: 2, gender: 'FEMALE', status: 'STUDYING', date_of_birth: '2005-11-05' },
    { id: 5, user_id: 8, student_code: 'HV005', class_id: 2, university_id: 1, major_id: 1, academic_year_id: 2, gender: 'MALE', status: 'SUSPENDED', date_of_birth: '2005-05-20' },
  ];
  await db.studentProfile.bulkCreate(profiles);
  console.log('Seeded: student_profiles');
  return profiles;
}

async function seedGrades() {
  const grades = [
    { id: 1, student_id: 1, course_id: 1, semester_id: 3, score_10: 8.5, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: 1 },
    { id: 2, student_id: 1, course_id: 2, semester_id: 3, score_10: 9.0, score_4: 4.0, letter_grade: 'A', status: 'PASSED', created_by: 1 },
    { id: 3, student_id: 1, course_id: 3, semester_id: 3, score_10: 7.0, score_4: 3.0, letter_grade: 'B', status: 'PASSED', created_by: 1 },
    { id: 4, student_id: 2, course_id: 1, semester_id: 3, score_10: 9.5, score_4: 4.0, letter_grade: 'A+', status: 'PASSED', created_by: 1 },
    { id: 5, student_id: 2, course_id: 2, semester_id: 3, score_10: 8.0, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: 1 },
    { id: 6, student_id: 3, course_id: 5, semester_id: 3, score_10: 6.5, score_4: 2.5, letter_grade: 'C+', status: 'PASSED', created_by: 2 },
    { id: 7, student_id: 3, course_id: 6, semester_id: 3, score_10: 5.0, score_4: 2.0, letter_grade: 'D', status: 'PASSED', created_by: 2 },
    { id: 8, student_id: 4, course_id: 5, semester_id: 3, score_10: 4.0, score_4: 1.5, letter_grade: 'D-', status: 'FAILED', created_by: 2 },
    { id: 9, student_id: 5, course_id: 1, semester_id: 3, score_10: 3.5, score_4: 1.0, letter_grade: 'F', status: 'FAILED', created_by: 1 },
  ];
  await db.grade.bulkCreate(grades);
  console.log('Seeded: grades');
  return grades;
}

async function seedGradeRequests() {
  const requests = [
    { id: 1, student_id: 1, course_id: 1, semester_id: 3, request_type: 'UPDATE', reason: 'Điểm thi bị nhập sai', proposed_score_10: 9.0, status: 'PENDING' },
    { id: 2, student_id: 3, course_id: 6, semester_id: 3, request_type: 'UPDATE', reason: 'Em làm bài đầy đủ nhưng bị chấm thiếu', proposed_score_10: 6.0, status: 'APPROVED', review_note: 'Đã rà soát, đồng ý tăng điểm', reviewer_id: 2, reviewed_at: new Date() },
    { id: 3, student_id: 4, course_id: 5, semester_id: 3, request_type: 'ADD', reason: 'Xin phép thi lại do bị ốm', proposed_score_10: null, status: 'REJECTED', review_note: 'Không đủ minh chứng', reviewer_id: 2, reviewed_at: new Date() },
  ];
  await db.gradeRequest.bulkCreate(requests);
  console.log('Seeded: grade_requests');
  return requests;
}

async function seedSchedules() {
  const schedules = [
    { id: 1, class_id: 2, course_id: 1, semester_id: 3, day_of_week: 2, start_time: '07:00:00', end_time: '09:25:00', room: 'A101', schedule_type: 'CLASS' },
    { id: 2, class_id: 2, course_id: 2, semester_id: 3, day_of_week: 3, start_time: '09:30:00', end_time: '11:45:00', room: 'B202', schedule_type: 'CLASS' },
    { id: 3, class_id: 2, course_id: 3, semester_id: 3, day_of_week: 4, start_time: '13:00:00', end_time: '15:15:00', room: 'C303', schedule_type: 'CLASS' },
    { id: 4, class_id: 3, course_id: 5, semester_id: 3, day_of_week: 2, start_time: '07:00:00', end_time: '09:25:00', room: 'D404', schedule_type: 'CLASS' },
    { id: 5, class_id: null, student_id: 1, course_id: 1, semester_id: 3, day_of_week: 6, start_time: '08:00:00', end_time: '10:00:00', room: 'Online', schedule_type: 'PERSONAL' },
  ];
  await db.schedule.bulkCreate(schedules);
  console.log('Seeded: schedules');
  return schedules;
}

async function seedMealSchedules() {
  const meals = [
    { id: 1, student_id: 1, schedule_date: '2024-10-01', session: 'MORNING', status: 'REGISTERED' },
    { id: 2, student_id: 1, schedule_date: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
    { id: 3, student_id: 1, schedule_date: '2024-10-01', session: 'EVENING', status: 'CANCELLED' },
    { id: 4, student_id: 2, schedule_date: '2024-10-02', session: 'NOON', status: 'REGISTERED' },
    { id: 5, student_id: 3, schedule_date: '2024-10-03', session: 'MORNING', status: 'REGISTERED' },
  ];
  await db.mealSchedule.bulkCreate(meals);
  console.log('Seeded: meal_schedules');
  return meals;
}

async function seedTuitions() {
  const tuitions = [
    { id: 1, student_id: 1, semester_id: 3, amount: 5000000, paid_amount: 5000000, status: 'PAID', due_date: '2024-10-15' },
    { id: 2, student_id: 2, semester_id: 3, amount: 5000000, paid_amount: 5000000, status: 'PAID', due_date: '2024-10-15' },
    { id: 3, student_id: 3, semester_id: 3, amount: 4500000, paid_amount: 2000000, status: 'PARTIAL', due_date: '2024-10-15' },
    { id: 4, student_id: 4, semester_id: 3, amount: 4500000, paid_amount: 0, status: 'UNPAID', due_date: '2024-10-15' },
    { id: 5, student_id: 5, semester_id: 3, amount: 5000000, paid_amount: 5000000, status: 'PAID', due_date: '2024-10-15' },
  ];
  await db.tuition.bulkCreate(tuitions);
  console.log('Seeded: tuitions');
  return tuitions;
}

async function seedAchievements() {
  const achievements = [
    { id: 1, student_id: 1, title: 'Giải nhất Olympic Tin học', achievement_type: 'REWARD', level: 'Cấp trường', issue_date: '2024-05-20', created_by: 1 },
    { id: 2, student_id: 1, title: 'Sinh viên 5 tốt', achievement_type: 'TRAINING', level: 'Cấp khoa', issue_date: '2024-06-15', created_by: 1 },
    { id: 3, student_id: 2, title: 'Giải nhì Tiếng Anh chuyên ngành', achievement_type: 'REWARD', level: 'Cấp trường', issue_date: '2024-04-10', created_by: 1 },
    { id: 4, student_id: 3, title: 'Đề tài khoa học cấp trường', achievement_type: 'SCIENTIFIC_TOPIC', level: 'Cấp trường', issue_date: '2024-09-01', created_by: 2 },
  ];
  await db.achievement.bulkCreate(achievements);
  console.log('Seeded: achievements');
  return achievements;
}

async function seedDutyRosters() {
  const rosters = [
    { id: 1, user_id: 1, duty_date: '2024-10-01', shift: 'MORNING', duty_type: 'COMMAND', note: 'Trực ban chỉ huy', created_by: 1 },
    { id: 2, user_id: 2, duty_date: '2024-10-01', shift: 'NIGHT', duty_type: 'SECURITY', note: 'Trực đêm khu A', created_by: 1 },
    { id: 3, user_id: 1, duty_date: '2024-10-02', shift: 'AFTERNOON', duty_type: 'COMMAND', created_by: 1 },
    { id: 4, user_id: 2, duty_date: '2024-10-03', shift: 'FULL', duty_type: 'OTHER', note: 'Kiểm tra đột xuất', created_by: 1 },
  ];
  await db.dutyRoster.bulkCreate(rosters);
  console.log('Seeded: duty_rosters');
  return rosters;
}

async function seed(options = {}) {
  const { force = false, sync = true } = options;

  try {
    if (sync) {
      await db.sequelize.sync({ force });
      console.log(`Database synced (force: ${force}).`);
    }

    if (force) {
      await clearData();
    }

    console.log('\n🌱 Starting seed...\n');

    await seedRoles();
    await seedUsers();
    await seedUniversities();
    await seedMajors();
    await seedAcademicYears();
    await seedClasses();
    await seedSemesters();
    await seedCourses();
    await seedStudentProfiles();
    await seedGrades();
    await seedGradeRequests();
    await seedSchedules();
    await seedMealSchedules();
    await seedTuitions();
    await seedAchievements();
    await seedDutyRosters();

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Test accounts:');
    console.log('   Admin:    admin      / admin123');
    console.log('   ChiHuy:   chihuy1    / chihuy123');
    console.log('   ChiHuy:   chihuy2    / chihuy123');
    console.log('   Student:  student01  / student123');
    console.log('   Student:  student02  / student123');
    console.log('\n📊 Data summary:');
    console.log('   8 users | 3 classes | 5 students | 9 grades | 3 grade requests');
    console.log('   5 schedules | 5 meals | 5 tuitions | 4 achievements | 4 duty rosters');

    return true;
  } catch (err) {
    console.error('\n❌ Seed error:', err);
    return false;
  }
}

module.exports = { seed, clearData };
