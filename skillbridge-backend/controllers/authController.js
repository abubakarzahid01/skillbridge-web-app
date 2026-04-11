// controllers/authController.js — Signup, login, Google OAuth, get current user
const { validationResult } = require('express-validator');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── POST /api/auth/signup ─────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, password, role } = req.body;

    // Reject if email already registered
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please log in.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token:   generateToken(user._id),
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Find user and include password (it's hidden by default with select:false)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token:   generateToken(user._id),
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me — returns current logged-in user ─────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── GET /api/auth/google/callback — called by Google after OAuth ──
const googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user._id);
    // Redirect to frontend callback page with token in URL
    const redirectUrl =
      `${process.env.FRONTEND_URL}/auth-callback.html` +
      `?token=${token}` +
      `&name=${encodeURIComponent(req.user.name)}` +
      `&role=${req.user.role}` +
      `&avatar=${encodeURIComponent(req.user.avatar || '')}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login.html?error=oauth_failed`);
  }
};

module.exports = { signup, login, getMe, googleCallback };
