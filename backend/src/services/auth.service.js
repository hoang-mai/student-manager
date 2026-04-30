const bcrypt = require('bcrypt');
const db = require('../models');
const JwtService = require('./jwt.service');
const { serialize } = require('../utils/serialize');
const { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } = require('../utils/apiError');

const User = db.user;
const Role = db.role;

const _excludePassword = (user) => serialize(user);

const _generateTokens = (userId) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const accessToken = JwtService.jwtSign({ userId, issuedAt, token: 1 }, { expiresIn: '5h' });
  const refreshToken = JwtService.jwtSign({ userId, issuedAt, token: 2 }, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const login = async (username, password) => {
  const user = await User.findOne({
    where: { [db.Sequelize.Op.or]: [{ username }, { email: username }] },
    include: [{ model: Role }],
  });

  if (!user) {
    throw new BadRequestError('Người dùng không tồn tại');
  }
  if (!user.isActive) {
    throw new ForbiddenError('Tài khoản đã bị khóa');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Mật khẩu không chính xác');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = _generateTokens(user.id);
  return { accessToken, refreshToken, user: _excludePassword(user) };
};

const register = async ({ username, email, password, fullName, phone, roleId }) => {
  const exist = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email }] } });
  if (exist) {
    throw new BadRequestError('Tên đăng nhập hoặc email đã tồn tại');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRole = roleId || (await Role.findOne({ where: { name: 'hoc_vien' } }))?.id;
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName,
    phone,
    roleId: defaultRole,
  });

  return _excludePassword(newUser);
};

const refreshToken = async (token) => {
  const decoded = JwtService.jwtVerify(token);
  if (decoded.token !== 2) {
    throw new UnauthorizedError('Token không hợp lệ');
  }

  const user = await User.findByPk(decoded.userId, { include: [{ model: Role }] });
  if (!user || !user.isActive) {
    throw new ForbiddenError('Tài khoản đã bị khóa');
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