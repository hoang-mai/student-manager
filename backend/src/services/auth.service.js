const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const JwtService = require('./jwt.service');
const { serialize } = require('../utils/serialize');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../utils/apiError');

const User = db.user;
const Student = db.student;
const Commander = db.commander;

const _generateCode = (prefix) => `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const _excludePassword = (user) => serialize(user);

const _generateTokens = (userId) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const accessToken = JwtService.jwtSign({ userId, issuedAt, token: 1 }, { expiresIn: '5h' });
  const refreshToken = JwtService.jwtSign({ userId, issuedAt, token: 2 }, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new BadRequestError('Người dùng không tồn tại');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Mật khẩu không chính xác');
  }

  user.refreshToken = _generateTokens(user.id).refreshToken;
  await user.save();

  const { accessToken, refreshToken } = _generateTokens(user.id);
  return { accessToken, refreshToken, user: _excludePassword(user) };
};

const register = async (data) => {
  const { username, password, role, studentId, commanderId, fullName, email } = data;

  const exist = await User.findOne({ where: { username } });
  if (exist) {
    throw new BadRequestError('Tên đăng nhập đã tồn tại');
  }

  let profileId = null;
  if (role === 'STUDENT' && fullName) {
    if (studentId) {
      const existing = await Student.findOne({ where: { studentId } });
      if (existing) throw new BadRequestError(`Mã học viên ${studentId} đã tồn tại`);
    }
    const student = await Student.create({
      studentId: studentId || _generateCode('HV'),
      fullName,
      email,
    });
    profileId = student.id;
  } else if (role === 'COMMANDER' && fullName) {
    if (commanderId) {
      const existing = await Commander.findOne({ where: { commanderId } });
      if (existing) throw new BadRequestError(`Mã chỉ huy ${commanderId} đã tồn tại`);
    }
    const commander = await Commander.create({
      commanderId: commanderId || _generateCode('CH'),
      fullName,
      email,
    });
    profileId = commander.id;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    role: role || 'STUDENT',
    isAdmin: role === 'ADMIN',
    studentId: role === 'STUDENT' ? (profileId || studentId || null) : null,
    commanderId: role === 'COMMANDER' ? (profileId || commanderId || null) : null,
  });

  return _excludePassword(newUser);
};

const refreshToken = async (token) => {
  const decoded = JwtService.jwtVerify(token);
  if (decoded.token !== 2) {
    throw new UnauthorizedError('Token không hợp lệ');
  }

  const user = await User.findByPk(decoded.userId);
  if (!user) {
    throw new UnauthorizedError('Tài khoản không tồn tại');
  }

  const { accessToken, refreshToken } = _generateTokens(user.id);
  return { accessToken, refreshToken, user: _excludePassword(user) };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Mật khẩu cũ không chính xác');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

module.exports = {
  login,
  register,
  refreshToken,
  changePassword,
};
