const asyncHandler = require('express-async-handler');
const db = require('../models');
const JwtService = require('../services/jwt.service');
const { serialize } = require('../utils/serialize');
const { BadTokenError, ForbiddenError } = require('../utils/apiError');

const User = db.user;
const Role = db.role;

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (process.env.SERVER_JWT === 'false') return next();
  const token = JwtService.jwtGetToken(req);
  if (!token) throw new BadTokenError();
  const decoded = JwtService.jwtVerify(token);
  const user = await User.findByPk(decoded.userId, { include: [{ model: Role }] });
  if (!user || !user.isActive) {
    throw new BadTokenError('Tài khoản đã bị khóa hoặc không tồn tại');
  }
  const plainUser = serialize(user);
  req.userId = plainUser.id;
  req.user = plainUser;
  return next();
});

const requireRole = (...roleNames) => {
  return asyncHandler(async (req, res, next) => {
    if (process.env.SERVER_JWT === 'false') return next();
    if (!req.user) {
      throw new BadTokenError();
    }
    if (!req.user.role || !roleNames.includes(req.user.role.name)) {
      throw new ForbiddenError();
    }
    return next();
  });
};

module.exports = {
  authMiddleware,
  requireRole,
};
