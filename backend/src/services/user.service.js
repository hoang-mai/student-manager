const bcrypt = require('bcrypt');
const db = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/apiError');

const User = db.user;
const Role = db.role;
const StudentProfile = db.studentProfile;
const Op = db.Sequelize.Op;

const _excludePassword = (user) => {
  const { password, ...data } = user.get({ plain: true });
  return data;
};

const getAllUsers = async ({ page = 1, limit = 20, role, search }) => {
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

  return {
    data: rows.map(_excludePassword),
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      { model: Role, attributes: ['id', 'name'] },
      { model: StudentProfile },
    ],
  });
  if (!user) throw new NotFoundError('User not found');
  return _excludePassword(user);
};

const createUser = async ({ username, email, password, full_name, phone, role_id }) => {
  const exist = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
  if (exist) throw new BadRequestError('Username or email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword, full_name, phone, role_id });
  return _excludePassword(newUser);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');

  const { password, ...updateData } = data;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  await user.update(updateData);

  return _excludePassword(user);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  await user.destroy();
};

const toggleActive = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  user.is_active = !user.is_active;
  await user.save();
  return { is_active: user.is_active };
};

const resetPassword = async (id, newPassword = '12345678') => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

const getMyProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, attributes: ['id', 'name'] },
      { model: StudentProfile },
    ],
  });
  if (!user) throw new NotFoundError('User not found');
  return _excludePassword(user);
};

const updateMyProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');

  const { password, role_id, is_active, ...updateData } = data;
  await user.update(updateData);
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
