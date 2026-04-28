const db = require('../models');
const bcrypt = require('bcrypt');

async function demo() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Database synced.');

    // 1. Create roles if not exist
    const roles = ['admin', 'chi_huy', 'hoc_vien'];
    for (const name of roles) {
      await db.role.findOrCreate({ where: { name }, defaults: { name } });
    }

    // 2. Create admin user
    const adminRole = await db.role.findOne({ where: { name: 'admin' } });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [admin] = await db.user.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@studentmanager.local',
        password: hashedPassword,
        full_name: 'Quản trị viên',
        phone: '0900000000',
        role_id: adminRole.id,
        is_active: true,
      },
    });
    console.log('Admin ID:', admin.id);

    // 3. Create university
    const [university] = await db.university.findOrCreate({
      where: { code: 'NEU' },
      defaults: { code: 'NEU', name: 'Đại học Kinh tế Quốc dân', address: '207 Giải Phóng' },
    });
    console.log('University ID:', university.id);

    // 4. Create major
    const [major] = await db.major.findOrCreate({
      where: { code: 'CNTT' },
      defaults: { code: 'CNTT', name: 'Công nghệ thông tin', university_id: university.id },
    });
    console.log('Major ID:', major.id);

    // 5. Create academic year
    const [academicYear] = await db.academicYear.findOrCreate({
      where: { name: '2024-2025' },
      defaults: { name: '2024-2025', start_year: 2024, end_year: 2025 },
    });
    console.log('AcademicYear ID:', academicYear.id);

    // 6. Create semester
    const [semester] = await db.semester.findOrCreate({
      where: { name: 'Học kỳ 1 - 2024-2025' },
      defaults: {
        name: 'Học kỳ 1 - 2024-2025',
        academic_year_id: academicYear.id,
        start_date: '2024-09-01',
        end_date: '2025-01-15',
        is_active: true,
      },
    });
    console.log('Semester ID:', semester.id);

    // 7. Create class
    const [cls] = await db.class.findOrCreate({
      where: { code: 'CNTT-K62' },
      defaults: {
        code: 'CNTT-K62',
        name: 'Công nghệ thông tin K62',
        major_id: major.id,
        academic_year_id: academicYear.id,
      },
    });
    console.log('Class ID:', cls.id);

    // 8. Create course
    const [course] = await db.course.findOrCreate({
      where: { code: 'IT101' },
      defaults: { code: 'IT101', name: 'Nhập môn lập trình', credits: 3 },
    });
    console.log('Course ID:', course.id);

    // 9. Create student user
    const studentRole = await db.role.findOne({ where: { name: 'hoc_vien' } });
    const [studentUser] = await db.user.findOrCreate({
      where: { username: 'student01' },
      defaults: {
        username: 'student01',
        email: 'sv01@example.com',
        password: await bcrypt.hash('123456', 10),
        full_name: 'Nguyễn Văn Học',
        role_id: studentRole.id,
        is_active: true,
      },
    });
    console.log('StudentUser ID:', studentUser.id);

    // 10. Create student profile
    const [studentProfile] = await db.studentProfile.findOrCreate({
      where: { user_id: studentUser.id },
      defaults: {
        user_id: studentUser.id,
        student_code: 'HV001',
        class_id: cls.id,
        university_id: university.id,
        major_id: major.id,
        academic_year_id: academicYear.id,
        gender: 'MALE',
        status: 'STUDYING',
      },
    });
    console.log('StudentProfile ID:', studentProfile.id);

    // 11. Create grade
    const [grade] = await db.grade.findOrCreate({
      where: { student_id: studentProfile.id, course_id: course.id, semester_id: semester.id },
      defaults: {
        student_id: studentProfile.id,
        course_id: course.id,
        semester_id: semester.id,
        score_10: 8.5,
        score_4: 3.5,
        letter_grade: 'B+',
        status: 'PASSED',
        created_by: admin.id,
      },
    });
    console.log('Grade ID:', grade.id);

    // 12. Create schedule
    const [schedule] = await db.schedule.findOrCreate({
      where: { course_id: course.id, semester_id: semester.id, day_of_week: 2 },
      defaults: {
        class_id: cls.id,
        course_id: course.id,
        semester_id: semester.id,
        day_of_week: 2,
        start_time: '07:00:00',
        end_time: '09:25:00',
        room: 'A101',
        schedule_type: 'CLASS',
      },
    });
    console.log('Schedule ID:', schedule.id);

    // 13. Create grade request
    const [gradeRequest] = await db.gradeRequest.findOrCreate({
      where: { student_id: studentProfile.id, course_id: course.id, semester_id: semester.id },
      defaults: {
        student_id: studentProfile.id,
        course_id: course.id,
        semester_id: semester.id,
        request_type: 'UPDATE',
        reason: 'Điểm thi bị nhập sai',
        proposed_score_10: 9.0,
        status: 'PENDING',
      },
    });
    console.log('GradeRequest ID:', gradeRequest.id);

    // 14. Create tuition
    const [tuition] = await db.tuition.findOrCreate({
      where: { student_id: studentProfile.id, semester_id: semester.id },
      defaults: {
        student_id: studentProfile.id,
        semester_id: semester.id,
        amount: 5000000,
        paid_amount: 5000000,
        status: 'PAID',
        due_date: '2024-10-15',
      },
    });
    console.log('Tuition ID:', tuition.id);

    // 15. Create achievement
    const [achievement] = await db.achievement.findOrCreate({
      where: { student_id: studentProfile.id, title: 'Giải nhất Olympic' },
      defaults: {
        student_id: studentProfile.id,
        title: 'Giải nhất Olympic',
        achievement_type: 'REWARD',
        level: 'Cấp trường',
        issue_date: '2024-05-20',
        created_by: admin.id,
      },
    });
    console.log('Achievement ID:', achievement.id);

    // 16. Create meal schedule
    const [meal] = await db.mealSchedule.findOrCreate({
      where: { student_id: studentProfile.id, schedule_date: '2024-10-01', session: 'NOON' },
      defaults: {
        student_id: studentProfile.id,
        schedule_date: '2024-10-01',
        session: 'NOON',
        status: 'REGISTERED',
      },
    });
    console.log('MealSchedule ID:', meal.id);

    // 17. Create duty roster
    const [duty] = await db.dutyRoster.findOrCreate({
      where: { user_id: admin.id, duty_date: '2024-10-01', shift: 'NIGHT' },
      defaults: {
        user_id: admin.id,
        duty_date: '2024-10-01',
        shift: 'NIGHT',
        duty_type: 'COMMAND',
        created_by: admin.id,
      },
    });
    console.log('DutyRoster ID:', duty.id);

    console.log('\n✅ DEMO DATA CREATED SUCCESSFULLY');
    console.log('Swagger UI: http://localhost:6868/api-docs');
    console.log('Login: admin / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

demo();
