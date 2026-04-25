const bcrypt = require('bcrypt');
const db = require('../models');
const Yup = require('yup');
const { success, paginated, validateOrThrow } = require('../utils/response');

const User = db.user;
const Role = db.role;
const StudentProfile = db.studentProfile;
const Op = db.Sequelize.Op;

const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { full_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const include = [{ model: Role, attributes: ['id', 'name'] }];
  if (role) include[0].where = { name: role };

  const { count, rows } = await User.findAndCountAll({
    where,
    include,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']],
  });

  return paginated(res, rows, { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages: Math.ceil(count / limit) });
};

const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      { model: Role, attributes: ['id', 'name'] },
      { model: StudentProfile },
    ],
  });
  if (!user) return success(res, null, 'User not found', 404);

  const { password, ...data } = user.get({ plain: true });
  return success(res, data);
};

const createUser = async (req, res) => {
  const schema = Yup.object().shape({
    username: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
    full_name: Yup.string().required(),
    role_id: Yup.number().integer().required(),
  });
  await validateOrThrow(schema, req.body);

  const { username, email, password, full_name, phone, role_id } = req.body;
  const exist = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
  if (exist) return success(res, null, 'Username or email already exists', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword, full_name, phone, role_id });

  const { password: _, ...data } = newUser.get({ plain: true });
  return success(res, data, 'User created', 201);
};

const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return success(res, null, 'User not found', 404);

  const { password, ...updateData } = req.body;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  await user.update(updateData);

  const { password: _, ...data } = user.get({ plain: true });
  return success(res, data, 'User updated');
};

const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return success(res, null, 'User not found', 404);
  await user.destroy();
  return success(res, null, 'User deleted');
};

const toggleActive = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return success(res, null, 'User not found', 404);
  user.is_active = !user.is_active;
  await user.save();
  return success(res, { is_active: user.is_active }, 'User status updated');
};

const resetPassword = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return success(res, null, 'User not found', 404);
  const newPassword = req.body.newPassword || '12345678';
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return success(res, null, 'Password reset successfully');
};

const getMyProfile = async (req, res) => {
  const user = await User.findByPk(req.userId, {
    include: [
      { model: Role, attributes: ['id', 'name'] },
      { model: StudentProfile },
    ],
  });
  if (!user) return success(res, null, 'User not found', 404);

  const { password, ...data } = user.get({ plain: true });
  return success(res, data);
};

const updateMyProfile = async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return success(res, null, 'User not found', 404);

  const { password, role_id, is_active, ...updateData } = req.body;
  await user.update(updateData);
  return success(res, null, 'Profile updated');
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleActive,
  resetPassword,
  getMyProfile,
  updateMyProfile,
};
