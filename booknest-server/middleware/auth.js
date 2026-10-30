const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpError = require('../utils/httpError');

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw httpError(401, 'Please log in.');
  let payload;
  try {
    payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch {
    throw httpError(401, 'Your session has expired. Please log in again.');
  }
  const user = await User.findById(payload.id);
  if (!user) throw httpError(401, 'Account not found.');
  if (user.status === 'Inactive') throw httpError(403, 'This account is inactive. Contact the admin.');
  req.user = user;
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') throw httpError(403, 'Admin access only.');
  next();
};
