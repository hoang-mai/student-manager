const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

const User = db.user;
const Student = db.student;
const Commander = db.commander;

const _generateCode = (prefix) => `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const _hashPassword = (password) => bcrypt.hash(password || '123456', 10);

const _createProfile = async (data, requester) => {
  if (data.role === 'COMMANDER' && requester && requester.role === 'COMMANDER') {
    throw new ForbiddenError('Chỉ huy không thể tạo tài khoản chỉ huy');
  }

  if (data.role === 'STUDENT' && data.fullName) {
    if (data.studentId) {
      const existing = await Student.findOne({ where: { studentId: data.studentId } });
      if (existing) throw new BadRequestError(`Mã học viên ${data.studentId} đã tồn tại`);
    }
    const student = await Student.create({
      studentId: data.studentId || _generateCode('HV'),
      fullName: data.fullName,
      email: data.email,
    });
    data.studentId = student.id;
  }

  if (data.role === 'COMMANDER' && data.fullName) {
    if (data.commanderId) {
      const existing = await Commander.findOne({ where: { commanderId: data.commanderId } });
      if (existing) throw new BadRequestError(`Mã chỉ huy ${data.commanderId} đã tồn tại`);
    }
    const commander = await Commander.create({
      commanderId: data.commanderId || _generateCode('CH'),
      fullName: data.fullName,
      email: data.email,
    });
    data.commanderId = commander.id;
  }

  return data;
};

// ===================== CRUD Cơ bản =====================

const create = async (data, requester) => {
  await _createProfile(data, requester);

  if (data.password) {
    data.password = await _hashPassword(data.password);
  }

  delete data.fullName;
  delete data.email;
  return User.create(data);
};

const getAll = async (query) => paginateQuery(User, query, {
  filterFields: ['username', 'role', 'isAdmin', 'isActive'],
  include: [
    {
      model: Student,
      include: [
        { model: db.university },
        { model: db.class },
        { model: db.organization },
        { model: db.educationLevel },
      ],
    },
    { model: Commander },
  ],
});

const getDetail = async (id) => {
  const record = await User.findByPk(id, {
    include: [
      {
        model: Student,
        include: [
          { model: db.university },
          { model: db.class },
          { model: db.organization },
          { model: db.educationLevel },
        ],
      },
      { model: Commander },
    ],
  });
  if (!record) throw new NotFoundError('Không tìm thấy người dùng');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  if (data.fullName || data.email) {
    if (record.Student) {
      await record.Student.update({
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.email && { email: data.email }),
      });
    } else if (record.Commander) {
      await record.Commander.update({
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.email && { email: data.email }),
      });
    }
    delete data.fullName;
    delete data.email;
  }

  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

// ===================== CH-01: Quản lý tài khoản học viên =====================

const createBatchUsers = async (users, requester) => {
  const results = [];
  for (const u of users) {
    const exist = await User.findOne({ where: { username: u.username } });
    if (exist) {
      results.push({ username: u.username, status: 'SKIPPED', message: 'Tên đăng nhập đã tồn tại' });
      continue;
    }

    try {
      await _createProfile(u, requester);

      const hashedPassword = await _hashPassword(u.password);
      await User.create({
        username: u.username,
        password: hashedPassword,
        role: u.role || 'STUDENT',
        isAdmin: u.role === 'ADMIN',
        studentId: u.role === 'STUDENT' ? u.studentId : null,
        commanderId: u.role === 'COMMANDER' ? u.commanderId : null,
      });
      results.push({ username: u.username, status: 'CREATED' });
    } catch (err) {
      results.push({ username: u.username, status: 'ERROR', message: err.message });
    }
  }
  return results;
};

const resetPassword = async (userId, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');

  const hashedPassword = await bcrypt.hash(newPassword || '123456', 10);
  await user.update({ password: hashedPassword });
  return { message: 'Đặt lại mật khẩu thành công' };
};

const toggleActive = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');

  const newStatus = !user.isActive;
  await user.update({ isActive: newStatus });
  return { isActive: newStatus };
};

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  createBatchUsers,
  resetPassword,
  toggleActive,
};
