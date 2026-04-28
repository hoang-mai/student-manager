const bcrypt = require('bcrypt');
const db = require('../models');
const JwtService = require('./jwt.service');
const { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } = require('../utils/apiError');

const User = db.user;
const Role = db.role;

const _excludePassword = (user) => {
  const { password, ...userData } = user.get({ plain: true });
  return userData;
};

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
    throw new BadRequestError('User does not exist');
  }
  if (!user.is_active) {
    throw new ForbiddenError('Account has been locked');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Password is incorrect');
  }

  user.last_login_at = new Date();
  await user.save();

  const { accessToken, refreshToken } = _generateTokens(user.id);
  return { accessToken, refreshToken, user: _excludePassword(user) };
};

const register = async ({ username, email, password, full_name, phone, role_id }) => {
  const exist = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email }] } });
  if (exist) {
    throw new BadRequestError('Username or email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRole = role_id || (await Role.findOne({ where: { name: 'hoc_vien' } }))?.id;
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    full_name,
    phone,
    role_id: defaultRole,
  });

  return _excludePassword(newUser);
};

const refreshToken = async (token) => {
  const decoded = JwtService.jwtVerify(token);
  if (decoded.token !== 2) {
    throw new UnauthorizedError('Invalid token');
  }

  const user = await User.findByPk(decoded.userId, { include: [{ model: Role }] });
  if (!user || !user.is_active) {
    throw new ForbiddenError('Account has been locked');
  }

  const { accessToken, refreshToken } = _generateTokens(user.id);
  return { accessToken, refreshToken, user: _excludePassword(user) };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Old password is incorrect');
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
