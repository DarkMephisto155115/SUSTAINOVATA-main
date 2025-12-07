const jwt = require('jsonwebtoken');
const { secret } = require('../config/env').jwt;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
    req.user = decoded;
    next();
  });
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied', 
        requiredRoles: allowedRoles,
        userRole: req.user.role 
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorize
};
