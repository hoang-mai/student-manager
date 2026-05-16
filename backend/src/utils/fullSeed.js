const db = require('../models');
const bcrypt = require('bcrypt');

async function fullSeed() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synced (force).');

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
      { universityCode: 'NEU', universityName: 'Đại học Kinh tế Quốc dân', totalStudents: 120, status: 'ACTIVE' },
      { universityCode: 'FTU', universityName: 'Đại học Ngoại thương', totalStudents: 90, status: 'ACTIVE' },
      { universityCode: 'ULIS', universityName: 'Đại học Ngoại ngữ - ĐHQGHN', totalStudents: 80, status: 'ACTIVE' },
      { universityCode: 'HUST', universityName: 'Đại học Bách khoa Hà Nội', totalStudents: 150, status: 'ACTIVE' },
    ];
    const universities = [];
    for (const u of uniData) universities.push(await db.university.create(u));

    // ==========================
    // 3. ORGANIZATIONS
    // ==========================
    const orgData = [
      { organizationName: 'Khoa CNTT', universityId: universities[0].id, status: 'ACTIVE', travelTime: 30, totalStudents: 45 },
      { organizationName: 'Khoa Kinh tế', universityId: universities[0].id, status: 'ACTIVE', travelTime: 25, totalStudents: 40 },
      { organizationName: 'Khoa Ngoại thương', universityId: universities[1].id, status: 'ACTIVE', travelTime: 20, totalStudents: 50 },
      { organizationName: 'Khoa Ngoại ngữ', universityId: universities[2].id, status: 'ACTIVE', travelTime: 15, totalStudents: 35 },
      { organizationName: 'Khoa Điện tử', universityId: universities[3].id, status: 'ACTIVE', travelTime: 35, totalStudents: 60 },
    ];
    const orgs = [];
    for (const o of orgData) orgs.push(await db.organization.create(o));

    // ==========================
    // 4. EDUCATION LEVELS
    // ==========================
    const eduData = [
      { levelName: 'Đại học', organizationId: orgs[0].id },
      { levelName: 'Thạc sĩ', organizationId: orgs[0].id },
      { levelName: 'Đại học', organizationId: orgs[1].id },
      { levelName: 'Đại học', organizationId: orgs[2].id },
      { levelName: 'Đại học', organizationId: orgs[3].id },
      { levelName: 'Đại học', organizationId: orgs[4].id },
    ];
    const eduLevels = [];
    for (const e of eduData) eduLevels.push(await db.educationLevel.create(e));

    // ==========================
    // 5. CLASSES
    // ==========================
    const classData = [
      { className: 'CNTT-K60', studentCount: 30, educationLevelId: eduLevels[0].id },
      { className: 'CNTT-K61', studentCount: 35, educationLevelId: eduLevels[0].id },
      { className: 'KT-K62', studentCount: 28, educationLevelId: eduLevels[2].id },
      { className: 'NN-K63', studentCount: 25, educationLevelId: eduLevels[4].id },
      { className: 'DT-K62', studentCount: 32, educationLevelId: eduLevels[5].id },
    ];
    const classes = [];
    for (const c of classData) classes.push(await db.class.create(c));

    // ==========================
    // 6. STUDENTS (User + Profile)
    // ==========================
    const studentList = [
      { code: 'HV001', fullName: 'Phạm Văn An', gender: 'MALE', birthday: new Date('2002-03-15'), hometown: 'Nam Định', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Nam Định', phoneNumber: '0901000001', email: 'hv001@example.com', cccd: '001102000001', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội trưởng', positionParty: 'Đảng viên', fullPartyMember: new Date('2023-06-15'), probationaryPartyMember: new Date('2022-06-15'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.2, currentCpa10: 7.8 },
      { code: 'HV002', fullName: 'Nguyễn Thị Bình', gender: 'FEMALE', birthday: new Date('2003-07-22'), hometown: 'Thái Bình', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Thái Bình', phoneNumber: '0901000002', email: 'hv002@example.com', cccd: '001103000002', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2023-02-15'), classId: classes[1].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 2.8, currentCpa10: 6.5 },
      { code: 'HV003', fullName: 'Trần Văn Cường', gender: 'MALE', birthday: new Date('2004-01-10'), hometown: 'Thanh Hóa', ethnicity: 'Kinh', religion: 'Thiên chúa', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Thanh Hóa', phoneNumber: '0901000003', email: 'hv003@example.com', cccd: '001104000003', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhất', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[2].id, currentCpa4: 3.5, currentCpa10: 8.2 },
      { code: 'HV004', fullName: 'Lê Thị Dung', gender: 'FEMALE', birthday: new Date('2004-05-18'), hometown: 'Nghệ An', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Nghệ An', phoneNumber: '0901000004', email: 'hv004@example.com', cccd: '001104000004', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhì', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[2].id, currentCpa4: 1.8, currentCpa10: 4.5 },
      { code: 'HV005', fullName: 'Hoàng Văn Em', gender: 'MALE', birthday: new Date('2003-11-30'), hometown: 'Hà Nội', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Hà Nội', phoneNumber: '0901000005', email: 'hv005@example.com', cccd: '001103000005', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Cảm tình Đảng', dateOfEnlistment: new Date('2023-02-15'), classId: classes[3].id, organizationId: orgs[3].id, universityId: universities[2].id, educationLevelId: eduLevels[4].id, currentCpa4: 3.8, currentCpa10: 9.1 },
      { code: 'HV006', fullName: 'Vũ Thị Phương', gender: 'FEMALE', birthday: new Date('2002-06-10'), hometown: 'Hải Dương', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Hải Dương', phoneNumber: '0901000006', email: 'hv006@example.com', cccd: '001102000006', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội phó', positionParty: 'Đảng viên', fullPartyMember: new Date('2023-09-20'), probationaryPartyMember: new Date('2022-09-20'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.6, currentCpa10: 8.5 },
      { code: 'HV007', fullName: 'Đặng Văn Giang', gender: 'MALE', birthday: new Date('2005-04-02'), hometown: 'Bắc Ninh', ethnicity: 'Kinh', religion: 'Phật giáo', currentAddress: 'Ký túc xá Khu D', placeOfBirth: 'Bắc Ninh', phoneNumber: '0901000007', email: 'hv007@example.com', cccd: '001105000007', enrollment: 2025, unit: 'Đại đội 2', rank: 'Binh nhì', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2025-02-15'), classId: classes[4].id, organizationId: orgs[4].id, universityId: universities[3].id, educationLevelId: eduLevels[5].id, currentCpa4: 2.5, currentCpa10: 6.0 },
      { code: 'HV008', fullName: 'Bùi Thị Hương', gender: 'FEMALE', birthday: new Date('2003-12-25'), hometown: 'Hưng Yên', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu A', placeOfBirth: 'Hưng Yên', phoneNumber: '0901000008', email: 'hv008@example.com', cccd: '001103000008', enrollment: 2023, unit: 'Đại đội 1', rank: 'Hạ sĩ', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2023-02-15'), classId: classes[1].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.0, currentCpa10: 7.2 },
      { code: 'HV009', fullName: 'Ngô Văn Ích', gender: 'MALE', birthday: new Date('2004-08-08'), hometown: 'Hà Nam', ethnicity: 'Tày', religion: 'Không', currentAddress: 'Ký túc xá Khu C', placeOfBirth: 'Hà Nam', phoneNumber: '0901000009', email: 'hv009@example.com', cccd: '001104000009', enrollment: 2024, unit: 'Đại đội 2', rank: 'Binh nhất', positionGovernment: 'Chiến sĩ', positionParty: 'Đoàn viên', dateOfEnlistment: new Date('2024-02-15'), classId: classes[2].id, organizationId: orgs[1].id, universityId: universities[0].id, educationLevelId: eduLevels[2].id, currentCpa4: 2.0, currentCpa10: 5.5 },
      { code: 'HV010', fullName: 'Dương Thị Kim', gender: 'FEMALE', birthday: new Date('2002-09-15'), hometown: 'Quảng Ninh', ethnicity: 'Kinh', religion: 'Không', currentAddress: 'Ký túc xá Khu B', placeOfBirth: 'Quảng Ninh', phoneNumber: '0901000010', email: 'hv010@example.com', cccd: '001102000010', enrollment: 2022, unit: 'Đại đội 1', rank: 'Trung sĩ', positionGovernment: 'Tiểu đội trưởng', positionParty: 'Đảng viên dự bị', probationaryPartyMember: new Date('2024-01-10'), dateOfEnlistment: new Date('2022-02-15'), classId: classes[0].id, organizationId: orgs[0].id, universityId: universities[0].id, educationLevelId: eduLevels[0].id, currentCpa4: 3.9, currentCpa10: 9.3 },
    ];

    const hocVienUsers = [];
    const profiles = [];
    for (let i = 0; i < studentList.length; i++) {
      const s = studentList[i];
      const profile = await db.profile.create(s);
      profiles.push(profile);

      const user = await db.user.create({
        username: `hv${String(i + 1).padStart(3, '0')}`,
        password: await bcrypt.hash('hocvien123', 10),
        role: 'STUDENT',
        profileId: profile.id,
      });
      hocVienUsers.push(user);
    }
    console.log(`10 Students seeded.`);

    // ==========================
    // 7. SEMESTERS
    // ==========================
    const semData = [
      { code: '2022-2023-HK1', schoolYear: '2022-2023' },
      { code: '2022-2023-HK2', schoolYear: '2022-2023' },
      { code: '2023-2024-HK1', schoolYear: '2023-2024' },
      { code: '2023-2024-HK2', schoolYear: '2023-2024' },
      { code: '2024-2025-HK1', schoolYear: '2024-2025' },
      { code: '2024-2025-HK2', schoolYear: '2024-2025' },
    ];
    const semesters = [];
    for (const s of semData) semesters.push(await db.semester.create(s));

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
      { subjectCode: 'DT101', subjectName: 'Kỹ thuật điện tử', credits: 3 },
      { subjectCode: 'DT102', subjectName: 'Vi xử lý', credits: 4 },
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

    function pickSubjects(templates, count) {
      return [...templates].sort(() => 0.5 - Math.random()).slice(0, count);
    }
    function pickGrade() {
      return gradeOptions[Math.floor(Math.random() * gradeOptions.length)];
    }

    for (let idx = 0; idx < profiles.length; idx++) {
      const profile = profiles[idx];
      const user = hocVienUsers[idx];
      const enrollmentYear = profile.enrollment;

      const schoolYears = ['2023-2024', '2024-2025'];
      if (enrollmentYear <= 2022) schoolYears.unshift('2022-2023');

      for (const sy of schoolYears) {
        const semesterCodes = [`${sy}-HK1`, `${sy}-HK2`];
        const semestersForYear = semesters.filter(s => semesterCodes.includes(s.code));

        const yearly = await db.yearlyResult.create({
          userId: user.id,
          schoolYear: sy,
          averageGrade4: 0, averageGrade10: 0, cumulativeGrade4: 0, cumulativeGrade10: 0,
          cumulativeCredits: 0, totalCredits: 0, totalSubjects: 0,
          passedSubjects: 0, failedSubjects: 0, debtCredits: 0,
          academicStatus: 'HỌC',
          partyRating: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình'][Math.floor(Math.random() * 4)],
          trainingRating: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình'][Math.floor(Math.random() * 4)],
        });

        let totalCredits = 0, totalPoint4 = 0, totalPoint10 = 0,
            passedSubjects = 0, failedSubjects = 0, debtCredits = 0,
            cumulativeCredits = 0, cumulativePoint4 = 0, cumulativePoint10 = 0;

        for (const sem of semestersForYear) {
          const subjects = pickSubjects(subjectTemplates, 4 + Math.floor(Math.random() * 3));
          let semTotalCredits = 0, semTotalPoint4 = 0, semTotalPoint10 = 0,
              semPassed = 0, semFailed = 0;

          const semResult = await db.semesterResult.create({
            userId: user.id,
            semester: sem.code,
            schoolYear: sy,
            yearlyResultId: yearly.id,
            totalCredits: 0, averageGrade4: 0, averageGrade10: 0,
            cumulativeCredits: 0, cumulativeGrade4: 0, cumulativeGrade10: 0,
            debtCredits: 0, failedSubjects: 0,
          });

          for (const sub of subjects) {
            const grade = pickGrade();
            await db.subjectResult.create({
              semesterResultId: semResult.id,
              subjectCode: sub.subjectCode, subjectName: sub.subjectName, credits: sub.credits,
              letterGrade: grade.letterGrade, gradePoint4: grade.gradePoint4, gradePoint10: grade.gradePoint10,
            });

            semTotalCredits += sub.credits;
            semTotalPoint4 += grade.gradePoint4 * sub.credits;
            semTotalPoint10 += grade.gradePoint10 * sub.credits;
            if (grade.gradePoint4 === 0) { semFailed++; debtCredits += sub.credits; }
            else { semPassed++; }
          }

          const semGpa4 = semTotalPoint4 / semTotalCredits;
          const semGpa10 = semTotalPoint10 / semTotalCredits;
          cumulativeCredits += semTotalCredits;
          cumulativePoint4 += semTotalPoint4;
          cumulativePoint10 += semTotalPoint10;

          await semResult.update({
            totalCredits: semTotalCredits,
            averageGrade4: parseFloat(semGpa4.toFixed(2)),
            averageGrade10: parseFloat(semGpa10.toFixed(2)),
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
    console.log('Academic results seeded.');

    // ==========================
    // 9. TIME TABLES
    // ==========================
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const timeSlots = [
      { startTime: '07:00', endTime: '09:25' },
      { startTime: '09:35', endTime: '12:00' },
      { startTime: '13:30', endTime: '15:55' },
      { startTime: '16:05', endTime: '18:30' },
    ];

    for (let i = 0; i < profiles.length; i++) {
      const user = hocVienUsers[i];
      const numDays = 3 + Math.floor(Math.random() * 3);
      const selectedDays = [...days].sort(() => 0.5 - Math.random()).slice(0, numDays);
      const schedules = [];
      for (const day of selectedDays) {
        const numSlots = 1 + Math.floor(Math.random() * 3);
        const selectedSlots = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, numSlots);
        for (const slot of selectedSlots) {
          schedules.push({ day, startTime: slot.startTime, endTime: slot.endTime, room: `P${100 + Math.floor(Math.random() * 400)}` });
        }
      }
      await db.timeTable.create({ userId: user.id, schedules });
    }
    console.log('TimeTables seeded.');

    // ==========================
    // 10. CUT RICE
    // ==========================
    for (let i = 0; i < 6 && i < hocVienUsers.length; i++) {
      const user = hocVienUsers[i];
      const weekData = {};
      for (const day of days.slice(0, 5)) {
        weekData[day] = {
          morning: Math.random() > 0.3, noon: Math.random() > 0.2,
          afternoon: Math.random() > 0.5, evening: Math.random() > 0.7,
        };
      }
      await db.cutRice.create({
        userId: user.id, weekly: weekData,
        isAutoGenerated: Math.random() > 0.5, lastUpdated: new Date(),
        notes: Math.random() > 0.7 ? 'Đã điều chỉnh thủ công' : null,
      });
    }
    console.log('CutRice seeded.');

    // ==========================
    // 11. TUITION FEES
    // ==========================
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const user = hocVienUsers[i];
      const schoolYears = ['2023-2024', '2024-2025'];
      if (profile.enrollment <= 2022) schoolYears.unshift('2022-2023');
      for (const sy of schoolYears) {
        for (const hk of ['HK1', 'HK2']) {
          await db.tuitionFee.create({
            userId: user.id, totalAmount: 4500000 + Math.floor(Math.random() * 2000000),
            semester: `${sy}-${hk}`, schoolYear: sy,
            content: `Học phí ${sy} - ${hk}`,
            status: ['PAID', 'PAID', 'PAID', 'UNPAID', 'UNPAID'][Math.floor(Math.random() * 5)],
          });
        }
      }
    }
    console.log('TuitionFees seeded.');

    // ==========================
    // 12. ACHIEVEMENTS
    // ==========================
    const achievementData = [
      { idx: 0, title: 'Giải nhất Olympic Tin học toàn quốc', semester: '2023-2024-HK1', schoolYear: '2023-2024', year: 2024, award: 'Giải nhất', content: 'Đạt giải nhất kỳ thi Olympic Tin học toàn quốc năm 2024' },
      { idx: 0, title: 'Chiến sĩ thi đua cấp cơ sở', semester: '2024-2025-HK1', schoolYear: '2024-2025', year: 2025, award: 'Chiến sĩ thi đua', content: 'Hoàn thành xuất sắc nhiệm vụ năm 2024' },
      { idx: 1, title: 'Huy chương vàng Hội thao Quân sự', semester: '2023-2024-HK2', schoolYear: '2023-2024', year: 2024, award: 'Huy chương vàng', content: 'Môn bơi lội 100m tự do nữ' },
      { idx: 2, title: 'Giải ba NCKH cấp trường', semester: '2024-2025-HK1', schoolYear: '2024-2025', year: 2025, award: 'Giải ba', content: 'Đề tài: Ứng dụng AI trong quản lý học viên quân sự' },
      { idx: 3, title: 'Giấy khen hoàn thành nhiệm vụ', semester: '2024-2025-HK1', schoolYear: '2024-2025', year: 2024, award: 'Giấy khen', content: 'Hoàn thành tốt nhiệm vụ được giao' },
      { idx: 5, title: 'Sinh viên 5 tốt cấp Trung ương', semester: '2023-2024-HK2', schoolYear: '2023-2024', year: 2024, award: 'Sinh viên 5 tốt', content: 'Danh hiệu cao quý dành cho sinh viên xuất sắc toàn diện' },
      { idx: 9, title: 'Giải nhì Olympic Tiếng Anh', semester: '2023-2024-HK1', schoolYear: '2023-2024', year: 2023, award: 'Giải nhì', content: 'Đạt giải nhì Olympic Tiếng Anh toàn quốc' },
      { idx: 9, title: 'Chiến sĩ tiên tiến', semester: '2024-2025-HK1', schoolYear: '2024-2025', year: 2025, award: 'Chiến sĩ tiên tiến', content: 'Đạt danh hiệu Chiến sĩ tiên tiến năm 2024' },
    ];
    for (const a of achievementData) {
      await db.achievement.create({
        userId: hocVienUsers[a.idx].id,
        title: a.title, semester: a.semester, schoolYear: a.schoolYear,
        year: a.year, award: a.award, content: a.content,
      });
    }
    console.log('Achievements seeded.');

    // ==========================
    // 13. ACHIEVEMENT PROFILES
    // ==========================
    for (let i = 0; i < hocVienUsers.length; i++) {
      const user = hocVienUsers[i];
      const myCount = achievementData.filter(a => a.idx === i).length;
      await db.achievementProfile.create({
        userId: user.id, totalYears: Math.max(1, 2026 - (profiles[i].enrollment || 2024)),
        totalAdvancedSoldier: myCount > 0 ? 1 : 0,
        totalCompetitiveSoldier: myCount > 1 ? 1 : 0,
        totalScientificTopics: Math.floor(Math.random() * 2),
        totalScientificInitiatives: Math.floor(Math.random() * 2),
        eligibleForMinistryReward: Math.random() > 0.7,
        eligibleForNationalReward: Math.random() > 0.9,
      });
    }
    console.log('AchievementProfiles seeded.');

    // ==========================
    // 14. YEARLY ACHIEVEMENTS + SCIENTIFIC
    // ==========================
    const yaData = [
      { idx: 0, year: 2023, decisionNumber: 'QD-2023-001', decisionDate: new Date('2023-12-20'), title: 'Chiến sĩ tiên tiến', hasMinistryReward: false, hasNationalReward: false },
      { idx: 0, year: 2024, decisionNumber: 'QD-2024-015', decisionDate: new Date('2024-12-15'), title: 'Chiến sĩ thi đua cấp cơ sở', hasMinistryReward: true, hasNationalReward: false },
      { idx: 5, year: 2023, decisionNumber: 'QD-2023-042', decisionDate: new Date('2023-12-10'), title: 'Chiến sĩ tiên tiến', hasMinistryReward: false, hasNationalReward: false },
      { idx: 5, year: 2024, decisionNumber: 'QD-2024-008', decisionDate: new Date('2024-12-20'), title: 'Sinh viên 5 tốt cấp Trung ương', hasMinistryReward: true, hasNationalReward: true },
      { idx: 9, year: 2024, decisionNumber: 'QD-2024-022', decisionDate: new Date('2024-12-25'), title: 'Chiến sĩ thi đua', hasMinistryReward: false, hasNationalReward: false },
    ];
    const yearlyAchs = [];
    for (const ya of yaData) {
      const rec = await db.yearlyAchievement.create({
        userId: hocVienUsers[ya.idx].id,
        year: ya.year, decisionNumber: ya.decisionNumber, decisionDate: ya.decisionDate,
        title: ya.title, hasMinistryReward: ya.hasMinistryReward, hasNationalReward: ya.hasNationalReward,
        notes: ya.notes,
      });
      yearlyAchs.push(rec);
    }

    await db.scientificTopic.create({ yearlyAchievementId: yearlyAchs[1].id, title: 'Ứng dụng AI trong quản lý học viên', description: 'Nghiên cứu ứng dụng Machine Learning vào dự đoán kết quả học tập', year: 2024, status: 'HOÀN THÀNH' });
    await db.scientificInitiative.create({ yearlyAchievementId: yearlyAchs[1].id, title: 'Phần mềm quản lý điểm rèn luyện', description: 'Xây dựng phần mềm tự động tính điểm rèn luyện cho học viên', year: 2024, status: 'ĐÃ ÁP DỤNG' });
    await db.scientificTopic.create({ yearlyAchievementId: yearlyAchs[3].id, title: 'Nghiên cứu phương pháp học tập hiệu quả', description: 'Khảo sát và đề xuất phương pháp học tập cho sinh viên quân đội', year: 2024, status: 'HOÀN THÀNH' });
    await db.scientificInitiative.create({ yearlyAchievementId: yearlyAchs[3].id, title: 'Hệ thống điểm danh tự động', description: 'Thiết kế hệ thống điểm danh bằng nhận diện khuôn mặt', year: 2024, status: 'ĐANG THỬ NGHIỆM' });
    console.log('YearlyAchievements + Scientific seeded.');

    // ==========================
    // 15. NOTIFICATIONS
    // ==========================
    const notifTemplates = [
      { title: 'Chào mừng học viên mới', content: 'Chào mừng bạn đến với hệ thống quản lý học viên.', type: 'GENERAL' },
      { title: 'Điểm học kỳ đã được cập nhật', content: 'Điểm học kỳ 2024-2025 đã được cập nhật.', type: 'GRADE' },
      { title: 'Lịch cắt cơm tuần này', content: 'Lịch cắt cơm đã được cập nhật tự động.', type: 'CUT_RICE' },
      { title: 'Chúc mừng thành tích', content: 'Chúc mừng bạn đã đạt danh hiệu Chiến sĩ thi đua.', type: 'ACHIEVEMENT' },
      { title: 'Thông báo học phí', content: 'Học phí học kỳ 2 đã đến hạn.', type: 'TUITION' },
      { title: 'Lịch trực tuần', content: 'Lịch trực tuần đã được phân công.', type: 'GENERAL' },
      { title: 'Thông báo nghỉ lễ', content: 'Đơn vị sẽ nghỉ lễ 30/04 - 01/05.', type: 'GENERAL' },
    ];
    for (const user of hocVienUsers) {
      const num = 2 + Math.floor(Math.random() * 4);
      const selected = [...notifTemplates].sort(() => 0.5 - Math.random()).slice(0, num);
      for (const n of selected) {
        await db.notification.create({ userId: user.id, ...n, isRead: Math.random() > 0.5 });
      }
    }
    for (const cmd of [chiHuy1, chiHuy2]) {
      await db.notification.create({ userId: cmd.id, title: 'Nhiệm vụ mới', content: 'Phê duyệt đề xuất điểm học kỳ mới.', type: 'GENERAL', isRead: false });
      await db.notification.create({ userId: cmd.id, title: 'Lịch trực tuần', content: 'Lịch trực đã được cập nhật.', type: 'GENERAL', isRead: true });
    }
    console.log('Notifications seeded.');

    // ==========================
    // 16. COMMANDER DUTY SCHEDULES
    // ==========================
    const dutyData = [
      { userId: chiHuy1.id, position: 'Đại đội trưởng', workDay: new Date('2024-10-01') },
      { userId: chiHuy2.id, position: 'Đại đội phó', workDay: new Date('2024-10-02') },
      { userId: chiHuy1.id, position: 'Trực chỉ huy', workDay: new Date('2024-10-07') },
      { userId: chiHuy2.id, position: 'Trực chỉ huy', workDay: new Date('2024-10-08') },
      { userId: chiHuy1.id, position: 'Trực an ninh', workDay: new Date('2024-10-09') },
      { userId: chiHuy1.id, position: 'Trực chỉ huy', workDay: new Date('2025-02-10') },
      { userId: chiHuy2.id, position: 'Trực ban', workDay: new Date('2025-02-11') },
    ];
    for (const d of dutyData) await db.commanderDutySchedule.create(d);
    console.log('CommanderDutySchedules seeded.');

    // ==========================
    // 17. GRADE REQUESTS
    // ==========================
    const firstSubjects = await db.subjectResult.findAll({ limit: 5, order: [['createdAt', 'ASC']] });
    if (firstSubjects.length >= 5) {
      await db.gradeRequest.create({ userId: hocVienUsers[0].id, subjectResultId: firstSubjects[0].id, requestType: 'UPDATE', reason: 'Điểm thi cuối kỳ bị nhập sai', proposedLetterGrade: 'A', proposedGradePoint4: 4.0, proposedGradePoint10: 9.0, status: 'PENDING' });
      await db.gradeRequest.create({ userId: hocVienUsers[1].id, subjectResultId: firstSubjects[1].id, requestType: 'UPDATE', reason: 'Bài thi bị chấm nhầm', proposedLetterGrade: 'B+', proposedGradePoint4: 3.5, proposedGradePoint10: 8.0, status: 'APPROVED', reviewerId: chiHuy1.id, reviewNote: 'Đồng ý', reviewedAt: new Date('2024-12-15') });
      await db.gradeRequest.create({ userId: hocVienUsers[2].id, subjectResultId: firstSubjects[2].id, requestType: 'DELETE', reason: 'Môn không thuộc chương trình', status: 'REJECTED', reviewerId: chiHuy2.id, reviewNote: 'Không thể xóa', reviewedAt: new Date('2025-01-10') });
      await db.gradeRequest.create({ userId: hocVienUsers[3].id, subjectResultId: firstSubjects[3].id, requestType: 'UPDATE', reason: 'Điểm quá trình chưa được cộng', proposedLetterGrade: 'C+', proposedGradePoint4: 2.5, proposedGradePoint10: 6.5, status: 'PENDING' });
      await db.gradeRequest.create({ userId: hocVienUsers[4].id, subjectResultId: firstSubjects[4].id, requestType: 'UPDATE', reason: 'Điểm NCKH chưa được tính', proposedLetterGrade: 'B', proposedGradePoint4: 3.0, proposedGradePoint10: 7.0, status: 'PENDING' });
    }
    console.log('GradeRequests seeded.');

    console.log('\n✅ FULL SEED DATA CREATED SUCCESSFULLY');
    console.log('==============================');
    console.log('Tài khoản test:');
    console.log('  - Admin:     admin / admin123');
    console.log('  - Chỉ huy 1: chihuy01 / chihuy123');
    console.log('  - Chỉ huy 2: chihuy02 / chihuy123');
    console.log('  - Học viên:  hv001 → hv010 / hocvien123');
    console.log('==============================');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

fullSeed();
