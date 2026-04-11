// middleware/auth.js — JWT verification middleware
// Add `protect` to any route that requires a logged-in user
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── protect — blocks request if no valid JWT ──────────────────────
const protect = async (req, res, next) => {
  let token;

  // JWT is sent as: Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorised — please log in first'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired — please log in again' });
  }
};

// ── optionalAuth — attaches user if token present, never blocks ───
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      const token   = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Invalid token — just continue without user attached
    }
  }
  next();
};

// ── authorize — restrict to certain roles ─────────────────────────
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied — role '${req.user.role}' cannot access this route`
    });
  }
  next();
};

module.exports = { protect, optionalAuth, authorize };
