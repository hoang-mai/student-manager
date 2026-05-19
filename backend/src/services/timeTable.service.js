const db = require('../models');
const User = db.user;
const Semester = db.semester;
const { NotFoundError, BadRequestError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const TimeTable = db.timeTable;

const ensureStudentUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user || user.role !== 'STUDENT') {
    throw new BadRequestError('Chỉ được nhập lịch học cho học viên');
  }
};

const ensureSemester = async (semesterId) => {
  if (!semesterId) return;
  const semester = await Semester.findByPk(semesterId);
  if (!semester) throw new BadRequestError('Không tìm thấy học kỳ');
};

const create = async (data) => {
  await ensureStudentUser(data.userId);
  await ensureSemester(data.semesterId);
  return TimeTable.create(data);
};
const getAll = async (query) => {
  const userWhere = {};
  const profileWhere = {};
  const semesterWhere = {};
  const opts = {
    filterFields: ['userId'],
    include: [{ model: User, include: [{ model: db.profile }] }, { model: Semester }],
  };

  if (query.semesterId) opts.filterFields.push('semesterId');

  if (query.code) {
    userWhere.role = 'STUDENT';
    profileWhere.code = query.code;
  }

  if (query.semester) semesterWhere.code = query.semester;
  if (query.schoolYear) semesterWhere.schoolYear = query.schoolYear;

  if (query.fullName) {
    profileWhere.fullName = { [db.Sequelize.Op.like]: `%${query.fullName}%` };
  }

  if (Object.keys(userWhere).length > 0) {
    opts.include[0].where = userWhere;
    opts.include[0].required = true;
  }

  if (Object.keys(profileWhere).length > 0) {
    opts.include[0].include[0].where = profileWhere;
    opts.include[0].include[0].required = true;
    opts.include[0].required = true;
  }

  if (Object.keys(semesterWhere).length > 0) {
    opts.include[1].where = semesterWhere;
    opts.include[1].required = true;
  }

  const result = await paginateQuery(TimeTable, query, opts);

  result.rows = result.rows.map(row => {
    const plain = row.get({ plain: true });
    const schedules = plain.schedules || [];
    plain.scheduleCount = schedules.length;
    plain.subjectNames = [...new Set(schedules.map(s => s.subjectName).filter(Boolean))];
    plain.weeks = [...new Set(schedules.map(s => s.week).filter(Boolean))];
    plain.rooms = [...new Set(schedules.map(s => s.room).filter(Boolean))];
    return plain;
  });

  return result;
};

const getDetail = async (id) => {
  const record = await TimeTable.findByPk(id, {
    include: [{ model: User, include: [{ model: db.profile }] }, { model: Semester }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy thời khóa biểu');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  if (data.userId) await ensureStudentUser(data.userId);
  if (data.semesterId !== undefined) await ensureSemester(data.semesterId);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

const getReport = async () => {
  const timetables = await TimeTable.findAll({
    include: [{ model: User, include: [{ model: db.profile }] }, { model: Semester }],
  });

  const rows = [];
  const studentSet = new Set();
  const subjectSet = new Set();
  const weekSet = new Set();
  let totalSchedules = 0;

  for (const tt of timetables) {
    const profile = tt.User?.Profile;
    const schedules = tt.schedules || [];
    if (schedules.length > 0) studentSet.add(profile?.code);

    for (const s of schedules) {
      totalSchedules++;
      if (s.subjectName) subjectSet.add(s.subjectName);
      if (s.week) weekSet.add(s.week);

      rows.push({
        unit: profile?.unit || '',
        fullName: profile?.fullName || '',
        semester: tt.Semester?.code || '',
        schoolYear: tt.Semester?.schoolYear || '',
        scheduleCount: schedules.length,
        subjectName: s.subjectName || '',
        room: s.room || '',
        week: s.week || '',
        day: s.day || '',
        startTime: s.startTime || '',
        endTime: s.endTime || '',
      });
    }
  }

  return {
    summary: {
      totalStudents: studentSet.size,
      totalSchedules,
      totalSubjects: subjectSet.size,
      totalWeeks: weekSet.size,
    },
    data: rows,
  };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord, getReport };
