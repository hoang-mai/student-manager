const db = require('../models');
const User = db.user;
const { NotFoundError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const TimeTable = db.timeTable;
const Student = db.student;

const create = async (data) => TimeTable.create(data);
const getAll = async (query) => {
  const opts = {
    filterFields: ['userId'],
    include: [{ model: User, include: [{ model: db.profile }] }],
  };

  if (query.fullName) {
    opts.include[0].include[0].where = { fullName: { [db.Sequelize.Op.like]: `%${query.fullName}%` } };
    opts.include[0].include[0].required = true;
    opts.include[0].required = true;
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
    include: [{ model: User, include: [{ model: db.profile }] }],
  });
  if (!record) throw new NotFoundError('Không tìm thấy thời khóa biểu');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

const getReport = async () => {
  const timetables = await TimeTable.findAll({
    include: [{ model: User, include: [{ model: db.profile }] }],
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
