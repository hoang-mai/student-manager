const db = require('../models');
const bcrypt = require('bcrypt');

async function demo() {
  try {
    await db.sequelize.sync();
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
        fullName: 'Quản trị viên',
        phone: '0900000000',
        roleId: adminRole.id,
        isActive: true,
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
      defaults: { code: 'CNTT', name: 'Công nghệ thông tin', universityId: university.id },
    });
    console.log('Major ID:', major.id);

    // 5. Create academic year
    const [academicYear] = await db.academicYear.findOrCreate({
      where: { name: '2024-2025' },
      defaults: { name: '2024-2025', startYear: 2024, endYear: 2025 },
    });
    console.log('AcademicYear ID:', academicYear.id);

    // 6. Create semester
    const [semester] = await db.semester.findOrCreate({
      where: { name: 'Học kỳ 1 - 2024-2025' },
      defaults: {
        name: 'Học kỳ 1 - 2024-2025',
        academicYearId: academicYear.id,
        startDate: '2024-09-01',
        endDate: '2025-01-15',
        isActive: true,
      },
    });
    console.log('Semester ID:', semester.id);

    // 7. Create class
    const [cls] = await db.class.findOrCreate({
      where: { code: 'CNTT-K62' },
      defaults: {
        code: 'CNTT-K62',
        name: 'Công nghệ thông tin K62',
        majorId: major.id,
        academicYearId: academicYear.id,
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
        fullName: 'Nguyễn Văn Học',
        roleId: studentRole.id,
        isActive: true,
      },
    });
    console.log('StudentUser ID:', studentUser.id);

    // 10. Create student profile
    const [studentProfile] = await db.studentProfile.findOrCreate({
      where: { userId: studentUser.id },
      defaults: {
        userId: studentUser.id,
        studentCode: 'HV001',
        classId: cls.id,
        universityId: university.id,
        majorId: major.id,
        academicYearId: academicYear.id,
        gender: 'MALE',
        status: 'STUDYING',
      },
    });
    console.log('StudentProfile ID:', studentProfile.id);

    // 11. Create grade
    const [grade] = await db.grade.findOrCreate({
      where: { studentId: studentProfile.id, courseId: course.id, semesterId: semester.id },
      defaults: {
        studentId: studentProfile.id,
        courseId: course.id,
        semesterId: semester.id,
        score10: 8.5,
        score4: 3.5,
        letterGrade: 'B+',
        status: 'PASSED',
        createdBy: admin.id,
      },
    });
    console.log('Grade ID:', grade.id);

    // 12. Create schedule
    const [schedule] = await db.schedule.findOrCreate({
      where: { courseId: course.id, semesterId: semester.id, dayOfWeek: 2 },
      defaults: {
        classId: cls.id,
        courseId: course.id,
        semesterId: semester.id,
        dayOfWeek: 2,
        startTime: '07:00:00',
        endTime: '09:25:00',
        room: 'A101',
        scheduleType: 'CLASS',
      },
    });
    console.log('Schedule ID:', schedule.id);

    // 13. Create grade request
    const [gradeRequest] = await db.gradeRequest.findOrCreate({
      where: { studentId: studentProfile.id, courseId: course.id, semesterId: semester.id },
      defaults: {
        studentId: studentProfile.id,
        courseId: course.id,
        semesterId: semester.id,
        requestType: 'UPDATE',
        reason: 'Điểm thi bị nhập sai',
        proposedScore10: 9.0,
        status: 'PENDING',
      },
    });
    console.log('GradeRequest ID:', gradeRequest.id);

    // 14. Create tuition
    const [tuition] = await db.tuition.findOrCreate({
      where: { studentId: studentProfile.id, semesterId: semester.id },
      defaults: {
        studentId: studentProfile.id,
        semesterId: semester.id,
        amount: 5000000,
        paidAmount: 5000000,
        status: 'PAID',
        dueDate: '2024-10-15',
      },
    });
    console.log('Tuition ID:', tuition.id);

    // 15. Create achievement
    const [achievement] = await db.achievement.findOrCreate({
      where: { studentId: studentProfile.id, title: 'Giải nhất Olympic' },
      defaults: {
        studentId: studentProfile.id,
        title: 'Giải nhất Olympic',
        achievementType: 'REWARD',
        level: 'Cấp trường',
        issueDate: '2024-05-20',
        createdBy: admin.id,
      },
    });
    console.log('Achievement ID:', achievement.id);

    // 16. Create meal schedule
    const [meal] = await db.mealSchedule.findOrCreate({
      where: { studentId: studentProfile.id, scheduleDate: '2024-10-01', session: 'NOON' },
      defaults: {
        studentId: studentProfile.id,
        scheduleDate: '2024-10-01',
        session: 'NOON',
        status: 'REGISTERED',
      },
    });
    console.log('MealSchedule ID:', meal.id);

    // 17. Create duty roster
    const [duty] = await db.dutyRoster.findOrCreate({
      where: { userId: admin.id, dutyDate: '2024-10-01', shift: 'NIGHT' },
      defaults: {
        userId: admin.id,
        dutyDate: '2024-10-01',
        shift: 'NIGHT',
        dutyType: 'COMMAND',
        createdBy: admin.id,
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
