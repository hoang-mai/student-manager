const bcrypt = require('bcrypt');
const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');

const User = db.user;

// ===================== CRUD Cơ bản =====================

const create = async (data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return User.create(data);
};

const getAll = async () => User.findAll();

const getDetail = async (id) => {
  const record = await User.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy người dùng');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

// ===================== CH-01: Quản lý tài khoản học viên =====================

const createBatchUsers = async (users) => {
  const results = [];
  for (const u of users) {
    const exist = await User.findOne({ where: { username: u.username } });
    if (exist) {
      results.push({ username: u.username, status: 'SKIPPED', message: 'Tên đăng nhập đã tồn tại' });
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password || '123456', 10);
    await User.create({
      username: u.username,
      password: hashedPassword,
      role: u.role || 'STUDENT',
      isAdmin: u.role === 'ADMIN',
      studentId: u.studentId || null,
      commanderId: u.commanderId || null,
    });
    results.push({ username: u.username, status: 'CREATED' });
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
  const user = await User.findByPk(userId, { paranoid: false });
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');

  if (user.deletedAt) {
    await user.restore();
    return { status: 'ACTIVE' };
  } else {
    await user.destroy();
    return { status: 'LOCKED' };
  }
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
