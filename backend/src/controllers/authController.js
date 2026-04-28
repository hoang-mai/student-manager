const bcrypt = require('bcrypt');
const db = require('../models');
const Yup = require('yup');
const JwtService = require('../services/jwt.service');
const { success, validateOrThrow } = require('../utils/response');

const User = db.user;
const Role = db.role;

const login = async (req, res) => {
  const schema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });
  await validateOrThrow(schema, req.body);

  const { username, password } = req.body;
  const user = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email: username }] }, include: [{ model: Role }] });
  if (!user) {
    return success(res, null, 'User does not exist', 400);
  }
  if (!user.is_active) {
    return success(res, null, 'Account has been locked', 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return success(res, null, 'Password is incorrect', 401);
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const accessToken = JwtService.jwtSign({ userId: user.id, issuedAt, token: 1 }, { expiresIn: '5h' });
  const refreshToken = JwtService.jwtSign({ userId: user.id, issuedAt, token: 2 }, { expiresIn: '7d' });

  user.last_login_at = new Date();
  await user.save();

  const { password: _, ...userData } = user.get({ plain: true });
  return success(res, { accessToken, refreshToken, user: userData }, 'OK');
};

const register = async (req, res) => {
  const schema = Yup.object().shape({
    username: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
    full_name: Yup.string().required(),
    phone: Yup.string(),
    role_id: Yup.number().integer(),
  });
  await validateOrThrow(schema, req.body);

  const { username, email, password, full_name, phone, role_id } = req.body;
  const exist = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email }] } });
  if (exist) {
    return success(res, null, 'Username or email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRole = role_id || (await Role.findOne({ where: { name: 'hoc_vien' } }))?.id;
  const newUser = await User.create({ username, email, password: hashedPassword, full_name, phone, role_id: defaultRole });

  const { password: _, ...userData } = newUser.get({ plain: true });
  return success(res, userData, 'User created', 201);
};

const refreshToken = async (req, res) => {
  const schema = Yup.object().shape({ refreshToken: Yup.string().required() });
  await validateOrThrow(schema, req.body);

  const { refreshToken } = req.body;
  const decoded = JwtService.jwtVerify(refreshToken);
  if (decoded.token !== 2) {
    return success(res, null, 'Invalid token', 401);
  }

  const user = await User.findByPk(decoded.userId, { include: [{ model: Role }] });
  if (!user || !user.is_active) {
    return success(res, null, 'Account has been locked', 403);
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const accessToken = JwtService.jwtSign({ userId: user.id, issuedAt, token: 1 }, { expiresIn: '5h' });
  const newRefreshToken = JwtService.jwtSign({ userId: user.id, issuedAt, token: 2 }, { expiresIn: '7d' });

  const { password: _, ...userData } = user.get({ plain: true });
  return success(res, { accessToken, refreshToken: newRefreshToken, user: userData }, 'OK');
};

const changePassword = async (req, res) => {
  const schema = Yup.object().shape({
    oldPassword: Yup.string().required(),
    newPassword: Yup.string().required().min(6),
  });
  await validateOrThrow(schema, req.body);

  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.userId);
  if (!user) {
    return success(res, null, 'User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return success(res, null, 'Old password is incorrect', 401);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return success(res, null, 'Password changed successfully');
};

module.exports = {
  login,
  register,
  refreshToken,
  changePassword,
};
