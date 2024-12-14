const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Additional role-based authorization
const authorize = (roles = []) => {
  // Convert roles to array if not already
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    authMiddleware,
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      next();
    }
  ];
};

module.exports = {
  authMiddleware,
  authorize
};