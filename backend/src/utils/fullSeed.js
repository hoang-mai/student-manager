const db = require('../models');
const bcrypt = require('bcrypt');

async function fullSeed() {
  try {
    await db.sequelize.sync({ alter: true });
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
        where: { role_id: roleAdmin.id, permission_id: perm.id },
        defaults: { role_id: roleAdmin.id, permission_id: perm.id },
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
        where: { role_id: roleChiHuy.id, permission_id: perm.id },
        defaults: { role_id: roleChiHuy.id, permission_id: perm.id },
      });
    }
    // Học viên: chỉ xem
    const hocVienPerms = allPermissions.filter(p =>
      ['students_view','grades_view','schedules_view','courses_view','tuitions_view'].includes(p.name)
    );
    for (const perm of hocVienPerms) {
      await db.rolePermission.findOrCreate({
        where: { role_id: roleHocVien.id, permission_id: perm.id },
        defaults: { role_id: roleHocVien.id, permission_id: perm.id },
      });
    }
    console.log('Role-Permissions seeded.');

    // ==========================
    // 4. USERS
    // ==========================
    const usersData = [
      { username: 'admin', email: 'admin@qldt.local', password: await bcrypt.hash('admin123', 10), full_name: 'Nguyễn Văn Quản Trị', phone: '0900000001', role_id: roleAdmin.id, is_active: true },
      { username: 'chihuy01', email: 'ch1@qldt.local', password: await bcrypt.hash('chihuy123', 10), full_name: 'Trần Văn Chỉ Huy', phone: '0900000002', role_id: roleChiHuy.id, is_active: true },
      { username: 'chihuy02', email: 'ch2@qldt.local', password: await bcrypt.hash('chihuy123', 10), full_name: 'Lê Thị Chỉ Huy', phone: '0900000003', role_id: roleChiHuy.id, is_active: true },
      { username: 'hv001', email: 'hv001@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Phạm Văn An', phone: '0900000011', role_id: roleHocVien.id, is_active: true },
      { username: 'hv002', email: 'hv002@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Nguyễn Thị Bình', phone: '0900000012', role_id: roleHocVien.id, is_active: true },
      { username: 'hv003', email: 'hv003@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Trần Văn Cường', phone: '0900000013', role_id: roleHocVien.id, is_active: true },
      { username: 'hv004', email: 'hv004@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Lê Thị Dung', phone: '0900000014', role_id: roleHocVien.id, is_active: true },
      { username: 'hv005', email: 'hv005@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Hoàng Văn Em', phone: '0900000015', role_id: roleHocVien.id, is_active: true },
      { username: 'hv006', email: 'hv006@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Vũ Thị Phương', phone: '0900000016', role_id: roleHocVien.id, is_active: true },
      { username: 'hv007', email: 'hv007@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Đặng Văn Giang', phone: '0900000017', role_id: roleHocVien.id, is_active: true },
      { username: 'hv008', email: 'hv008@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Bùi Thị Hương', phone: '0900000018', role_id: roleHocVien.id, is_active: true },
      { username: 'hv009', email: 'hv009@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Ngô Văn Ích', phone: '0900000019', role_id: roleHocVien.id, is_active: true },
      { username: 'hv010', email: 'hv010@qldt.local', password: await bcrypt.hash('hocvien123', 10), full_name: 'Dương Thị Kim', phone: '0900000020', role_id: roleHocVien.id, is_active: true },
    ];
    const users = [];
    for (const u of usersData) {
      const [user] = await db.user.findOrCreate({ where: { username: u.username }, defaults: u });
      users.push(user);
    }
    const adminUser = users.find(u => u.username === 'admin');
    const chiHuyUsers = users.filter(u => u.role_id === roleChiHuy.id);
    const hocVienUsers = users.filter(u => u.role_id === roleHocVien.id);
    console.log('Users seeded.');

    // ==========================
    // 5. TRAINING UNITS
    // ==========================
    const trainingUnitsData = [
      { code: 'DH1', name: 'Đại đội 1', address: 'Khu A - Doanh trại Quân sự', phone: '0241111111', commander_id: chiHuyUsers[0].id },
      { code: 'DH2', name: 'Đại đội 2', address: 'Khu B - Doanh trại Quân sự', phone: '0242222222', commander_id: chiHuyUsers[1].id },
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
      { code: 'CNTT', name: 'Công nghệ thông tin', university_id: universities[0].id },
      { code: 'KTPM', name: 'Kỹ thuật phần mềm', university_id: universities[0].id },
      { code: 'HTTT', name: 'Hệ thống thông tin', university_id: universities[0].id },
      { code: 'KTQT', name: 'Kinh tế quốc tế', university_id: universities[1].id },
      { code: 'TMDT', name: 'Thương mại điện tử', university_id: universities[1].id },
      { code: 'TA', name: 'Ngôn ngữ Anh', university_id: universities[2].id },
      { code: 'TRUNG', name: 'Ngôn ngữ Trung', university_id: universities[2].id },
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
      { name: '2022-2023', start_year: 2022, end_year: 2023 },
      { name: '2023-2024', start_year: 2023, end_year: 2024 },
      { name: '2024-2025', start_year: 2024, end_year: 2025 },
      { name: '2025-2026', start_year: 2025, end_year: 2026 },
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
      { code: 'CNTT-K60', name: 'Công nghệ thông tin K60', major_id: majors[0].id, academic_year_id: academicYears[0].id, training_unit_id: trainingUnits[0].id, commander_id: chiHuyUsers[0].id },
      { code: 'KTPM-K61', name: 'Kỹ thuật phần mềm K61', major_id: majors[1].id, academic_year_id: academicYears[1].id, training_unit_id: trainingUnits[0].id, commander_id: chiHuyUsers[0].id },
      { code: 'HTTT-K62', name: 'Hệ thống thông tin K62', major_id: majors[2].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, commander_id: chiHuyUsers[1].id },
      { code: 'KTQT-K62', name: 'Kinh tế quốc tế K62', major_id: majors[3].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, commander_id: chiHuyUsers[1].id },
      { code: 'TMDT-K61', name: 'Thương mại điện tử K61', major_id: majors[4].id, academic_year_id: academicYears[1].id, training_unit_id: trainingUnits[0].id, commander_id: chiHuyUsers[0].id },
      { code: 'TA-K63', name: 'Ngôn ngữ Anh K63', major_id: majors[5].id, academic_year_id: academicYears[3].id, training_unit_id: trainingUnits[1].id, commander_id: chiHuyUsers[1].id },
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
      { name: 'Học kỳ 1 - 2024-2025', academic_year_id: academicYears[2].id, start_date: '2024-09-02', end_date: '2025-01-19', registration_start: '2024-08-15', registration_end: '2024-09-01', exam_start: '2025-01-06', exam_end: '2025-01-19', grade_entry_deadline: '2025-01-26', is_active: true },
      { name: 'Học kỳ 2 - 2024-2025', academic_year_id: academicYears[2].id, start_date: '2025-02-10', end_date: '2025-06-15', registration_start: '2025-01-25', registration_end: '2025-02-09', exam_start: '2025-06-02', exam_end: '2025-06-15', grade_entry_deadline: '2025-06-22', is_active: true },
      { name: 'Học kỳ 1 - 2023-2024', academic_year_id: academicYears[1].id, start_date: '2023-09-04', end_date: '2024-01-21', registration_start: '2023-08-20', registration_end: '2023-09-03', exam_start: '2024-01-08', exam_end: '2024-01-21', grade_entry_deadline: '2024-01-28', is_active: false },
      { name: 'Học kỳ 2 - 2023-2024', academic_year_id: academicYears[1].id, start_date: '2024-02-12', end_date: '2024-06-16', registration_start: '2024-01-27', registration_end: '2024-02-11', exam_start: '2024-06-03', exam_end: '2024-06-16', grade_entry_deadline: '2024-06-23', is_active: false },
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
      { user_id: hocVienUsers[0].id, student_code: 'HV001', class_id: classes[0].id, university_id: universities[0].id, major_id: majors[0].id, academic_year_id: academicYears[0].id, training_unit_id: trainingUnits[0].id, gender: 'MALE', date_of_birth: '2002-03-15', id_card_number: '001092001234', military_rank: 'Hạ sĩ', unit: 'Đại đội 1', enrollment_date: '2022-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[1].id, student_code: 'HV002', class_id: classes[1].id, university_id: universities[0].id, major_id: majors[1].id, academic_year_id: academicYears[1].id, training_unit_id: trainingUnits[0].id, gender: 'FEMALE', date_of_birth: '2003-07-22', id_card_number: '001092005678', military_rank: 'Hạ sĩ', unit: 'Đại đội 1', enrollment_date: '2023-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[2].id, student_code: 'HV003', class_id: classes[2].id, university_id: universities[0].id, major_id: majors[2].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, gender: 'MALE', date_of_birth: '2004-01-10', id_card_number: '001092009012', military_rank: 'Binh nhất', unit: 'Đại đội 2', enrollment_date: '2024-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[3].id, student_code: 'HV004', class_id: classes[3].id, university_id: universities[1].id, major_id: majors[3].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, gender: 'FEMALE', date_of_birth: '2004-05-18', id_card_number: '001092013456', military_rank: 'Binh nhất', unit: 'Đại đội 2', enrollment_date: '2024-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[4].id, student_code: 'HV005', class_id: classes[4].id, university_id: universities[1].id, major_id: majors[4].id, academic_year_id: academicYears[1].id, training_unit_id: trainingUnits[0].id, gender: 'MALE', date_of_birth: '2003-11-30', id_card_number: '001092017890', military_rank: 'Hạ sĩ', unit: 'Đại đội 1', enrollment_date: '2023-09-01', status: 'SUSPENDED' },
      { user_id: hocVienUsers[5].id, student_code: 'HV006', class_id: classes[5].id, university_id: universities[2].id, major_id: majors[5].id, academic_year_id: academicYears[3].id, training_unit_id: trainingUnits[1].id, gender: 'FEMALE', date_of_birth: '2005-02-14', id_card_number: '001092021234', military_rank: 'Binh nhì', unit: 'Đại đội 2', enrollment_date: '2025-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[6].id, student_code: 'HV007', class_id: classes[0].id, university_id: universities[0].id, major_id: majors[0].id, academic_year_id: academicYears[0].id, training_unit_id: trainingUnits[0].id, gender: 'MALE', date_of_birth: '2002-08-05', id_card_number: '001092025678', military_rank: 'Trung sĩ', unit: 'Đại đội 1', enrollment_date: '2022-09-01', status: 'GRADUATED' },
      { user_id: hocVienUsers[7].id, student_code: 'HV008', class_id: classes[1].id, university_id: universities[0].id, major_id: majors[1].id, academic_year_id: academicYears[1].id, training_unit_id: trainingUnits[0].id, gender: 'FEMALE', date_of_birth: '2003-04-20', id_card_number: '001092029012', military_rank: 'Hạ sĩ', unit: 'Đại đội 1', enrollment_date: '2023-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[8].id, student_code: 'HV009', class_id: classes[2].id, university_id: universities[0].id, major_id: majors[2].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, gender: 'OTHER', date_of_birth: '2004-09-09', id_card_number: '001092033456', military_rank: 'Binh nhì', unit: 'Đại đội 2', enrollment_date: '2024-09-01', status: 'STUDYING' },
      { user_id: hocVienUsers[9].id, student_code: 'HV010', class_id: classes[3].id, university_id: universities[1].id, major_id: majors[3].id, academic_year_id: academicYears[2].id, training_unit_id: trainingUnits[1].id, gender: 'FEMALE', date_of_birth: '2004-12-25', id_card_number: '001092037890', military_rank: 'Binh nhì', unit: 'Đại đội 2', enrollment_date: '2024-09-01', status: 'DROPPED' },
    ];
    const studentProfiles = [];
    for (const sp of studentProfilesData) {
      const [profile] = await db.studentProfile.findOrCreate({ where: { user_id: sp.user_id }, defaults: sp });
      studentProfiles.push(profile);
    }
    console.log('StudentProfiles seeded.');

    // ==========================
    // 13. GRADES
    // ==========================
    const gradesData = [
      { student_id: studentProfiles[0].id, course_id: courses[0].id, semester_id: semesters[2].id, score_10: 8.5, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[0].id, course_id: courses[1].id, semester_id: semesters[2].id, score_10: 7.0, score_4: 2.5, letter_grade: 'C+', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[0].id, course_id: courses[2].id, semester_id: semesters[3].id, score_10: 9.0, score_4: 4.0, letter_grade: 'A', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[1].id, course_id: courses[0].id, semester_id: semesters[2].id, score_10: 6.5, score_4: 2.5, letter_grade: 'C+', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[1].id, course_id: courses[3].id, semester_id: semesters[3].id, score_10: 8.0, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: chiHuyUsers[0].id },
      { student_id: studentProfiles[2].id, course_id: courses[0].id, semester_id: semesters[0].id, score_10: 5.0, score_4: 2.0, letter_grade: 'C', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[2].id, course_id: courses[1].id, semester_id: semesters[0].id, score_10: 3.5, score_4: 0.0, letter_grade: 'F', status: 'FAILED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[2].id, course_id: courses[4].id, semester_id: semesters[0].id, score_10: 7.5, score_4: 3.0, letter_grade: 'B', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[3].id, course_id: courses[8].id, semester_id: semesters[0].id, score_10: 8.5, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[3].id, course_id: courses[9].id, semester_id: semesters[0].id, score_10: 9.5, score_4: 4.0, letter_grade: 'A+', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[4].id, course_id: courses[0].id, semester_id: semesters[2].id, score_10: 4.0, score_4: 0.0, letter_grade: 'F', status: 'FAILED', created_by: chiHuyUsers[0].id },
      { student_id: studentProfiles[5].id, course_id: courses[10].id, semester_id: semesters[0].id, score_10: 7.0, score_4: 2.5, letter_grade: 'C+', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[5].id, course_id: courses[12].id, semester_id: semesters[0].id, score_10: 8.0, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[6].id, course_id: courses[0].id, semester_id: semesters[2].id, score_10: 9.5, score_4: 4.0, letter_grade: 'A+', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[6].id, course_id: courses[1].id, semester_id: semesters[3].id, score_10: 9.0, score_4: 4.0, letter_grade: 'A', status: 'PASSED', created_by: adminUser.id },
      { student_id: studentProfiles[7].id, course_id: courses[3].id, semester_id: semesters[2].id, score_10: 6.0, score_4: 2.0, letter_grade: 'C', status: 'PASSED', created_by: chiHuyUsers[0].id },
      { student_id: studentProfiles[7].id, course_id: courses[5].id, semester_id: semesters[3].id, score_10: 7.5, score_4: 3.0, letter_grade: 'B', status: 'PASSED', created_by: chiHuyUsers[0].id },
      { student_id: studentProfiles[8].id, course_id: courses[2].id, semester_id: semesters[0].id, score_10: 5.5, score_4: 2.0, letter_grade: 'C', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[8].id, course_id: courses[6].id, semester_id: semesters[0].id, score_10: 8.0, score_4: 3.5, letter_grade: 'B+', status: 'PASSED', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[9].id, course_id: courses[8].id, semester_id: semesters[0].id, score_10: 2.5, score_4: 0.0, letter_grade: 'F', status: 'FAILED', created_by: chiHuyUsers[1].id },
    ];
    const grades = [];
    for (const g of gradesData) {
      const [grade] = await db.grade.findOrCreate({
        where: { student_id: g.student_id, course_id: g.course_id, semester_id: g.semester_id },
        defaults: g,
      });
      grades.push(grade);
    }
    console.log('Grades seeded.');

    // ==========================
    // 14. GRADE REQUESTS
    // ==========================
    const gradeRequestsData = [
      { student_id: studentProfiles[2].id, course_id: courses[1].id, semester_id: semesters[0].id, request_type: 'UPDATE', reason: 'Điểm thi cuối kỳ bị nhập sai, đề nghị cập nhật lại', proposed_score_10: 5.5, status: 'PENDING', reviewer_id: null, review_note: null, reviewed_at: null },
      { student_id: studentProfiles[4].id, course_id: courses[0].id, semester_id: semesters[2].id, request_type: 'UPDATE', reason: 'Bài thi bị chấm nhầm câu, xin phúc khảo', proposed_score_10: 5.0, status: 'APPROVED', reviewer_id: chiHuyUsers[0].id, review_note: 'Đồng ý cập nhật sau khi rà soát', reviewed_at: new Date('2024-02-15') },
      { student_id: studentProfiles[9].id, course_id: courses[8].id, semester_id: semesters[0].id, request_type: 'DELETE', reason: 'Học viên đã nghỉ học, xin xóa điểm', proposed_score_10: null, status: 'REJECTED', reviewer_id: chiHuyUsers[1].id, review_note: 'Không chấp nhận, điểm giữ nguyên', reviewed_at: new Date('2025-01-10') },
      { student_id: studentProfiles[0].id, course_id: courses[2].id, semester_id: semesters[3].id, request_type: 'ADD', reason: 'Học viên học lại, xin thêm điểm môn này', proposed_score_10: 7.0, status: 'PENDING', reviewer_id: null, review_note: null, reviewed_at: null },
      { student_id: studentProfiles[8].id, course_id: courses[2].id, semester_id: semesters[0].id, request_type: 'UPDATE', reason: 'Bài thi vắng mặt do điều động đột xuất, có giấy xác nhận', proposed_score_10: 6.0, status: 'PENDING', reviewer_id: null, review_note: null, reviewed_at: null },
    ];
    const gradeRequests = [];
    for (const gr of gradeRequestsData) {
      const [req] = await db.gradeRequest.findOrCreate({
        where: { student_id: gr.student_id, course_id: gr.course_id, semester_id: gr.semester_id, request_type: gr.request_type },
        defaults: gr,
      });
      gradeRequests.push(req);
    }
    console.log('GradeRequests seeded.');

    // ==========================
    // 15. GRADE REQUEST ATTACHMENTS
    // ==========================
    const attachmentData = [
      { grade_request_id: gradeRequests[0].id, file_name: 'don_phuc_khao.pdf', file_url: '/uploads/grade_requests/don_phuc_khao_001.pdf', file_type: 'application/pdf' },
      { grade_request_id: gradeRequests[0].id, file_name: 'bang_diem_goc.jpg', file_url: '/uploads/grade_requests/bang_diem_goc_001.jpg', file_type: 'image/jpeg' },
      { grade_request_id: gradeRequests[1].id, file_name: 'don_xin_phuckhao.pdf', file_url: '/uploads/grade_requests/don_xin_phuckhao_002.pdf', file_type: 'application/pdf' },
      { grade_request_id: gradeRequests[3].id, file_name: 'giay_xac_nhan_hoc_lai.pdf', file_url: '/uploads/grade_requests/giay_xac_nhan_hoc_lai_004.pdf', file_type: 'application/pdf' },
    ];
    for (const att of attachmentData) {
      await db.gradeRequestAttachment.findOrCreate({
        where: { grade_request_id: att.grade_request_id, file_name: att.file_name },
        defaults: att,
      });
    }
    console.log('GradeRequestAttachments seeded.');

    // ==========================
    // 16. ACHIEVEMENTS
    // ==========================
    const achievementsData = [
      { student_id: studentProfiles[0].id, title: 'Giải nhì Olympic Tin học Quốc gia', achievement_type: 'REWARD', level: 'Quốc gia', issue_date: '2023-04-15', description: 'Đạt giải nhì kỳ thi Olympic Tin học toàn quốc', file_url: '/uploads/achievements/olympic_tinhoc_001.pdf', created_by: adminUser.id },
      { student_id: studentProfiles[0].id, title: 'Đề tài nghiên cứu khoa học cấp trường', achievement_type: 'SCIENTIFIC_TOPIC', level: 'Cấp trường', issue_date: '2024-05-20', description: 'Hệ thống quản lý điểm cho đơn vị quân sự', file_url: '/uploads/achievements/nckh_001.pdf', created_by: adminUser.id },
      { student_id: studentProfiles[1].id, title: 'Huy chương vàng Hội thao Quân sự', achievement_type: 'TRAINING', level: 'Cấp đơn vị', issue_date: '2024-03-10', description: 'Môn bơi lội 100m tự do nữ', file_url: '/uploads/achievements/hoithao_002.jpg', created_by: chiHuyUsers[0].id },
      { student_id: studentProfiles[2].id, title: 'Giải ba Khoa học kỹ thuật cấp Bộ', achievement_type: 'SCIENTIFIC_TOPIC', level: 'Cấp Bộ', issue_date: '2025-01-05', description: 'Ứng dụng AI trong nhận diện mục tiêu', file_url: '/uploads/achievements/khkt_003.pdf', created_by: chiHuyUsers[1].id },
      { student_id: studentProfiles[6].id, title: 'Sinh viên 5 tốt cấp Trung ương', achievement_type: 'REWARD', level: 'Trung ương', issue_date: '2024-06-20', description: 'Danh hiệu cao quý dành cho sinh viên xuất sắc toàn diện', file_url: '/uploads/achievements/sv5tot_007.pdf', created_by: adminUser.id },
      { student_id: studentProfiles[7].id, title: 'Chứng nhận hoàn thành xuất sắc khóa huấn luyện', achievement_type: 'TRAINING', level: 'Cấp trường', issue_date: '2024-08-01', description: 'Khóa huấn luyện quân sự năm 2024', file_url: '/uploads/achievements/huanluyen_008.jpg', created_by: chiHuyUsers[0].id },
    ];
    for (const ach of achievementsData) {
      await db.achievement.findOrCreate({
        where: { student_id: ach.student_id, title: ach.title },
        defaults: ach,
      });
    }
    console.log('Achievements seeded.');

    // ==========================
    // 17. SCHEDULES
    // ==========================
    const schedulesData = [
      { class_id: classes[0].id, student_id: null, course_id: courses[0].id, semester_id: semesters[2].id, day_of_week: 1, start_time: '07:00:00', end_time: '09:25:00', room: 'A101', schedule_type: 'CLASS' },
      { class_id: classes[0].id, student_id: null, course_id: courses[1].id, semester_id: semesters[2].id, day_of_week: 2, start_time: '09:35:00', end_time: '12:00:00', room: 'A102', schedule_type: 'CLASS' },
      { class_id: classes[1].id, student_id: null, course_id: courses[3].id, semester_id: semesters[3].id, day_of_week: 3, start_time: '13:30:00', end_time: '16:45:00', room: 'B201', schedule_type: 'CLASS' },
      { class_id: classes[2].id, student_id: null, course_id: courses[0].id, semester_id: semesters[0].id, day_of_week: 1, start_time: '07:00:00', end_time: '09:25:00', room: 'A103', schedule_type: 'CLASS' },
      { class_id: classes[2].id, student_id: null, course_id: courses[1].id, semester_id: semesters[0].id, day_of_week: 3, start_time: '09:35:00', end_time: '12:00:00', room: 'A104', schedule_type: 'CLASS' },
      { class_id: classes[3].id, student_id: null, course_id: courses[8].id, semester_id: semesters[0].id, day_of_week: 2, start_time: '07:00:00', end_time: '09:25:00', room: 'C301', schedule_type: 'CLASS' },
      { class_id: classes[3].id, student_id: null, course_id: courses[9].id, semester_id: semesters[0].id, day_of_week: 4, start_time: '09:35:00', end_time: '12:00:00', room: 'C302', schedule_type: 'CLASS' },
      { class_id: classes[4].id, student_id: null, course_id: courses[0].id, semester_id: semesters[2].id, day_of_week: 5, start_time: '13:30:00', end_time: '16:45:00', room: 'A105', schedule_type: 'CLASS' },
      { class_id: classes[5].id, student_id: null, course_id: courses[10].id, semester_id: semesters[0].id, day_of_week: 1, start_time: '07:00:00', end_time: '08:30:00', room: 'D401', schedule_type: 'CLASS' },
      { class_id: classes[5].id, student_id: null, course_id: courses[12].id, semester_id: semesters[0].id, day_of_week: 2, start_time: '08:40:00', end_time: '11:50:00', room: 'Sân tập', schedule_type: 'CLASS' },
      { class_id: null, student_id: studentProfiles[0].id, course_id: courses[7].id, semester_id: semesters[3].id, day_of_week: 6, start_time: '07:00:00', end_time: '09:25:00', room: 'Lab AI', schedule_type: 'PERSONAL' },
      { class_id: null, student_id: studentProfiles[2].id, course_id: courses[6].id, semester_id: semesters[1].id, day_of_week: 6, start_time: '13:30:00', end_time: '16:45:00', room: 'Lab Web', schedule_type: 'PERSONAL' },
    ];
    for (const s of schedulesData) {
      const whereClause = s.class_id
        ? { class_id: s.class_id, course_id: s.course_id, semester_id: s.semester_id, day_of_week: s.day_of_week }
        : { student_id: s.student_id, course_id: s.course_id, semester_id: s.semester_id, day_of_week: s.day_of_week };
      await db.schedule.findOrCreate({ where: whereClause, defaults: s });
    }
    console.log('Schedules seeded.');

    // ==========================
    // 18. MEAL SCHEDULES
    // ==========================
    const mealSchedulesData = [
      { student_id: studentProfiles[0].id, schedule_date: '2024-10-01', session: 'MORNING', status: 'REGISTERED' },
      { student_id: studentProfiles[0].id, schedule_date: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[0].id, schedule_date: '2024-10-01', session: 'EVENING', status: 'CANCELLED' },
      { student_id: studentProfiles[1].id, schedule_date: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[1].id, schedule_date: '2024-10-02', session: 'MORNING', status: 'REGISTERED' },
      { student_id: studentProfiles[2].id, schedule_date: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[2].id, schedule_date: '2024-10-01', session: 'AFTERNOON', status: 'REGISTERED' },
      { student_id: studentProfiles[3].id, schedule_date: '2024-10-02', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[4].id, schedule_date: '2024-10-01', session: 'NOON', status: 'CANCELLED' },
      { student_id: studentProfiles[5].id, schedule_date: '2025-02-15', session: 'MORNING', status: 'REGISTERED' },
      { student_id: studentProfiles[5].id, schedule_date: '2025-02-15', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[6].id, schedule_date: '2024-06-01', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[7].id, schedule_date: '2024-10-03', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[8].id, schedule_date: '2024-10-01', session: 'NOON', status: 'REGISTERED' },
      { student_id: studentProfiles[8].id, schedule_date: '2024-10-02', session: 'EVENING', status: 'REGISTERED' },
    ];
    for (const ms of mealSchedulesData) {
      await db.mealSchedule.findOrCreate({
        where: { student_id: ms.student_id, schedule_date: ms.schedule_date, session: ms.session },
        defaults: ms,
      });
    }
    console.log('MealSchedules seeded.');

    // ==========================
    // 19. TUITIONS
    // ==========================
    const tuitionsData = [
      { student_id: studentProfiles[0].id, semester_id: semesters[2].id, amount: 4500000, paid_amount: 4500000, status: 'PAID', due_date: '2023-10-15', paid_at: new Date('2023-10-10'), note: 'Đã đóng đầy đủ học kỳ 1' },
      { student_id: studentProfiles[0].id, semester_id: semesters[3].id, amount: 4500000, paid_amount: 4500000, status: 'PAID', due_date: '2024-03-15', paid_at: new Date('2024-03-05'), note: 'Đã đóng đầy đủ học kỳ 2' },
      { student_id: studentProfiles[1].id, semester_id: semesters[2].id, amount: 4800000, paid_amount: 4800000, status: 'PAID', due_date: '2024-10-15', paid_at: new Date('2024-10-01'), note: 'Đã đóng đầy đủ' },
      { student_id: studentProfiles[1].id, semester_id: semesters[3].id, amount: 4800000, paid_amount: 2400000, status: 'PARTIAL', due_date: '2025-03-15', paid_at: new Date('2025-02-20'), note: 'Đã đóng 1/2, còn nợ' },
      { student_id: studentProfiles[2].id, semester_id: semesters[0].id, amount: 5000000, paid_amount: 5000000, status: 'PAID', due_date: '2024-10-15', paid_at: new Date('2024-09-28'), note: 'Đã đóng đầy đủ học kỳ 1' },
      { student_id: studentProfiles[2].id, semester_id: semesters[1].id, amount: 5000000, paid_amount: 0, status: 'UNPAID', due_date: '2025-04-15', paid_at: null, note: 'Chưa đóng học phí' },
      { student_id: studentProfiles[3].id, semester_id: semesters[0].id, amount: 5200000, paid_amount: 5200000, status: 'PAID', due_date: '2024-10-15', paid_at: new Date('2024-10-05'), note: 'Đã đóng đầy đủ' },
      { student_id: studentProfiles[4].id, semester_id: semesters[2].id, amount: 4800000, paid_amount: 0, status: 'UNPAID', due_date: '2024-10-15', paid_at: null, note: 'Học viên tạm dừng, chưa đóng' },
      { student_id: studentProfiles[5].id, semester_id: semesters[0].id, amount: 5500000, paid_amount: 5500000, status: 'PAID', due_date: '2025-10-15', paid_at: new Date('2025-09-20'), note: 'Đã đóng đầy đủ' },
      { student_id: studentProfiles[6].id, semester_id: semesters[2].id, amount: 4500000, paid_amount: 4500000, status: 'PAID', due_date: '2023-10-15', paid_at: new Date('2023-10-05'), note: 'Đã tốt nghiệp, đóng đủ' },
      { student_id: studentProfiles[7].id, semester_id: semesters[2].id, amount: 4800000, paid_amount: 4800000, status: 'PAID', due_date: '2024-10-15', paid_at: new Date('2024-09-25'), note: 'Đã đóng đầy đủ' },
      { student_id: studentProfiles[8].id, semester_id: semesters[0].id, amount: 5000000, paid_amount: 2500000, status: 'PARTIAL', due_date: '2024-10-15', paid_at: new Date('2024-10-10'), note: 'Đã đóng 1/2' },
      { student_id: studentProfiles[9].id, semester_id: semesters[0].id, amount: 5200000, paid_amount: 0, status: 'UNPAID', due_date: '2024-10-15', paid_at: null, note: 'Học viên đã nghỉ học' },
    ];
    for (const t of tuitionsData) {
      await db.tuition.findOrCreate({
        where: { student_id: t.student_id, semester_id: t.semester_id },
        defaults: t,
      });
    }
    console.log('Tuitions seeded.');

    // ==========================
    // 20. DUTY ROSTERS
    // ==========================
    const dutyRostersData = [
      { user_id: chiHuyUsers[0].id, duty_date: '2024-10-01', shift: 'MORNING', duty_type: 'COMMAND', note: 'Trực chỉ huy ca sáng', created_by: adminUser.id },
      { user_id: chiHuyUsers[0].id, duty_date: '2024-10-01', shift: 'NIGHT', duty_type: 'COMMAND', note: 'Trực chỉ huy ca đêm', created_by: adminUser.id },
      { user_id: chiHuyUsers[1].id, duty_date: '2024-10-02', shift: 'AFTERNOON', duty_type: 'COMMAND', note: 'Trực chỉ huy ca chiều', created_by: adminUser.id },
      { user_id: chiHuyUsers[1].id, duty_date: '2024-10-03', shift: 'FULL', duty_type: 'SECURITY', note: 'Tuần tra an ninh cả ngày', created_by: adminUser.id },
      { user_id: adminUser.id, duty_date: '2024-10-05', shift: 'MORNING', duty_type: 'OTHER', note: 'Kiểm tra công tác chuẩn bị', created_by: adminUser.id },
      { user_id: chiHuyUsers[0].id, duty_date: '2024-10-07', shift: 'NIGHT', duty_type: 'COMMAND', note: 'Trực chỉ huy đêm thứ 2', created_by: adminUser.id },
      { user_id: chiHuyUsers[1].id, duty_date: '2024-10-08', shift: 'MORNING', duty_type: 'SECURITY', note: 'Kiểm tra an ninh đầu tuần', created_by: adminUser.id },
      { user_id: chiHuyUsers[0].id, duty_date: '2025-02-10', shift: 'AFTERNOON', duty_type: 'COMMAND', note: 'Chỉ huy buổi chiều đầu học kỳ 2', created_by: adminUser.id },
      { user_id: chiHuyUsers[1].id, duty_date: '2025-02-11', shift: 'NIGHT', duty_type: 'COMMAND', note: 'Trực đêm học kỳ 2', created_by: adminUser.id },
      { user_id: adminUser.id, duty_date: '2025-02-15', shift: 'FULL', duty_type: 'OTHER', note: 'Tổng kiểm tra đầu năm mới', created_by: adminUser.id },
    ];
    for (const dr of dutyRostersData) {
      await db.dutyRoster.findOrCreate({
        where: { user_id: dr.user_id, duty_date: dr.duty_date, shift: dr.shift },
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
