require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcrypt');


async function fullSeed() {
  try {
    await db.sequelize.sync();
    console.log('Database synced.');

    // Truncate all tables (with CASCADE) and restart sequences for clean seed
    const tables = [
      'duty_rosters', 'meal_schedules', 'tuitions', 'schedules',
      'achievements', 'grade_request_attachments', 'grade_requests',
      'grades', 'student_profiles', 'courses', 'semesters', 'classes',
      'academic_years', 'majors', 'universities', 'training_units',
      'role_permissions', 'permissions', 'users', 'roles'
    ];
    for (const table of tables) {
      await db.sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    }
    console.log('All tables truncated.');

    // ==========================
    // 1. ROLES
    // ==========================
    const roles = [
      { name: 'admin', description: 'Quản trị viên toàn hệ thống' },
      { name: 'chi_huy', description: 'Chỉ huy đơn vị' },
      { name: 'hoc_vien', description: 'Học viên' },
    ];
    for (const r of roles) {
      await db.role.findOrCreate({ where: { name: r.name }, defaults: r });
    }
    const roleAdmin = await db.role.findOne({ where: { name: 'admin' } });
    const roleChiHuy = await db.role.findOne({ where: { name: 'chi_huy' } });
    const roleHocVien = await db.role.findOne({ where: { name: 'hoc_vien' } });
    console.log('Roles seeded.');

    // ==========================
    // 2. PERMISSIONS
    // ==========================
    const permissions = [
      { name: 'users_view', resource: 'users', action: 'VIEW', description: 'Xem danh sách ngườii dùng' },
      { name: 'users_create', resource: 'users', action: 'CREATE', description: 'Tạo ngườii dùng' },
      { name: 'users_update', resource: 'users', action: 'UPDATE', description: 'Cập nhật ngườii dùng' },
      { name: 'users_delete', resource: 'users', action: 'DELETE', description: 'Xóa ngườii dùng' },
      { name: 'students_view', resource: 'students', action: 'VIEW', description: 'Xem học viên' },
      { name: 'students_create', resource: 'students', action: 'CREATE', description: 'Tạo học viên' },
      { name: 'students_update', resource: 'students', action: 'UPDATE', description: 'Cập nhật học viên' },
      { name: 'students_delete', resource: 'students', action: 'DELETE', description: 'Xóa học viên' },
      { name: 'grades_view', resource: 'grades', action: 'VIEW', description: 'Xem điểm' },
      { name: 'grades_create', resource: 'grades', action: 'CREATE', description: 'Nhập điểm' },
      { name: 'grades_update', resource: 'grades', action: 'UPDATE', description: 'Cập nhật điểm' },
      { name: 'grades_delete', resource: 'grades', action: 'DELETE', description: 'Xóa điểm' },
      { name: 'courses_view', resource: 'courses', action: 'VIEW', description: 'Xem môn học' },
      { name: 'courses_manage', resource: 'courses', action: 'MANAGE', description: 'Quản lý môn học' },
      { name: 'schedules_view', resource: 'schedules', action: 'VIEW', description: 'Xem thờii khóa biểu' },
      { name: 'schedules_manage', resource: 'schedules', action: 'MANAGE', description: 'Quản lý thờii khóa biểu' },
      { name: 'tuitions_view', resource: 'tuitions', action: 'VIEW', description: 'Xem học phí' },
      { name: 'tuitions_manage', resource: 'tuitions', action: 'MANAGE', description: 'Quản lý học phí' },
      { name: 'reports_view', resource: 'reports', action: 'VIEW', description: 'Xem báo cáo' },
      { name: 'settings_manage', resource: 'settings', action: 'MANAGE', description: 'Quản lý cài đặt' },
    ];
    for (const p of permissions) {
      await db.permission.findOrCreate({ where: { name: p.name }, defaults: p });
    }
    const allPermissions = await db.permission.findAll();
    console.log('Permissions seeded.');

    // ==========================
    // 3. ROLE_PERMISSIONS
    // ==========================
    // Admin có tất cả quyền
    for (const perm of allPermissions) {
      await db.rolePermission.findOrCreate({
        where: { roleId: roleAdmin.id, permissionId: perm.id },
        defaults: { roleId: roleAdmin.id, permissionId: perm.id },
      });
    }
    // Chỉ huy: xem + quản lý học viên, điểm, thờii khóa biểu, học phí
    const chiHuyPerms = allPermissions.filter(p =>
      ['students_view','students_create','students_update',
       'grades_view','grades_create','grades_update',
       'schedules_view','schedules_manage',
       'tuitions_view','tuitions_manage',
       'courses_view','reports_view'].includes(p.name)
    );
    for (const perm of chiHuyPerms) {
      await db.rolePermission.findOrCreate({
        where: { roleId: roleChiHuy.id, permissionId: perm.id },
        defaults: { roleId: roleChiHuy.id, permissionId: perm.id },
      });
    }
    // Học viên: chỉ xem
    const hocVienPerms = allPermissions.filter(p =>
      ['students_view','grades_view','schedules_view','courses_view','tuitions_view'].includes(p.name)
    );
    for (const perm of hocVienPerms) {
      await db.rolePermission.findOrCreate({
        where: { roleId: roleHocVien.id, permissionId: perm.id },
        defaults: { roleId: roleHocVien.id, permissionId: perm.id },
      });
    }
    console.log('Role-Permissions seeded.');

    // ==========================
    // 4. USERS
    // ==========================
    const usersData = [
      { username: 'admin', email: 'admin@qldt.local', password: await bcrypt.hash('admin123', 10), fullName: 'Nguyễn Văn Quản Trị', phone: '0900000001', roleId: roleAdmin.id, isActive: true },
      { username: 'chihuy01', email: 'ch1@qldt.local', password: await bcrypt.hash('chihuy123', 10), fullName: 'Trần Văn Chỉ Huy', phone: '0900000002', roleId: roleChiHuy.id, isActive: true },
      { username: 'chihuy02', email: 'ch2@qldt.local', password: await bcrypt.hash('chihuy123', 10), fullName: 'Lê Thị Chỉ Huy', phone: '0900000003', roleId: roleChiHuy.id, isActive: true },
      { username: 'hv001', email: 'hv001@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Phạm Văn An', phone: '0900000011', roleId: roleHocVien.id, isActive: true },
      { username: 'hv002', email: 'hv002@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Nguyễn Thị Bình', phone: '0900000012', roleId: roleHocVien.id, isActive: true },
      { username: 'hv003', email: 'hv003@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Trần Văn Cường', phone: '0900000013', roleId: roleHocVien.id, isActive: true },
      { username: 'hv004', email: 'hv004@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Lê Thị Dung', phone: '0900000014', roleId: roleHocVien.id, isActive: true },
      { username: 'hv005', email: 'hv005@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Hoàng Văn Em', phone: '0900000015', roleId: roleHocVien.id, isActive: true },
      { username: 'hv006', email: 'hv006@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Vũ Thị Phương', phone: '0900000016', roleId: roleHocVien.id, isActive: true },
      { username: 'hv007', email: 'hv007@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Đặng Văn Giang', phone: '0900000017', roleId: roleHocVien.id, isActive: true },
      { username: 'hv008', email: 'hv008@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Bùi Thị Hương', phone: '0900000018', roleId: roleHocVien.id, isActive: true },
      { username: 'hv009', email: 'hv009@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Ngô Văn Ích', phone: '0900000019', roleId: roleHocVien.id, isActive: true },
      { username: 'hv010', email: 'hv010@qldt.local', password: await bcrypt.hash('hocvien123', 10), fullName: 'Dương Thị Kim', phone: '0900000020', roleId: roleHocVien.id, isActive: true },
    ];
    const users = [];
    for (const u of usersData) {
      const [user] = await db.user.findOrCreate({ where: { username: u.username }, defaults: u });
      users.push(user);
    }
    const adminUser = users.find(u => u.username === 'admin');
    const chiHuyUsers = users.filter(u => u.roleId === roleChiHuy.id);
    const hocVienUsers = users.filter(u => u.roleId === roleHocVien.id);
    console.log('Users seeded.');

    // ==========================
    // 5. TRAINING UNITS
    // ==========================
    const trainingUnitsData = [
      { code: 'DH1', name: 'Đại đội 1', address: 'Khu A - Doanh trại Quân sự', phone: '0241111111', commanderId: chiHuyUsers[0].id },
      { code: 'DH2', name: 'Đại đội 2', address: 'Khu B - Doanh trại Quân sự', phone: '0242222222', commanderId: chiHuyUsers[1].id },
    ];
    const trainingUnits = [];
    for (const tu of trainingUnitsData) {
      const [unit] = await db.trainingUnit.findOrCreate({ where: { code: tu.code }, defaults: tu });
      trainingUnits.push(unit);
    }
    console.log('TrainingUnits seeded.');

    // ==========================
    // 6. UNIVERSITIES
    // ==========================
    const universitiesData = [
      { code: 'NEU', name: 'Đại học Kinh tế Quốc dân', address: '207 Giải Phóng, Hai Bà Trưng, Hà Nội' },
      { code: 'FTU', name: 'Đại học Ngoại thương', address: '91 Chùa Láng, Đống Đa, Hà Nội' },
      { code: 'ULIS', name: 'Đại học Ngoại ngữ - ĐHQGHN', address: 'Phạm Văn Đồng, Cầu Giấy, Hà Nội' },
    ];
    const universities = [];
    for (const u of universitiesData) {
      const [univ] = await db.university.findOrCreate({ where: { code: u.code }, defaults: u });
      universities.push(univ);
    }
    console.log('Universities seeded.');

    // ==========================
    // 7. MAJORS
    // ==========================
    const majorsData = [
      { code: 'CNTT', name: 'Công nghệ thông tin', universityId: universities[0].id },
      { code: 'KTPM', name: 'Kỹ thuật phần mềm', universityId: universities[0].id },
      { code: 'HTTT', name: 'Hệ thống thông tin', universityId: universities[0].id },
      { code: 'KTQT', name: 'Kinh tế quốc tế', universityId: universities[1].id },
      { code: 'TMDT', name: 'Thương mại điện tử', universityId: universities[1].id },
      { code: 'TA', name: 'Ngôn ngữ Anh', universityId: universities[2].id },
      { code: 'TRUNG', name: 'Ngôn ngữ Trung', universityId: universities[2].id },
    ];
    const majors = [];
    for (const m of majorsData) {
      const [major] = await db.major.findOrCreate({ where: { code: m.code }, defaults: m });
      majors.push(major);
    }
    console.log('Majors seeded.');

    // ==========================
    // 8. ACADEMIC YEARS
    // ==========================
    const academicYearsData = [
      { name: '2022-2023', startYear: 2022, endYear: 2023 },
      { name: '2023-2024', startYear: 2023, endYear: 2024 },
      { name: '2024-2025', startYear: 2024, endYear: 2025 },
      { name: '2025-2026', startYear: 2025, endYear: 2026 },
    ];
    const academicYears = [];
    for (const ay of academicYearsData) {
      const [year] = await db.academicYear.findOrCreate({ where: { name: ay.name }, defaults: ay });
      academicYears.push(year);
    }
    console.log('AcademicYears seeded.');

    // ==========================
    // 9. CLASSES
    // ==========================
    const classesData = [
      { code: 'CNTT-K60', name: 'Công nghệ thông tin K60', majorId: majors[0].id, academicYearId: academicYears[0].id, trainingUnitId: trainingUnits[0].id, commanderId: chiHuyUsers[0].id },
      { code: 'KTPM-K61', name: 'Kỹ thuật phần mềm K61', majorId: majors[1].id, academicYearId: academicYears[1].id, trainingUnitId: trainingUnits[0].id, commanderId: chiHuyUsers[0].id },
      { code: 'HTTT-K62', name: 'Hệ thống thông tin K62', majorId: majors[2].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, commanderId: chiHuyUsers[1].id },
      { code: 'KTQT-K62', name: 'Kinh tế quốc tế K62', majorId: majors[3].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, commanderId: chiHuyUsers[1].id },
      { code: 'TMDT-K61', name: 'Thương mại điện tử K61', majorId: majors[4].id, academicYearId: academicYears[1].id, trainingUnitId: trainingUnits[0].id, commanderId: chiHuyUsers[0].id },
      { code: 'TA-K63', name: 'Ngôn ngữ Anh K63', majorId: majors[5].id, academicYearId: academicYears[3].id, trainingUnitId: trainingUnits[1].id, commanderId: chiHuyUsers[1].id },
    ];
    const classes = [];
    for (const c of classesData) {
      const [cls] = await db.class.findOrCreate({ where: { code: c.code }, defaults: c });
      classes.push(cls);
    }
    console.log('Classes seeded.');

    // ==========================
    // 10. SEMESTERS
    // ==========================
    const semestersData = [
      { name: 'Học kỳ 1 - 2024-2025', academicYearId: academicYears[2].id, startDate: '2024-09-02', endDate: '2025-01-19', registrationStart: '2024-08-15', registrationEnd: '2024-09-01', examStart: '2025-01-06', examEnd: '2025-01-19', gradeEntryDeadline: '2025-01-26', isActive: true },
      { name: 'Học kỳ 2 - 2024-2025', academicYearId: academicYears[2].id, startDate: '2025-02-10', endDate: '2025-06-15', registrationStart: '2025-01-25', registrationEnd: '2025-02-09', examStart: '2025-06-02', examEnd: '2025-06-15', gradeEntryDeadline: '2025-06-22', isActive: true },
      { name: 'Học kỳ 1 - 2023-2024', academicYearId: academicYears[1].id, startDate: '2023-09-04', endDate: '2024-01-21', registrationStart: '2023-08-20', registrationEnd: '2023-09-03', examStart: '2024-01-08', examEnd: '2024-01-21', gradeEntryDeadline: '2024-01-28', isActive: false },
      { name: 'Học kỳ 2 - 2023-2024', academicYearId: academicYears[1].id, startDate: '2024-02-12', endDate: '2024-06-16', registrationStart: '2024-01-27', registrationEnd: '2024-02-11', examStart: '2024-06-03', examEnd: '2024-06-16', gradeEntryDeadline: '2024-06-23', isActive: false },
    ];
    const semesters = [];
    for (const s of semestersData) {
      const [sem] = await db.semester.findOrCreate({ where: { name: s.name }, defaults: s });
      semesters.push(sem);
    }
    console.log('Semesters seeded.');

    // ==========================
    // 11. COURSES
    // ==========================
    const coursesData = [
      { code: 'IT101', name: 'Nhập môn lập trình', credits: 3, description: 'Giới thiệu tư duy lập trình và ngôn ngữ C' },
      { code: 'IT102', name: 'Cấu trúc dữ liệu và giải thuật', credits: 4, description: 'Các cấu trúc dữ liệu cơ bản và thuật toán' },
      { code: 'IT103', name: 'Cơ sở dữ liệu', credits: 3, description: 'Thiết kế và quản trị cơ sở dữ liệu' },
      { code: 'IT104', name: 'Lập trình hướng đối tượng', credits: 3, description: 'Nguyên lý OOP với Java/C++' },
      { code: 'IT105', name: 'Mạng máy tính', credits: 3, description: 'Kiến thức mạng cơ bản đến nâng cao' },
      { code: 'IT106', name: 'Hệ điều hành', credits: 3, description: 'Nguyên lý hệ điều hành' },
      { code: 'IT107', name: 'Lập trình Web', credits: 3, description: 'HTML, CSS, JS và framework hiện đại' },
      { code: 'IT108', name: 'Trí tuệ nhân tạo', credits: 3, description: 'Cơ sở AI và Machine Learning' },
      { code: 'KT101', name: 'Kinh tế vi mô', credits: 3, description: 'Nguyên lý kinh tế vi mô' },
      { code: 'KT102', name: 'Kinh tế vĩ mô', credits: 3, description: 'Nguyên lý kinh tế vĩ mô' },
      { code: 'NN101', name: 'Tiếng Anh chuyên ngành 1', credits: 2, description: 'Tiếng Anh cơ bản cho chuyên ngành' },
      { code: 'NN102', name: 'Tiếng Anh chuyên ngành 2', credits: 2, description: 'Tiếng Anh nâng cao cho chuyên ngành' },
      { code: 'QP101', name: 'GDQP&AN 1', credits: 4, description: 'Giáo dục quốc phòng và an ninh' },
      { code: 'QP102', name: 'GDQP&AN 2', credits: 3, description: 'Chiến thuật, kỹ thuật bắn súng' },
    ];
    const courses = [];
    for (const c of coursesData) {
      const [course] = await db.course.findOrCreate({ where: { code: c.code }, defaults: c });
      courses.push(course);
    }
    console.log('Courses seeded.');

    // ==========================
    // 12. STUDENT PROFILES
    // ==========================
    const studentProfilesData = [
      { userId: hocVienUsers[0].id, studentCode: 'HV001', classId: classes[0].id, universityId: universities[0].id, majorId: majors[0].id, academicYearId: academicYears[0].id, trainingUnitId: trainingUnits[0].id, gender: 'MALE', dateOfBirth: '2002-03-15', idCardNumber: '001092001234', militaryRank: 'Hạ sĩ', unit: 'Đại đội 1', enrollmentDate: '2022-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[1].id, studentCode: 'HV002', classId: classes[1].id, universityId: universities[0].id, majorId: majors[1].id, academicYearId: academicYears[1].id, trainingUnitId: trainingUnits[0].id, gender: 'FEMALE', dateOfBirth: '2003-07-22', idCardNumber: '001092005678', militaryRank: 'Hạ sĩ', unit: 'Đại đội 1', enrollmentDate: '2023-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[2].id, studentCode: 'HV003', classId: classes[2].id, universityId: universities[0].id, majorId: majors[2].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, gender: 'MALE', dateOfBirth: '2004-01-10', idCardNumber: '001092009012', militaryRank: 'Binh nhất', unit: 'Đại đội 2', enrollmentDate: '2024-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[3].id, studentCode: 'HV004', classId: classes[3].id, universityId: universities[1].id, majorId: majors[3].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, gender: 'FEMALE', dateOfBirth: '2004-05-18', idCardNumber: '001092013456', militaryRank: 'Binh nhất', unit: 'Đại đội 2', enrollmentDate: '2024-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[4].id, studentCode: 'HV005', classId: classes[4].id, universityId: universities[1].id, majorId: majors[4].id, academicYearId: academicYears[1].id, trainingUnitId: trainingUnits[0].id, gender: 'MALE', dateOfBirth: '2003-11-30', idCardNumber: '001092017890', militaryRank: 'Hạ sĩ', unit: 'Đại đội 1', enrollmentDate: '2023-09-01', status: 'SUSPENDED' },
      { userId: hocVienUsers[5].id, studentCode: 'HV006', classId: classes[5].id, universityId: universities[2].id, majorId: majors[5].id, academicYearId: academicYears[3].id, trainingUnitId: trainingUnits[1].id, gender: 'FEMALE', dateOfBirth: '2005-02-14', idCardNumber: '001092021234', militaryRank: 'Binh nhì', unit: 'Đại đội 2', enrollmentDate: '2025-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[6].id, studentCode: 'HV007', classId: classes[0].id, universityId: universities[0].id, majorId: majors[0].id, academicYearId: academicYears[0].id, trainingUnitId: trainingUnits[0].id, gender: 'MALE', dateOfBirth: '2002-08-05', idCardNumber: '001092025678', militaryRank: 'Trung sĩ', unit: 'Đại đội 1', enrollmentDate: '2022-09-01', status: 'GRADUATED' },
      { userId: hocVienUsers[7].id, studentCode: 'HV008', classId: classes[1].id, universityId: universities[0].id, majorId: majors[1].id, academicYearId: academicYears[1].id, trainingUnitId: trainingUnits[0].id, gender: 'FEMALE', dateOfBirth: '2003-04-20', idCardNumber: '001092029012', militaryRank: 'Hạ sĩ', unit: 'Đại đội 1', enrollmentDate: '2023-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[8].id, studentCode: 'HV009', classId: classes[2].id, universityId: universities[0].id, majorId: majors[2].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, gender: 'OTHER', dateOfBirth: '2004-09-09', idCardNumber: '001092033456', militaryRank: 'Binh nhì', unit: 'Đại đội 2', enrollmentDate: '2024-09-01', status: 'STUDYING' },
      { userId: hocVienUsers[9].id, studentCode: 'HV010', classId: classes[3].id, universityId: universities[1].id, majorId: majors[3].id, academicYearId: academicYears[2].id, trainingUnitId: trainingUnits[1].id, gender: 'FEMALE', dateOfBirth: '2004-12-25', idCardNumber: '001092037890', militaryRank: 'Binh nhì', unit: 'Đại đội 2', enrollmentDate: '2024-09-01', status: 'DROPPED' },
    ];
    const studentProfiles = [];
    for (const sp of studentProfilesData) {
      const [profile] = await db.studentProfile.findOrCreate({ where: { userId: sp.userId }, defaults: sp });
      studentProfiles.push(profile);
    }
    console.log('StudentProfiles seeded.');

    // ==========================
    // 13. GRADES
    // ==========================
    const gradesData = [
      { studentId: studentProfiles[0].id, courseId: courses[0].id, semesterId: semesters[2].id, score10: 8.5, score4: 3.5, letterGrade: 'B+', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[0].id, courseId: courses[1].id, semesterId: semesters[2].id, score10: 7.0, score4: 2.5, letterGrade: 'C+', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[0].id, courseId: courses[2].id, semesterId: semesters[3].id, score10: 9.0, score4: 4.0, letterGrade: 'A', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[1].id, courseId: courses[0].id, semesterId: semesters[2].id, score10: 6.5, score4: 2.5, letterGrade: 'C+', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[1].id, courseId: courses[3].id, semesterId: semesters[3].id, score10: 8.0, score4: 3.5, letterGrade: 'B+', status: 'PASSED', createdBy: chiHuyUsers[0].id },
      { studentId: studentProfiles[2].id, courseId: courses[0].id, semesterId: semesters[0].id, score10: 5.0, score4: 2.0, letterGrade: 'C', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[2].id, courseId: courses[1].id, semesterId: semesters[0].id, score10: 3.5, score4: 0.0, letterGrade: 'F', status: 'FAILED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[2].id, courseId: courses[4].id, semesterId: semesters[0].id, score10: 7.5, score4: 3.0, letterGrade: 'B', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[3].id, courseId: courses[8].id, semesterId: semesters[0].id, score10: 8.5, score4: 3.5, letterGrade: 'B+', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[3].id, courseId: courses[9].id, semesterId: semesters[0].id, score10: 9.5, score4: 4.0, letterGrade: 'A+', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[4].id, courseId: courses[0].id, semesterId: semesters[2].id, score10: 4.0, score4: 0.0, letterGrade: 'F', status: 'FAILED', createdBy: chiHuyUsers[0].id },
      { studentId: studentProfiles[5].id, courseId: courses[10].id, semesterId: semesters[0].id, score10: 7.0, score4: 2.5, letterGrade: 'C+', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[5].id, courseId: courses[12].id, semesterId: semesters[0].id, score10: 8.0, score4: 3.5, letterGrade: 'B+', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[6].id, courseId: courses[0].id, semesterId: semesters[2].id, score10: 9.5, score4: 4.0, letterGrade: 'A+', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[6].id, courseId: courses[1].id, semesterId: semesters[3].id, score10: 9.0, score4: 4.0, letterGrade: 'A', status: 'PASSED', createdBy: adminUser.id },
      { studentId: studentProfiles[7].id, courseId: courses[3].id, semesterId: semesters[2].id, score10: 6.0, score4: 2.0, letterGrade: 'C', status: 'PASSED', createdBy: chiHuyUsers[0].id },
      { studentId: studentProfiles[7].id, courseId: courses[5].id, semesterId: semesters[3].id, score10: 7.5, score4: 3.0, letterGrade: 'B', status: 'PASSED', createdBy: chiHuyUsers[0].id },
      { studentId: studentProfiles[8].id, courseId: courses[2].id, semesterId: semesters[0].id, score10: 5.5, score4: 2.0, letterGrade: 'C', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[8].id, courseId: courses[6].id, semesterId: semesters[0].id, score10: 8.0, score4: 3.5, letterGrade: 'B+', status: 'PASSED', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[9].id, courseId: courses[8].id, semesterId: semesters[0].id, score10: 2.5, score4: 0.0, letterGrade: 'F', status: 'FAILED', createdBy: chiHuyUsers[1].id },
    ];
    const grades = [];
    for (const g of gradesData) {
      const [grade] = await db.grade.findOrCreate({
        where: { studentId: g.studentId, courseId: g.courseId, semesterId: g.semesterId },
        defaults: g,
      });
      grades.push(grade);
    }
    console.log('Grades seeded.');

    // ==========================
    // 14. GRADE REQUESTS
    // ==========================
    const gradeRequestsData = [
      { studentId: studentProfiles[2].id, courseId: courses[1].id, semesterId: semesters[0].id, requestType: 'UPDATE', reason: 'Điểm thi cuối kỳ bị nhập sai, đề nghị cập nhật lại', proposedScore10: 5.5, status: 'PENDING', reviewerId: null, reviewNote: null, reviewedAt: null },
      { studentId: studentProfiles[4].id, courseId: courses[0].id, semesterId: semesters[2].id, requestType: 'UPDATE', reason: 'Bài thi bị chấm nhầm câu, xin phúc khảo', proposedScore10: 5.0, status: 'APPROVED', reviewerId: chiHuyUsers[0].id, reviewNote: 'Đồng ý cập nhật sau khi rà soát', reviewedAt: new Date('2024-02-15') },
      { studentId: studentProfiles[9].id, courseId: courses[8].id, semesterId: semesters[0].id, requestType: 'DELETE', reason: 'Học viên đã nghỉ học, xin xóa điểm', proposedScore10: null, status: 'REJECTED', reviewerId: chiHuyUsers[1].id, reviewNote: 'Không chấp nhận, điểm giữ nguyên', reviewedAt: new Date('2025-01-10') },
      { studentId: studentProfiles[0].id, courseId: courses[2].id, semesterId: semesters[3].id, requestType: 'ADD', reason: 'Học viên học lại, xin thêm điểm môn này', proposedScore10: 7.0, status: 'PENDING', reviewerId: null, reviewNote: null, reviewedAt: null },
      { studentId: studentProfiles[8].id, courseId: courses[2].id, semesterId: semesters[0].id, requestType: 'UPDATE', reason: 'Bài thi vắng mặt do điều động đột xuất, có giấy xác nhận', proposedScore10: 6.0, status: 'PENDING', reviewerId: null, reviewNote: null, reviewedAt: null },
    ];
    const gradeRequests = [];
    for (const gr of gradeRequestsData) {
      const [req] = await db.gradeRequest.findOrCreate({
        where: { studentId: gr.studentId, courseId: gr.courseId, semesterId: gr.semesterId, requestType: gr.requestType },
        defaults: gr,
      });
      gradeRequests.push(req);
    }
    console.log('GradeRequests seeded.');

    // ==========================
    // 15. GRADE REQUEST ATTACHMENTS
    // ==========================
    const attachmentData = [
      { gradeRequestId: gradeRequests[0].id, fileName: 'don_phuc_khao.pdf', fileUrl: '/uploads/grade_requests/don_phuc_khao_001.pdf', fileType: 'application/pdf' },
      { gradeRequestId: gradeRequests[0].id, fileName: 'bang_diem_goc.jpg', fileUrl: '/uploads/grade_requests/bang_diem_goc_001.jpg', fileType: 'image/jpeg' },
      { gradeRequestId: gradeRequests[1].id, fileName: 'don_xin_phuckhao.pdf', fileUrl: '/uploads/grade_requests/don_xin_phuckhao_002.pdf', fileType: 'application/pdf' },
      { gradeRequestId: gradeRequests[3].id, fileName: 'giay_xac_nhan_hoc_lai.pdf', fileUrl: '/uploads/grade_requests/giay_xac_nhan_hoc_lai_004.pdf', fileType: 'application/pdf' },
    ];
    for (const att of attachmentData) {
      await db.gradeRequestAttachment.findOrCreate({
        where: { gradeRequestId: att.gradeRequestId, fileName: att.fileName },
        defaults: att,
      });
    }
    console.log('GradeRequestAttachments seeded.');

    // ==========================
    // 16. ACHIEVEMENTS
    // ==========================
    const achievementsData = [
      { studentId: studentProfiles[0].id, title: 'Giải nhì Olympic Tin học Quốc gia', achievementType: 'REWARD', level: 'Quốc gia', issueDate: '2023-04-15', description: 'Đạt giải nhì kỳ thi Olympic Tin học toàn quốc', fileUrl: '/uploads/achievements/olympic_tinhoc_001.pdf', createdBy: adminUser.id },
      { studentId: studentProfiles[0].id, title: 'Đề tài nghiên cứu khoa học cấp trường', achievementType: 'SCIENTIFIC_TOPIC', level: 'Cấp trường', issueDate: '2024-05-20', description: 'Hệ thống quản lý điểm cho đơn vị quân sự', fileUrl: '/uploads/achievements/nckh_001.pdf', createdBy: adminUser.id },
      { studentId: studentProfiles[1].id, title: 'Huy chương vàng Hội thao Quân sự', achievementType: 'TRAINING', level: 'Cấp đơn vị', issueDate: '2024-03-10', description: 'Môn bơi lội 100m tự do nữ', fileUrl: '/uploads/achievements/hoithao_002.jpg', createdBy: chiHuyUsers[0].id },
      { studentId: studentProfiles[2].id, title: 'Giải ba Khoa học kỹ thuật cấp Bộ', achievementType: 'SCIENTIFIC_TOPIC', level: 'Cấp Bộ', issueDate: '2025-01-05', description: 'Ứng dụng AI trong nhận diện mục tiêu', fileUrl: '/uploads/achievements/khkt_003.pdf', createdBy: chiHuyUsers[1].id },
      { studentId: studentProfiles[6].id, title: 'Sinh viên 5 tốt cấp Trung ương', achievementType: 'REWARD', level: 'Trung ương', issueDate: '2024-06-20', description: 'Danh hiệu cao quý dành cho sinh viên xuất sắc toàn diện', fileUrl: '/uploads/achievements/sv5tot_007.pdf', createdBy: adminUser.id },
      { studentId: studentProfiles[7].id, title: 'Chứng nhận hoàn thành xuất sắc khóa huấn luyện', achievementType: 'TRAINING', level: 'Cấp trường', issueDate: '2024-08-01', description: 'Khóa huấn luyện quân sự năm 2024', fileUrl: '/uploads/achievements/huanluyen_008.jpg', createdBy: chiHuyUsers[0].id },
    ];
    for (const ach of achievementsData) {
      await db.achievement.findOrCreate({
        where: { studentId: ach.studentId, title: ach.title },
        defaults: ach,
      });
    }
    console.log('Achievements seeded.');

    // ==========================
    // 17. SCHEDULES
    // ==========================
    const schedulesData = [
      { classId: classes[0].id, studentId: null, courseId: courses[0].id, semesterId: semesters[2].id, dayOfWeek: 1, startTime: '07:00:00', endTime: '09:25:00', room: 'A101', scheduleType: 'CLASS' },
      { classId: classes[0].id, studentId: null, courseId: courses[1].id, semesterId: semesters[2].id, dayOfWeek: 2, startTime: '09:35:00', endTime: '12:00:00', room: 'A102', scheduleType: 'CLASS' },
      { classId: classes[1].id, studentId: null, courseId: courses[3].id, semesterId: semesters[3].id, dayOfWeek: 3, startTime: '13:30:00', endTime: '16:45:00', room: 'B201', scheduleType: 'CLASS' },
      { classId: classes[2].id, studentId: null, courseId: courses[0].id, semesterId: semesters[0].id, dayOfWeek: 1, startTime: '07:00:00', endTime: '09:25:00', room: 'A103', scheduleType: 'CLASS' },
      { classId: classes[2].id, studentId: null, courseId: courses[1].id, semesterId: semesters[0].id, dayOfWeek: 3, startTime: '09:35:00', endTime: '12:00:00', room: 'A104', scheduleType: 'CLASS' },
      { classId: classes[3].id, studentId: null, courseId: courses[8].id, semesterId: semesters[0].id, dayOfWeek: 2, startTime: '07:00:00', endTime: '09:25:00', room: 'C301', scheduleType: 'CLASS' },
      { classId: classes[3].id, studentId: null, courseId: courses[9].id, semesterId: semesters[0].id, dayOfWeek: 4, startTime: '09:35:00', endTime: '12:00:00', room: 'C302', scheduleType: 'CLASS' },
      { classId: classes[4].id, studentId: null, courseId: courses[0].id, semesterId: semesters[2].id, dayOfWeek: 5, startTime: '13:30:00', endTime: '16:45:00', room: 'A105', scheduleType: 'CLASS' },
      { classId: classes[5].id, studentId: null, courseId: courses[10].id, semesterId: semesters[0].id, dayOfWeek: 1, startTime: '07:00:00', endTime: '08:30:00', room: 'D401', scheduleType: 'CLASS' },
      { classId: classes[5].id, studentId: null, courseId: courses[12].id, semesterId: semesters[0].id, dayOfWeek: 2, startTime: '08:40:00', endTime: '11:50:00', room: 'Sân tập', scheduleType: 'CLASS' },
      { classId: null, studentId: studentProfiles[0].id, courseId: courses[7].id, semesterId: semesters[3].id, dayOfWeek: 6, startTime: '07:00:00', endTime: '09:25:00', room: 'Lab AI', scheduleType: 'PERSONAL' },
      { classId: null, studentId: studentProfiles[2].id, courseId: courses[6].id, semesterId: semesters[1].id, dayOfWeek: 6, startTime: '13:30:00', endTime: '16:45:00', room: 'Lab Web', scheduleType: 'PERSONAL' },
    ];
    for (const s of schedulesData) {
      const whereClause = s.classId
        ? { classId: s.classId, courseId: s.courseId, semesterId: s.semesterId, dayOfWeek: s.dayOfWeek }
        : { studentId: s.studentId, courseId: s.courseId, semesterId: s.semesterId, dayOfWeek: s.dayOfWeek };
      await db.schedule.findOrCreate({ where: whereClause, defaults: s });
    }
    console.log('Schedules seeded.');

    // ==========================
    // 18. MEAL SCHEDULES
    // ==========================
    const mealSchedulesData = [
      { studentId: studentProfiles[0].id, scheduleDate: '2024-10-01', session: 'MORNING', status: 'REGISTERED' },
      { studentId: studentProfiles[0].id, scheduleDate: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[0].id, scheduleDate: '2024-10-01', session: 'EVENING', status: 'CANCELLED' },
      { studentId: studentProfiles[1].id, scheduleDate: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[1].id, scheduleDate: '2024-10-02', session: 'MORNING', status: 'REGISTERED' },
      { studentId: studentProfiles[2].id, scheduleDate: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[2].id, scheduleDate: '2024-10-01', session: 'AFTERNOON', status: 'REGISTERED' },
      { studentId: studentProfiles[3].id, scheduleDate: '2024-10-02', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[4].id, scheduleDate: '2024-10-01', session: 'NOON', status: 'CANCELLED' },
      { studentId: studentProfiles[5].id, scheduleDate: '2025-02-15', session: 'MORNING', status: 'REGISTERED' },
      { studentId: studentProfiles[5].id, scheduleDate: '2025-02-15', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[6].id, scheduleDate: '2024-06-01', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[7].id, scheduleDate: '2024-10-03', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[8].id, scheduleDate: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { studentId: studentProfiles[8].id, scheduleDate: '2024-10-02', session: 'EVENING', status: 'REGISTERED' },
    ];
    for (const ms of mealSchedulesData) {
      await db.mealSchedule.findOrCreate({
        where: { studentId: ms.studentId, scheduleDate: ms.scheduleDate, session: ms.session },
        defaults: ms,
      });
    }
    console.log('MealSchedules seeded.');

    // ==========================
    // 19. TUITIONS
    // ==========================
    const tuitionsData = [
      { studentId: studentProfiles[0].id, semesterId: semesters[2].id, amount: 4500000, paidAmount: 4500000, status: 'PAID', dueDate: '2023-10-15', paidAt: new Date('2023-10-10'), note: 'Đã đóng đầy đủ học kỳ 1' },
      { studentId: studentProfiles[0].id, semesterId: semesters[3].id, amount: 4500000, paidAmount: 4500000, status: 'PAID', dueDate: '2024-03-15', paidAt: new Date('2024-03-05'), note: 'Đã đóng đầy đủ học kỳ 2' },
      { studentId: studentProfiles[1].id, semesterId: semesters[2].id, amount: 4800000, paidAmount: 4800000, status: 'PAID', dueDate: '2024-10-15', paidAt: new Date('2024-10-01'), note: 'Đã đóng đầy đủ' },
      { studentId: studentProfiles[1].id, semesterId: semesters[3].id, amount: 4800000, paidAmount: 2400000, status: 'PARTIAL', dueDate: '2025-03-15', paidAt: new Date('2025-02-20'), note: 'Đã đóng 1/2, còn nợ' },
      { studentId: studentProfiles[2].id, semesterId: semesters[0].id, amount: 5000000, paidAmount: 5000000, status: 'PAID', dueDate: '2024-10-15', paidAt: new Date('2024-09-28'), note: 'Đã đóng đầy đủ học kỳ 1' },
      { studentId: studentProfiles[2].id, semesterId: semesters[1].id, amount: 5000000, paidAmount: 0, status: 'UNPAID', dueDate: '2025-04-15', paidAt: null, note: 'Chưa đóng học phí' },
      { studentId: studentProfiles[3].id, semesterId: semesters[0].id, amount: 5200000, paidAmount: 5200000, status: 'PAID', dueDate: '2024-10-15', paidAt: new Date('2024-10-05'), note: 'Đã đóng đầy đủ' },
      { studentId: studentProfiles[4].id, semesterId: semesters[2].id, amount: 4800000, paidAmount: 0, status: 'UNPAID', dueDate: '2024-10-15', paidAt: null, note: 'Học viên tạm dừng, chưa đóng' },
      { studentId: studentProfiles[5].id, semesterId: semesters[0].id, amount: 5500000, paidAmount: 5500000, status: 'PAID', dueDate: '2025-10-15', paidAt: new Date('2025-09-20'), note: 'Đã đóng đầy đủ' },
      { studentId: studentProfiles[6].id, semesterId: semesters[2].id, amount: 4500000, paidAmount: 4500000, status: 'PAID', dueDate: '2023-10-15', paidAt: new Date('2023-10-05'), note: 'Đã tốt nghiệp, đóng đủ' },
      { studentId: studentProfiles[7].id, semesterId: semesters[2].id, amount: 4800000, paidAmount: 4800000, status: 'PAID', dueDate: '2024-10-15', paidAt: new Date('2024-09-25'), note: 'Đã đóng đầy đủ' },
      { studentId: studentProfiles[8].id, semesterId: semesters[0].id, amount: 5000000, paidAmount: 2500000, status: 'PARTIAL', dueDate: '2024-10-15', paidAt: new Date('2024-10-10'), note: 'Đã đóng 1/2' },
      { studentId: studentProfiles[9].id, semesterId: semesters[0].id, amount: 5200000, paidAmount: 0, status: 'UNPAID', dueDate: '2024-10-15', paidAt: null, note: 'Học viên đã nghỉ học' },
    ];
    for (const t of tuitionsData) {
      await db.tuition.findOrCreate({
        where: { studentId: t.studentId, semesterId: t.semesterId },
        defaults: t,
      });
    }
    console.log('Tuitions seeded.');

    // ==========================
    // 20. DUTY ROSTERS
    // ==========================
    const dutyRostersData = [
      { userId: chiHuyUsers[0].id, dutyDate: '2024-10-01', shift: 'MORNING', dutyType: 'COMMAND', note: 'Trực chỉ huy ca sáng', createdBy: adminUser.id },
      { userId: chiHuyUsers[0].id, dutyDate: '2024-10-01', shift: 'NIGHT', dutyType: 'COMMAND', note: 'Trực chỉ huy ca đêm', createdBy: adminUser.id },
      { userId: chiHuyUsers[1].id, dutyDate: '2024-10-02', shift: 'AFTERNOON', dutyType: 'COMMAND', note: 'Trực chỉ huy ca chiều', createdBy: adminUser.id },
      { userId: chiHuyUsers[1].id, dutyDate: '2024-10-03', shift: 'FULL', dutyType: 'SECURITY', note: 'Tuần tra an ninh cả ngày', createdBy: adminUser.id },
      { userId: adminUser.id, dutyDate: '2024-10-05', shift: 'MORNING', dutyType: 'OTHER', note: 'Kiểm tra công tác chuẩn bị', createdBy: adminUser.id },
      { userId: chiHuyUsers[0].id, dutyDate: '2024-10-07', shift: 'NIGHT', dutyType: 'COMMAND', note: 'Trực chỉ huy đêm thứ 2', createdBy: adminUser.id },
      { userId: chiHuyUsers[1].id, dutyDate: '2024-10-08', shift: 'MORNING', dutyType: 'SECURITY', note: 'Kiểm tra an ninh đầu tuần', createdBy: adminUser.id },
      { userId: chiHuyUsers[0].id, dutyDate: '2025-02-10', shift: 'AFTERNOON', dutyType: 'COMMAND', note: 'Chỉ huy buổi chiều đầu học kỳ 2', createdBy: adminUser.id },
      { userId: chiHuyUsers[1].id, dutyDate: '2025-02-11', shift: 'NIGHT', dutyType: 'COMMAND', note: 'Trực đêm học kỳ 2', createdBy: adminUser.id },
      { userId: adminUser.id, dutyDate: '2025-02-15', shift: 'FULL', dutyType: 'OTHER', note: 'Tổng kiểm tra đầu năm mới', createdBy: adminUser.id },
    ];
    for (const dr of dutyRostersData) {
      await db.dutyRoster.findOrCreate({
        where: { userId: dr.userId, dutyDate: dr.dutyDate, shift: dr.shift },
        defaults: dr,
      });
    }
    console.log('DutyRosters seeded.');

    console.log('\n✅ FULL SEED DATA CREATED SUCCESSFULLY');
    console.log('==============================');
    console.log('Tài khoản test:');
    console.log('  - Admin:    admin / admin123');
    console.log('  - Chỉ huy:  chihuy01 / chihuy123');
    console.log('  - Chỉ huy:  chihuy02 / chihuy123');
    console.log('  - Học viên: hv001 -> hv010 / hocvien123');
    console.log('==============================');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

fullSeed();
