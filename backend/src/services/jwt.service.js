const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const jwtSign = (payload, options = {}) => jwt.sign(payload, JWT_SECRET, options);

const jwtVerify = (token) => jwt.verify(token, JWT_SECRET);

const jwtGetToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

module.exports = {
  jwtSign,
  jwtVerify,
  jwtGetToken,
};
