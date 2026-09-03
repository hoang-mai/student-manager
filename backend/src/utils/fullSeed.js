require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcrypt');

async function fullSeed() {
  try {
    console.log('Starting full seed process...');
    await db.sequelize.sync({ force: true });
    console.log('Database synced (force).');

    const assertSeed = (condition, message) => {
      if (!condition) throw new Error(`Seed validation failed: ${message}`);
    };

    // ==========================
    // 1. USERS + PROFILES
    // ==========================
    // Admin
    const admin = await db.user.create({
      username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'ADMIN', isAdmin: true,
    });

    // Commanders (create user + profile)
    const cmd1Profile = await db.profile.create({
      code: 'CH001', fullName: 'Trần Văn Chỉ Huy', gender: 'MALE', birthday: new Date('1985-06-15'),
      hometown: 'Nam Định', placeOfBirth: 'Hà Nội', ethnicity: 'Kinh', religion: 'Không',
      currentAddress: 'Số 1 Lý Thường Kiệt, Hà Nội', email: 'chihuy01@qldt.local',
      phoneNumber: '0900000001', cccd: '001085000001',
      rank: 'Đại úy', unit: 'Đại đội 1', positionGovernment: 'Đại đội trưởng', positionParty: 'Bí thư chi bộ',
      startWork: 2008,
    });
    const chiHuy1 = await db.user.create({
      username: 'chihuy01', password: await bcrypt.hash('chihuy123', 10), role: 'COMMANDER',
      profileId: cmd1Profile.id,
    });

    const cmd2Profile = await db.profile.create({
      code: 'CH002', fullName: 'Lê Thị Chỉ Huy', gender: 'FEMALE', birthday: new Date('1988-03-22'),
      hometown: 'Hải Dương', placeOfBirth: 'Hải Phòng', ethnicity: 'Kinh', religion: 'Không',
      currentAddress: 'Số 5 Trần Phú, Hà Nội', email: 'chihuy02@qldt.local',
      phoneNumber: '0900000002', cccd: '001088000002',
      rank: 'Thượng úy', unit: 'Đại đội 2', positionGovernment: 'Đại đội phó', positionParty: 'Phó bí thư chi bộ',
      startWork: 2010,
    });
    const chiHuy2 = await db.user.create({
      username: 'chihuy02', password: await bcrypt.hash('chihuy123', 10), role: 'COMMANDER',
      profileId: cmd2Profile.id,
    });

    console.log('Admin + 2 Commanders seeded.');

    // ==========================
    // 2. UNIVERSITIES
    // ==========================
    const uniData = [
      { universityCode: 'NEU', universityName: 'Đại học Kinh tế Quốc dân', totalStudents: 12000, status: 'ACTIVE' },
      { universityCode: 'FTU', universityName: 'Đại học Ngoại thương', totalStudents: 9000, status: 'ACTIVE' },
      { universityCode: 'HUST', universityName: 'Đại học Bách khoa Hà Nội', totalStudents: 15000, status: 'ACTIVE' },
    ];
    const universities = [];
    for (const u of uniData) universities.push(await db.university.create(u));

    // 4. ORGANIZATIONS
    const orgs = [];
    for (const o of orgData) orgs.push(await db.organization.create(o));

    // ==========================
    // 4. EDUCATION LEVELS
    // ==========================
    const eduData = [
      { levelName: 'Đại học', organizationId: orgs[0].id },
      { levelName: 'Thạc sĩ', organizationId: orgs[0].id },
      { levelName: 'Tiến sĩ', organizationId: orgs[0].id },
      { levelName: 'Đại học', organizationId: orgs[1].id },
      { levelName: 'Thạc sĩ', organizationId: orgs[1].id },
      { levelName: 'Đại học', organizationId: orgs[2].id },
      { levelName: 'Thạc sĩ', organizationId: orgs[2].id },
      { levelName: 'Tiến sĩ', organizationId: orgs[2].id },
      { levelName: 'Đại học', organizationId: orgs[3].id },
      { levelName: 'Cao đẳng', organizationId: orgs[3].id },
      { levelName: 'Đại học', organizationId: orgs[4].id },
      { levelName: 'Thạc sĩ', organizationId: orgs[4].id },
    ];
    const eduLevels = [];
    for (const e of eduData) eduLevels.push(await db.educationLevel.create(e));

    // ==========================
    // 5. CLASSES
    // ==========================
    const classData = [
      { className: 'CNTT-K60', studentCount: 0, educationLevelId: eduLevels[0].id },
      { className: 'CNTT-K61', studentCount: 0, educationLevelId: eduLevels[0].id },
      { className: 'KT-K62', studentCount: 0, educationLevelId: eduLevels[3].id },
      { className: 'NN-K63', studentCount: 0, educationLevelId: eduLevels[8].id },
      { className: 'DT-K62', studentCount: 0, educationLevelId: eduLevels[10].id },
    ];
    const classes = [];
    for (const c of classData) classes.push(await db.class.create(c));

    // ==========================
    // 6. STUDENTS (User + Profile)
    // ==========================
    const studentList = [
      { code: 'HV001', fullName: 'Phạm Văn An', gender: 'MALE', birthday: new Date('2002-03-15'), hometown: 'Nam Định', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Nam Định', phoneNumber: '0901000001', email: 'hv001@example.com', cccd: '001102000001', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội trưởng', positionParty: 'Đảng viên', fullPartyMember: new Date('2023-06-15'), probationaryPartyMember: new Date('2022-06-15'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.2, currentCpa10: 7.8 },
      { code: 'HV002', fullName: 'Nguyễn Thị Bình', gender: 'FEMALE', birthday: new Date('2003-07-22'), hometown: 'Thái Bình', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Thái Bình', phoneNumber: '0901000002', email: 'hv002@example.com', cccd: '001103000002', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2023-02-15'), classId: classes[1].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 2.8, currentCpa10: 6.5 },
      { code: 'HV003', fullName: 'Trần Văn Cường', gender: 'MALE', birthday: new Date('2004-01-10'), hometown: 'Thanh Hóa', ethnicity: 'Kinh', religion: 'Thiên chúa', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Thanh Hóa', phoneNumber: '0901000003', email: 'hv003@example.com', cccd: '001104000003', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhất', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[3].id, currentCpa4: 3.5, currentCpa10: 8.2 },
      { code: 'HV004', fullName: 'Lê Thị Dung', gender: 'FEMALE', birthday: new Date('2004-05-18'), hometown: 'Nghệ An', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Nghệ An', phoneNumber: '0901000004', email: 'hv004@example.com', cccd: '001104000004', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhì', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[3].id, currentCpa4: 1.8, currentCpa10: 4.5 },
      { code: 'HV005', fullName: 'Hoàng Văn Em', gender: 'MALE', birthday: new Date('2003-11-30'), hometown: 'Hà Nội', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Hà Nội', phoneNumber: '0901000005', email: 'hv005@example.com', cccd: '001103000005', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Cảm tình Đảng', dateOfEnlistment: new Date('2023-02-15'), classId: classes[3].id, organizationId: orgs[3].id, universityId: universities[2].id, educationLevelId: eduLevels[8].id, currentCpa4: 3.8, currentCpa10: 9.1 },
      { code: 'HV006', fullName: 'Vũ Thị Phương', gender: 'FEMALE', birthday: new Date('2002-06-10'), hometown: 'Hải Dương', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Hải Dương', phoneNumber: '0901000006', email: 'hv006@example.com', cccd: '001102000006', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội phó', positionParty: 'Đảng viên', fullPartyMember: new Date('2023-09-20'), probationaryPartyMember: new Date('2022-09-20'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.6, currentCpa10: 8.5 },
      { code: 'HV007', fullName: 'Đặng Văn Giang', gender: 'MALE', birthday: new Date('2005-04-02'), hometown: 'Bắc Ninh', ethnicity: 'Kinh', religion: 'Phật giáo', currentAddress: 'Ký túc xá Khu D', placeOfBirth: 'Bắc Ninh', phoneNumber: '0901000007', email: 'hv007@example.com', cccd: '001105000007', enrollment: 2025, unit: 'Đại đội 2', rank: 'Binh nhì', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2025-02-15'), classId: classes[4].id, organizationId: orgs[4].id, universityId: universities[3].id, educationLevelId: eduLevels[10].id, currentCpa4: 2.5, currentCpa10: 6.0 },
      { code: 'HV008', fullName: 'Bùi Thị Hương', gender: 'FEMALE', birthday: new Date('2003-12-25'), hometown: 'Hưng Yên', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Hưng Yên', phoneNumber: '0901000008', email: 'hv008@example.com', cccd: '001103000008', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2023-02-15'), classId: classes[1].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.0, currentCpa10: 7.2 },
      { code: 'HV009', fullName: 'Ngô Văn Ích', gender: 'MALE', birthday: new Date('2004-08-08'), hometown: 'Hà Nam', ethnicity: 'Tày', religion: 'Không', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Hà Nam', phoneNumber: '0901000009', email: 'hv009@example.com', cccd: '001104000009', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhất', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[3].id, currentCpa4: 2.0, currentCpa10: 5.5 },
      { code: 'HV010', fullName: 'Dương Thị Kim', gender: 'FEMALE', birthday: new Date('2002-09-15'), hometown: 'Quảng Ninh', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Quảng Ninh', phoneNumber: '0901000010', email: 'hv010@example.com', cccd: '001102000010', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội trưởng', positionParty: 'Đảng viên dự bị', probationaryPartyMember: new Date('2024-01-10'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.9, currentCpa10: 9.3 },
    ];

    const hocVienUsers = [];
    const profiles = [];
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
    const middleNames = ['Văn', 'Thị', 'Đức', 'Ngọc', 'Hữu', 'Minh', 'Hải', 'Thanh', 'Xuân', 'Thu', 'Quang'];
    const lastNames = ['An', 'Bình', 'Cường', 'Dung', 'Em', 'Phương', 'Giang', 'Hương', 'Ích', 'Kim', 'Long', 'Mai', 'Nam', 'Oanh', 'Phong', 'Quân', 'Thành', 'Tú', 'Uyên', 'Vinh', 'Yến'];

    for (let i = 1; i <= 50; i++) {
      const cls = randomItem(classes);
      const edu = eduLevels.find(e => e.id === cls.educationLevelId);
      const org = orgs.find(o => o.id === edu.organizationId);
      const uni = universities.find(u => u.id === org.universityId);
      const commander = randomItem(commanders);
      const enrollmentYear = randomInt(2022, 2024);

      const isMale = Math.random() > 0.5;
      const mName = isMale ? randomItem(middleNames.filter(n => n !== 'Thị')) : 'Thị';
      const fullName = `${randomItem(firstNames)} ${mName} ${randomItem(lastNames)}`;

      const profile = await db.profile.create({
        code: `HV${String(i).padStart(3, '0')}`,
        fullName,
        gender: isMale ? 'MALE' : 'FEMALE',
        birthday: randomDate(new Date('2000-01-01'), new Date('2004-12-31')),
        hometown: 'Thành phố Hà Nội',
        placeOfBirth: 'Bệnh viện Phụ sản Hà Nội',
        ethnicity: 'Kinh', religion: 'Không',
        currentAddress: 'Khu A, Ký túc xá',
        email: `hv${String(i).padStart(3, '0')}@example.com`,
        phoneNumber: `09${String(randomInt(10000000, 99999999))}`,
        cccd: `001${String(randomInt(100000000, 999999999))}`,
        enrollment: enrollmentYear,
        unit: `Đại đội ${randomInt(1, 3)}`,
        rank: randomItem(['Binh nhì', 'Binh nhất', 'Hạ sĩ', 'Trung sĩ', 'Thượng sĩ']),
        positionGovernment: randomItem(['Chiến sĩ', 'Tiểu đội phó', 'Tiểu đội trưởng']),
        positionParty: randomItem(['Đoàn viên', 'Cảm tình Đảng', 'Đảng viên dự bị', 'Đảng viên']),
        dateOfEnlistment: new Date(`${enrollmentYear}-02-15`),
        classId: cls.id,
        organizationId: org.id,
        universityId: uni.id,
        educationLevelId: edu.id,
        commanderId: commander.id,
        currentCpa4: 0, currentCpa10: 0
      });

      const user = await db.user.create({
        username: `hv${String(i).padStart(3, '0')}`,
        password: await bcrypt.hash('hocvien123', 10),
        role: 'STUDENT',
        profileId: profile.id,
      });

      students.push(user);
      profiles.push(profile);
    }

    // Update class counts
    for (const cls of classes) {
      const c = await db.profile.count({ where: { classId: cls.id } });
      await cls.update({ studentCount: c });
    }

    // 8. SEMESTERS
    const schoolYears = {};
    const semesters = [];
    for (const s of semData) {
      const semester = await db.semester.create({
        code: s.code,
        schoolYearId: schoolYears[s.schoolYear].id,
      });
      semesters.push({ ...semester.get({ plain: true }), schoolYear: s.schoolYear });
    }

    const getSchoolYearsForEnrollment = (enrollment) =>
      [...new Set(semesters.map(s => s.schoolYear))]
        .filter(schoolYear => Number(schoolYear.split('-')[0]) >= Number(enrollment || 2024));
    const getSemesterKey = (semester) => `${semester.schoolYear}-${semester.code}`;

    // ==========================
    // 8. ACADEMIC RESULTS
    // ==========================
    const subjectTemplates = [
      { subjectCode: 'IT101', subjectName: 'Nhập môn lập trình', credits: 3 },
      { subjectCode: 'IT102', subjectName: 'Cấu trúc dữ liệu & Giải thuật', credits: 4 },
      { subjectCode: 'IT103', subjectName: 'Cơ sở dữ liệu', credits: 3 },
      { subjectCode: 'IT104', subjectName: 'Lập trình hướng đối tượng', credits: 3 },
      { subjectCode: 'IT105', subjectName: 'Mạng máy tính', credits: 3 },
      { subjectCode: 'IT106', subjectName: 'Hệ điều hành', credits: 3 },
      { subjectCode: 'KT101', subjectName: 'Kinh tế vi mô', credits: 3 },
      { subjectCode: 'KT102', subjectName: 'Kinh tế vĩ mô', credits: 3 },
      { subjectCode: 'NN101', subjectName: 'Tiếng Anh chuyên ngành 1', credits: 2 },
      { subjectCode: 'NN102', subjectName: 'Tiếng Anh chuyên ngành 2', credits: 2 },
      { subjectCode: 'QP101', subjectName: 'GDQP&AN 1', credits: 4 },
      { subjectCode: 'QP102', subjectName: 'GDQP&AN 2', credits: 3 },
    ];
    const gradeOptions = [
      { letterGrade: 'A+', gradePoint4: 4.0, gradePoint10: 9.5 },
      { letterGrade: 'A', gradePoint4: 4.0, gradePoint10: 8.5 },
      { letterGrade: 'B+', gradePoint4: 3.5, gradePoint10: 8.0 },
      { letterGrade: 'B', gradePoint4: 3.0, gradePoint10: 7.0 },
      { letterGrade: 'C+', gradePoint4: 2.5, gradePoint10: 6.5 },
      { letterGrade: 'C', gradePoint4: 2.0, gradePoint10: 5.5 },
      { letterGrade: 'D+', gradePoint4: 1.5, gradePoint10: 5.0 },
      { letterGrade: 'D', gradePoint4: 1.0, gradePoint10: 4.0 },
      { letterGrade: 'F', gradePoint4: 0.0, gradePoint10: 2.0 },
    ];

    const getSchoolYearsForEnrollment = (enrollment) =>
      [...new Set(semesters.map(s => s.schoolYear))]
        .filter(sy => Number(sy.split('-')[0]) >= Number(enrollment || 2024));

    const getSemesterKey = (semester) => `${semester.schoolYear}-${semester.code}`;
    const subjectsByUserIdAndSemester = new Map();

    for (let idx = 0; idx < students.length; idx++) {
      const profile = profiles[idx];
      const user = students[idx];
      subjectsByUserIdAndSemester.set(user.id, new Map());

      const userSchoolYears = getSchoolYearsForEnrollment(profile.enrollment);
      let cumulativeCredits = 0, cumulativePoint4 = 0, cumulativePoint10 = 0;
      let totalPassed = 0, totalFailed = 0;

      for (const sy of userSchoolYears) {
        const semestersForYear = semesters.filter(s => s.schoolYear === sy);

        const yearly = await db.yearlyResult.create({
          userId: user.id,
          schoolYear: sy,
          averageGrade4: 0, averageGrade10: 0, cumulativeGrade4: 0, cumulativeGrade10: 0,
          cumulativeCredits: 0, totalCredits: 0, totalSubjects: 0,
          passedSubjects: 0, failedSubjects: 0, debtCredits: 0,
          academicStatus: 'HỌC',
          partyRating: randomItem(['Xuất sắc', 'Tốt', 'Khá', 'Trung bình']),
          trainingRating: randomItem(['Xuất sắc', 'Tốt', 'Khá', 'Trung bình']),
        });

        let yearCredits = 0, yearPoint4 = 0, yearPoint10 = 0;
        let yearPassed = 0, yearFailed = 0, yearDebt = 0;

        for (const sem of semestersForYear) {
          const semResult = await db.semesterResult.create({
            userId: user.id,
            semester: String(sem.code),
            schoolYear: sy,
            yearlyResultId: yearly.id,
            totalCredits: 0, averageGrade4: 0, averageGrade10: 0,
            cumulativeCredits: 0, cumulativeGrade4: 0, cumulativeGrade10: 0,
            debtCredits: 0, failedSubjects: 0,
          });

          const semSubjects = [...subjects].sort(() => 0.5 - Math.random()).slice(0, randomInt(3, 6));
          let semCredits = 0, semPoint4 = 0, semPoint10 = 0, semFailed = 0;

          const semesterKey = getSemesterKey(sem);
          if (!subjectsByUserIdAndSemester.get(user.id).has(semesterKey)) {
            subjectsByUserIdAndSemester.get(user.id).set(semesterKey, []);
          }

          for (const sub of semSubjects) {
            const grade = randomItem(gradeOptions);
            const subjectResult = await db.subjectResult.create({
              semesterResultId: semResult.id,
              subjectCode: sub.subjectCode, subjectName: sub.subjectName, credits: sub.credits,
              letterGrade: grade.letterGrade, gradePoint4: grade.gradePoint4, gradePoint10: grade.gradePoint10,
            });
            subjectsByUserIdAndSemester.get(user.id).get(semesterKey).push(subjectResult);

            semTotalCredits += sub.credits;
            semTotalPoint4 += grade.gradePoint4 * sub.credits;
            semTotalPoint10 += grade.gradePoint10 * sub.credits;
            if (grade.gradePoint4 === 0) { semFailed++; debtCredits += sub.credits; }
            else { semPassed++; }
          }

          cumulativeCredits += semCredits;
          cumulativePoint4 += semPoint4;
          cumulativePoint10 += semPoint10;
          yearCredits += semCredits;
          yearPoint4 += semPoint4;
          yearPoint10 += semPoint10;

          await semResult.update({
            totalCredits: semCredits,
            averageGrade4: semCredits > 0 ? parseFloat((semPoint4 / semCredits).toFixed(2)) : 0,
            averageGrade10: semCredits > 0 ? parseFloat((semPoint10 / semCredits).toFixed(2)) : 0,
            cumulativeCredits,
            cumulativeGrade4: parseFloat((cumulativePoint4 / cumulativeCredits).toFixed(2)),
            cumulativeGrade10: parseFloat((cumulativePoint10 / cumulativeCredits).toFixed(2)),
            debtCredits, failedSubjects: semFailed,
          });

          totalCredits += semTotalCredits;
          totalPoint4 += semTotalPoint4;
          totalPoint10 += semTotalPoint10;
          passedSubjects += semPassed;
          failedSubjects += semFailed;
        }

        const yearlyGpa4 = totalPoint4 / totalCredits;
        const yearlyGpa10 = totalPoint10 / totalCredits;
        await yearly.update({
          averageGrade4: parseFloat(yearlyGpa4.toFixed(2)),
          averageGrade10: parseFloat(yearlyGpa10.toFixed(2)),
          cumulativeGrade4: parseFloat(yearlyGpa4.toFixed(2)),
          cumulativeGrade10: parseFloat(yearlyGpa10.toFixed(2)),
          cumulativeCredits, totalCredits,
          totalSubjects: passedSubjects + failedSubjects,
          passedSubjects, failedSubjects, debtCredits,
        });
      }
    }
    console.log('✅ Academic Results seeded.');

    // 10. TIME TABLES
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const timeSlots = [
      { startTime: '07:00', endTime: '09:25' }, { startTime: '09:35', endTime: '12:00' },
      { startTime: '13:30', endTime: '15:55' }, { startTime: '16:05', endTime: '18:30' },
    ];
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      const profile = profiles[i];
      const userSchoolYears = getSchoolYearsForEnrollment(profile.enrollment);
      const userSemesters = semesters.filter(s => userSchoolYears.includes(s.schoolYear));

      for (const semester of timetableSemesters) {
        const numDays = 3 + Math.floor(Math.random() * 3);
        const selectedDays = [...days].sort(() => 0.5 - Math.random()).slice(0, numDays);
        const schedules = [];
        const selectedDays = [...days].sort(() => 0.5 - Math.random()).slice(0, randomInt(3, 5));
        for (const day of selectedDays) {
          const selectedSlots = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, randomInt(1, 3));
          for (const slot of selectedSlots) {
            const subject = randomItem(semesterSubjects);
            schedules.push({
              day, startTime: slot.startTime, endTime: slot.endTime, room: `P${randomInt(100, 400)}`,
              subjectName: subject.subjectName, week: `Tuần ${randomInt(1, 15)}`,
            });
          }
        }
        await db.timeTable.create({ userId: user.id, semesterId: sem.id, schedules });
      }
    }
    console.log('✅ TimeTables (Lịch học) seeded.');

    // 11. TUITION FEES
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      const profile = profiles[i];
      const user = hocVienUsers[i];
      const schoolYears = getSchoolYearsForEnrollment(profile.enrollment);
      for (const sy of schoolYears) {
        for (const hk of [1, 2]) {
          const semester = semesters.find(s => s.schoolYear === sy && s.code === hk);
          await db.tuitionFee.create({
            userId: user.id, totalAmount: 4500000 + Math.floor(Math.random() * 2000000),
            semesterId: semester?.id || null,
            semester: String(hk), schoolYear: sy,
            content: `Học phí ${sy} - ${hk}`,
            status: ['PAID', 'PAID', 'PAID', 'UNPAID', 'UNPAID'][Math.floor(Math.random() * 5)],
          });
        }
      }
    }
    console.log('TuitionFees seeded.');

    // ==========================
    // 12. ACHIEVEMENTS
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      if (Math.random() > 0.6) {
        await db.achievement.create({
          userId: user.id, title: 'Thành tích sinh viên xuất sắc', semester: '1', schoolYear: '2023-2024',
          year: 2024, award: 'Giấy khen', content: 'Hoàn thành xuất sắc nhiệm vụ'
        });
      }
    }

    // 13. ACHIEVEMENT PROFILES
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      await db.achievementProfile.create({
        userId: user.id, totalYears: 2, totalAdvancedSoldier: randomInt(0, 2),
        totalCompetitiveSoldier: randomInt(0, 1), totalScientificTopics: randomInt(0, 2),
        totalScientificInitiatives: randomInt(0, 2), eligibleForMinistryReward: Math.random() > 0.8,
        eligibleForNationalReward: Math.random() > 0.9,
      });
    }

    // 14. YEARLY ACHIEVEMENTS + SCIENTIFIC
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      if (Math.random() > 0.7) {
        const ya = await db.yearlyAchievement.create({
          userId: user.id, year: 2024, decisionNumber: `QD-${randomInt(1000, 9999)}`,
          decisionDate: new Date(), title: 'Chiến sĩ tiên tiến', hasMinistryReward: false, hasNationalReward: false
        });
        if (Math.random() > 0.5) {
          await db.scientificTopic.create({ yearlyAchievementId: ya.id, title: 'Nghiên cứu AI', description: 'AI trong quân sự', year: 2024, status: 'HOÀN THÀNH' });
        }
        if (Math.random() > 0.5) {
          await db.scientificInitiative.create({ yearlyAchievementId: ya.id, title: 'Sáng kiến quản lý', description: 'Phần mềm quản lý', year: 2024, status: 'ĐÃ ÁP DỤNG' });
        }
      }
    }

    // 15. CUT RICE & CUT RICE REQUESTS
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      const profile = profiles[i];
      const userSchoolYears = getSchoolYearsForEnrollment(profile.enrollment);
      const userSemesters = semesters.filter(s => userSchoolYears.includes(s.schoolYear));
      if (userSemesters.length === 0) continue;
      const sem = randomItem(userSemesters);

      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - ((weekStartDate.getDay() + 6) % 7));
      weekStartDate.setHours(0, 0, 0, 0);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      const weeklyData = {};
      days.forEach(d => { weeklyData[d] = { morning: true, noon: false, evening: true }; });

      await db.cutRice.create({
        userId: user.id, semesterId: sem.id, weekStartDate, weekEndDate, weekly: weeklyData,
        isAutoGenerated: true, lastUpdated: new Date(), notes: 'Sinh tự động',
      });

      if (Math.random() > 0.5) {
        await db.cutRiceRequest.create({
          userId: user.id, semesterId: sem.id, weekStartDate, weekEndDate, weekly: weeklyData,
          notes: 'Xin về quê', status: randomItem(['PENDING', 'APPROVED', 'REJECTED']),
          reviewedBy: randomItem(commanders).id, reviewedAt: new Date(), reviewNote: 'Đã xem'
        });
      }
    }

    // 16. COMMANDER DUTY SCHEDULES
    for (const cmd of commanders) {
      await db.commanderDutySchedule.create({
        userId: cmd.id, position: 'Trực chỉ huy', workDay: randomDate(new Date(), new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000))
      });
    }

    // 17. NOTIFICATIONS
    for (const user of students) {
      await db.notification.create({ userId: user.id, title: 'Chào mừng', content: 'Chào bạn', type: 'GENERAL', isRead: false });
    }

    // 18. GRADE REQUESTS
    for (let i = 0; i < students.length; i++) {
      const user = students[i];
      const userSemestersMap = subjectsByUserIdAndSemester.get(user.id);
      if (!userSemestersMap) continue;
      for (const [key, semesterSubjects] of userSemestersMap.entries()) {
        if (semesterSubjects.length > 0 && Math.random() > 0.8) {
          const subject = randomItem(semesterSubjects);
          await db.gradeRequest.create({
            userId: user.id, subjectResultId: subject.id, requestType: 'UPDATE',
            reason: 'Phúc khảo điểm', proposedLetterGrade: 'A', proposedGradePoint4: 4.0, proposedGradePoint10: 9.0,
            status: 'PENDING'
          });
        }
      }
    }

    console.log('\n✅ FULL SEED DATA CREATED SUCCESSFULLY WITH MASSIVE DATA');
    console.log('==============================');
    console.log('Tài khoản test:');
    console.log('  - Admin:     admin / admin123');
    console.log('  - Chỉ huy:   chihuy01 -> chihuy03 / chihuy123');
    console.log('  - Học viên:  hv001 -> hv050 / hocvien123');
    console.log('==============================');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

fullSeed();
