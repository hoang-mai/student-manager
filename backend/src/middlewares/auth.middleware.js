const asyncHandler = require('express-async-handler');
const db = require('../models');
const JwtService = require('../services/jwt.service');
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
  req.userId = user.id;
  req.user = user;
  return next();
});

const requireRole = (...roleNames) => {
  return asyncHandler(async (req, res, next) => {
    if (process.env.SERVER_JWT === 'false') return next();
    if (!req.user) {
      throw new BadTokenError();
    }
    if (!req.user.Role || !roleNames.includes(req.user.Role.name)) {
      throw new ForbiddenError();
    }
    return next();
  });
};

module.exports = {
  authMiddleware,
  requireRole,
};
